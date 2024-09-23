import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../../models/category.model';
import { AlexitService } from '../../../../services/alexit.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configurator } from '../../../../../constants/configurator';
import { PtIfPipe } from '../../../../pipes/pt-if.pipe';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { CrudService } from '../../../../services/crud.service';

@Component({
  selector: 'categories-editor',
  standalone: true,
  imports: [ReactiveFormsModule, PtIfPipe, NgFor, RouterLink, NgStyle, NgClass],
  templateUrl: './categories-editor.component.html',
  styleUrl: './categories-editor.component.css'
})
export class CategoriesEditorComponent implements OnInit {

  categories: Category[] = [];

  category!: Category;

  categoryForm: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    specifications: new FormArray([]),
    parent_id: new FormControl(""),
    configuratorField: new FormControl({ value: "", disabled: true })
  });

  fileToUpload: any;

  configuratorPlayfield = configurator.playfield;






  constructor(private alexit: AlexitService, private router: Router, private route: ActivatedRoute, private crud: CrudService) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.alexit.categories$.subscribe(v => {
        this.categories = v;
        this.category = this.categories.filter(x => x._id === params["id"])[0];
        if (this.category) {
          this.categoryForm.patchValue({
            name: this.category.name,
            parent_id: this.category.parent_id,
            configuratorField: this.category.configuratorField
          });
          this.specifications.clear();
          this.category.specifications.forEach(spec => {
            const specGroup = this.newSpecification();
            specGroup.patchValue({
              key: spec.key,
              values: []
            });
            spec.values.forEach(value => {
              const valuesArray = specGroup.get('values') as FormArray;
              valuesArray.push(new FormControl(value));
            });
            this.specifications.push(specGroup);
          });
        }
      });
    });
  }








  handleFileInput(e: any, image: HTMLImageElement) {
    this.fileToUpload = e.target.files.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      image.src = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  get specifications(): FormArray {
    return this.categoryForm.get('specifications') as FormArray;
  }

  newSpecification(): FormGroup {
    return new FormGroup({ key: new FormControl(""), values: new FormArray([]) })
  }

  addSpecification() {
    this.specifications.push(this.newSpecification());
  }

  addValue(specIndex: number, e: any) {
    const values = this.getValues(specIndex);
    values.push(new FormControl(e.target.value))
    e.target.value = "";
  }

  removeSpecification(specIndex: number) {
    this.specifications.removeAt(specIndex);
  }

  removeValue(specIndex: number, valueIndex: number) {
    const values = this.getValues(specIndex);
    values.removeAt(valueIndex);
  }

  getValues(specIndex: number): FormArray {
    return this.specifications.at(specIndex).get('values') as FormArray;
  }

  save(imageInput: HTMLInputElement) {
    if (this.category) {
      this.update(imageInput);
    } else {
      this.add(imageInput);
    }
    this.router.navigate(["admin/categories"]);
  }

  add(imageInput: HTMLInputElement) {
    const imageBlob = imageInput.files as FileList;
    const file = new FormData();
    file.set("file", imageBlob[0]);
    const form = this.categoryForm.value;
    const parent = this.categories.find(c => c._id === form.parent_id);
    if (parent !== undefined) {
      const category: any = { name: form.name, parent_id: parent._id, specifications: form.specifications, configuratorField: form.configuratorField };
      this.alexit.addCategory(category, file);
    } else {
      const category: any = { name: form.name, parent_id: "", specifications: form.specifications, configuratorField: form.configuratorField };
      this.alexit.addCategory(category, file);
    }
  }

  update(imageInput: HTMLInputElement) {
    const category = {
      name: this.categoryForm.value.name,
      parent_id: this.categoryForm.value.parent_id,
      configuratorField: this.categoryForm.value.configuratorField,
      specifications: this.categoryForm.value.specifications,
    };
    let isImageSelected = false;
    if (imageInput.value !== "") {
      isImageSelected = true;
    }
    if (isImageSelected) {
      const file = new FormData();
      file.set("file", this.fileToUpload);
      this.crud.categoryImageUpload(file).subscribe((res: any) => {
        let categoryBody = {
          _id: this.category?._id,
          name: category.name,
          parent_id: category.parent_id,
          specifications: category.specifications,
          image: `http://localhost:3000/categories/${res.data}`,
          configuratorField: category.configuratorField
        };
        this.alexit.updateCategory(categoryBody);
        if (this.category !== undefined) {
          this.alexit.deleteAnyFile(this.category.image);
        }
      });
    } else {
      let categoryBody = {
        _id: this.category?._id,
        name: category.name,
        parent_id: category.parent_id,
        specifications: category.specifications,
        image: this.category?.image,
        configuratorField: category.configuratorField
      };
      this.alexit.updateCategory(categoryBody);
    }
  }

  collapseSpecGrid(grid: HTMLDivElement, e: any) {
    grid.classList.toggle("active");
    e.currentTarget.classList.toggle("active");
  }






}