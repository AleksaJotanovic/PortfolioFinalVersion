import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Offer } from '../../../../../models/offer.model';
import { AlexitService } from '../../../../services/alexit.service';
import { FormsModule } from '@angular/forms';
import { MyLibraryService } from '../../../../services/my-library.service';
import { Product } from '../../../../../models/product.model';
import { v4 as uuid } from 'uuid';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'offer-editor',
  standalone: true,
  imports: [RouterLink, FormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatButton, NgStyle, NgClass],
  templateUrl: './offer-editor.component.html',
  styleUrl: './offer-editor.component.css'
})
export class OfferEditorComponent implements OnInit {

  offerCategories: { _id: string, name: string }[] = [];

  featuredImage: FormData = new FormData();

  offer: Offer = {
    _id: "",
    category_id: "",
    title: "",
    featuredImage: "",
    text: "",
    products: [],
    discountImpact: 0,
    published: false,
    date: {
      created: "",
      expires: ""
    }
  }

  @ViewChildren('textarea') textareas!: QueryList<ElementRef<HTMLTextAreaElement>>;

  id: string = "";

  idIncrementor: number = -1;

  date_expires_formated: string = "";

  products: Product[] = [];

  offers: Offer[] = [];






  constructor(private alexit: AlexitService, private route: ActivatedRoute, private router: Router, private $: MyLibraryService) { }
  ngOnInit(): void {
    this.alexit.offerCategories$.subscribe({ next: v => this.offerCategories = v, error: err => console.log(err) });
    this.initProduct();
    this.route.params.subscribe(p => {
      this.id = p["id"] || "";
      this.alexit.offers$.subscribe(v => {
        const offer = v.filter(o => o._id === this.id)[0];
        this.offers = v.filter(o => o._id !== this.id);
        if (offer && this.id !== "") {
          this.offer = offer;
          if (this.offer.text !== "" && this.offer.title !== "") {
            this.date_expires_formated = this.$.dateYearMonthDay(this.offer.date.expires);
            setTimeout(() => {
              this.textareas.forEach(txt => this.fitTextareaDimensions({ target: txt.nativeElement }));
            }, 0);
          }
        }
      })
    })
  }





  initProduct() {
    this.alexit.products$.subscribe(v => this.products = v);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.textareas.forEach(txt => this.fitTextareaDimensions({ target: txt.nativeElement }));
  }

  fitTextareaDimensions(e: any) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }


  deleteSelectedFeaturedImage(e: any, featuredImage: HTMLImageElement) {
    e.target.value = "";
    this.featuredImage.delete('file');
    if (!this.featuredImage.get('file')) {
      featuredImage.src = this.offer.featuredImage;
    }
  }

  uploadFeaturedImage(e: any, featuredImage: HTMLImageElement) {
    let imageBlob = e.target.files;
    this.featuredImage.set("file", imageBlob[0]);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      featuredImage.src = event.target.result;
    }
    reader.readAsDataURL(imageBlob.item(0));
  }

  submit() {
    if (this.id !== "") {
      this.update();
    } else {
      this.publish();
    }
  }

  publish() {
    this.offer.published = true;
    if (this.offer.published) {
      this.alexit.createOffer({ ...this.offer, _id: uuid() }, this.featuredImage);
      for (let id of this.offer.products) {
        const product = this.products.find(p => p._id === id);
        if (product !== undefined) {
          this.alexit.updateProduct({ ...product, price: { ...product.price, discount: { value: this.offer.discountImpact, activationDate: String(new Date()) } } });
        }
      }
    }
    this.router.navigate(['admin/offers'], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", offerCategoryId: "all" } });
  }

  update() {
    this.alexit.updateOffer(this.offer, this.featuredImage);
    this.router.navigate(['admin/offers'], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", offerCategoryId: "all" } });
  }

  saveDraft() {
    this.offer.published = false;
    if (!this.offer.published) {
      this.offer.products = [];
      this.alexit.createOffer({ ...this.offer, _id: uuid() }, this.featuredImage);
    }
    this.router.navigate(['admin/offers'], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", offerCategoryId: "all" } });
  }

  delete(id: string) {
    this.alexit.deleteAnyFile(this.offer.featuredImage);
    for (let id of this.offer.products) {
      const product = this.products.find(p => p._id === id);
      if (product !== undefined) {
        this.alexit.updateProduct({ ...product, price: { ...product.price, discount: { value: 0, activationDate: "" } } });
      }
    }
    this.alexit.deleteOffer(id);
    this.router.navigate(['admin/offers'], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", offerCategoryId: "all" } });
  }

  setExpirationValue(e: any) {
    const offers = this.offers.filter(x => this.$.dateYearMonthDay(x.date.expires) === e.target.value);
    if (new Date(e.target.value).valueOf() > new Date().valueOf() && offers.length === 0) {
      this.offer.date.expires = String(new Date(e.target.value));
    } else {
      e.target.value = "";
    }

  }

  toggleProduct(product_id: string) {
    if (!this.offer.products.includes(product_id)) {
      this.offer.products.push(product_id);
    } else {
      this.offer.products = this.offer.products.filter(id => id !== product_id);
    }
  }



  searchProducts(e: any) {
    this.initProduct();
    this.products = this.products.filter(x => (this.categoryName(x.category_id) + x.name + x.sku).toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0)
  }


  categoryName(id: string): string {
    let categoryName: string = "";
    this.alexit.categories$.subscribe(v => categoryName = v.filter(c => c._id === id)[0].name);
    return categoryName ? categoryName : "";
  }

  busyProduct(id: string): boolean {
    const offer = this.offers.filter(o => o.products.includes(id))[0];
    return offer ? true : false;
  }


  addOfferCategory(e: any) {
    this.alexit.addOfferCategory(e.target.value);
    e.target.value = "";
  }







}