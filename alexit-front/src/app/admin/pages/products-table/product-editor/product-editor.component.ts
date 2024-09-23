import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Category } from '../../../../../models/category.model';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyLibraryService } from '../../../../services/my-library.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlexitService } from '../../../../services/alexit.service';
import { Product } from '../../../../../models/product.model';
import { CtgIfPipe } from '../../../../pipes/ctg-if.pipe';
import { NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'product-editor',
  standalone: true,
  imports: [ReactiveFormsModule, CtgIfPipe, NgFor, NgStyle, RouterLink],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.css'
})
export class ProductEditorComponent implements OnInit {

  categories: Category[] = [];

  productForm: FormGroup = new FormGroup({
    category_id: new FormControl("", [Validators.required]),
    name: new FormControl("", [Validators.required, Validators.minLength(5)]),
    description: new FormControl(""),
    uom: new FormControl("", [Validators.required]),
    sku: new FormControl("", [Validators.required, Validators.minLength(5)]),
    price: new FormGroup({
      margin: new FormControl(0, [Validators.required]),
      purchase: new FormControl(0, [Validators.required]),
      regular: new FormControl(0, [Validators.required]),
      sale: new FormControl(0, [Validators.required]),
      earning: new FormControl(0, [Validators.required]),
      discount: new FormControl(0)
    }),
    specifications: new FormArray([]),
    inStock: new FormControl(0, [Validators.required]),
    weight: new FormControl(0, [Validators.required]),
    published: new FormControl(false, [Validators.required]),
    // creationDate: new FormControl(""),
    includedAsRecommended: new FormControl(false, [Validators.required])
  });

  categorySpecifications: { key: string, values: string[] }[] = [];

  images: string[] = [];

  selectedCategory: any = {};

  id: string = "";

  @ViewChildren("summaryImg") summaryImgs!: QueryList<ElementRef<HTMLImageElement>>;

  summaryFiles: FormData = new FormData();






  constructor(public route: ActivatedRoute, private alexit: AlexitService, private router: Router, private $: MyLibraryService) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"] || "";
    if (this.id !== "") {
      this.alexit.products$.subscribe(prodsSubValue => {
        const product = prodsSubValue.filter(prod => prod._id === this.id)[0]
        if (product) {
          this.productForm.patchValue({
            category_id: product.category_id,
            name: product.name,
            description: product.description,
            uom: product.uom,
            sku: product.sku,
            price: {
              margin: product.price.margin,
              purchase: product.price.purchase,
              regular: product.price.regular,
              sale: product.price.sale,
              earning: product.price.earning,
              discount: product.price.discount.value
            },
            specifications: product.specifications,
            inStock: product.inStock,
            weight: product.weight,
            published: product.published
          });
          this.images = product.images;
          this.alexit.categories$.subscribe(ctgsSubValue => {
            this.categories = ctgsSubValue;
            if (this.categories.length > 0 && product !== undefined) {
              const category = this.categories.find(c => c._id === product.category_id);
              if (category !== undefined) this.categorySpecifications = category.specifications;

              for (let spec of product.specifications) {
                const specGroup = new FormGroup({ key: new FormControl(''), value: new FormControl('') });
                for (let ctgSpec of this.categorySpecifications) {
                  const value = ctgSpec.values.find(v => v === spec.value);
                  if (value !== undefined) {
                    specGroup.patchValue({
                      key: spec.key,
                      value: value
                    });
                  }
                }
                this.specifications.push(specGroup);
              }
            }
          });
        }
      });
    } else {
      this.alexit.categories$.subscribe(v => this.categories = v);
    }
  }




  save() {
    if (this.id !== "") {
      this.update();
    } else {
      this.add();
    }
  }





  update() {
    let formdata = new FormData();
    formdata = this.summaryFiles;
    const product: Product = {
      ...this.productForm.value,
      _id: this.route.snapshot.params['id'],
    };
    this.alexit.updateProductWithImages({
      ...product, creationDate: product.creationDate, includedAsRecommended: product.includedAsRecommended, images: this.images,
      price: { ...product.price, discount: { value: this.productForm.value.price.discount, activationDate: String(new Date()) } }
    }, formdata);
    this.router.navigate(["admin/products"], { queryParams: { limit: 12, currentPile: 0, categoryId: "all" } });
  }

  add() {
    let formdata = new FormData();
    formdata = this.summaryFiles;
    this.alexit.addProduct({
      ...this.productForm.value, creationDate: String(new Date()), includedAsRecommended: false,
      price: { ...this.productForm.value.price, discount: { value: this.productForm.value.price.discount, activationDate: this.productForm.value.price.discount > 0 ? String(new Date()) : "" } }
    }, formdata);
    this.productForm.reset();
    this.router.navigate(["admin/products"], { queryParams: { limit: 12, currentPile: 0, categoryId: "all" } })
  }



  handleFileInput(productImages: HTMLInputElement, remainingImagesOutput: HTMLDivElement) {
    let files = productImages.files as FileList;
    for (let i = 0; i < files.length; i++) {
      this.summaryFiles.append("files", files[i]);
    }
    for (let i = 0; i < this.summaryFiles.getAll("files").length; i++) {
      let placing = i + this.images.length;
      if (placing < 3) {
        const file = this.summaryFiles.getAll("files")[i] as any;
        let reader = new FileReader();
        reader.onload = (e: any) => this.summaryImgs.toArray()[placing].nativeElement.src = e.target.result;
        reader.readAsDataURL(file);
        this.summaryImgs.toArray()[placing].nativeElement.style.display = "block";
      }
      if ((this.images.length + this.summaryFiles.getAll("files").length) > 3) {
        remainingImagesOutput.style.display = "flex";
      }
    }
  }

  matchingValues(matchingKey: string): string[] {
    const matchingSpec = this.categorySpecifications.find(spec => spec.key === matchingKey);
    if (matchingSpec !== undefined) return matchingSpec.values;
    return [];
  }

  countPrices() {
    this.productForm.patchValue({
      price: {
        ...this.productForm.value.price,
        regular: this.$.countRegularPrice(this.productForm.value.price.margin, this.productForm.value.price.purchase),
        sale: this.$.countSalePrice(this.$.countRegularPrice(this.productForm.value.price.margin, this.productForm.value.price.purchase)),
        earning: this.$.countEarning(this.productForm.value.price.margin, this.$.countRegularPrice(this.productForm.value.price.margin, this.productForm.value.price.purchase)),
      }
    });
  }

  get specifications() {
    return this.productForm.get('specifications') as FormArray<FormGroup<{ key: FormControl, value: FormControl }>>;
  }

  newSpecification(key: string) {
    this.specifications.push(new FormGroup({ key: new FormControl(key), value: new FormControl('') }));
  }


  onCategorySelect(categoryId: string) {
    this.specifications.clear();
    if (this.id !== "") {
      for (let ctg of this.categories) {
        if (ctg._id === categoryId) {
          this.categorySpecifications = ctg.specifications;
        }
      }
      for (let spec of this.categorySpecifications) {
        this.newSpecification(spec.key);
      }
    } else {
      for (let ctg of this.categories) {
        if (ctg._id === categoryId) {
          this.selectedCategory = ctg;
        }
      }
      for (let spec of this.selectedCategory.specifications) {
        this.newSpecification(spec.key);
      }
    }
  }







}
