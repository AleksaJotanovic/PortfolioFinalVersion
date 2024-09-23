import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../models/category.model';
import { AlexitService } from '../../../services/alexit.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../../../models/product.model';
import { categoriesSortingTriggers } from '../../../../constants/categories-sorting';

@Component({
  selector: 'categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

  categoriesBase: Category[] = [];

  paginatedCategories: Category[][] = [];

  currentPile: number = 0;

  sortingTriggers = categoriesSortingTriggers;

  trigger: string = "";

  order: string = "";





  constructor(private alexit: AlexitService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(q => {
      this.alexit.categories$.subscribe(v => {

        this.currentPile = Number(q["currentPile"]);

        const initPagination = () => {
          let arr = [];
          for (let i = 0; i < this.categoriesBase.length; i += Number(q["limit"])) {
            arr.push(this.categoriesBase.slice(i, i + Number(q["limit"])));
            this.paginatedCategories = arr;
          }
          if (this.paginatedCategories.length > 0) {
            this.categories = this.paginatedCategories[this.currentPile];
          }
        };



        if (q["limit"] && q["currentPile"]) {
          initPagination();
        }

        if (q["searchQuery"]) {
          this.categoriesBase = v.filter(x => (x.name + this.parentName(x.parent_id) +
            x.configuratorField + String(x.specifications.length) + String(this.productsInCategory(x._id))).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else {
          this.categoriesBase = v;
          initPagination();
        }

        if (q["sortBy"] && q["inOrder"]) {
          this.trigger = q["sortBy"];
          this.order = q["inOrder"];

          switch (q["sortBy"]) {
            case this.sortingTriggers.NAME:
              this.categoriesBase = this.categoriesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.name.localeCompare(b.name);
                } else if (q["inOrder"] === "desc") {
                  return b.name.localeCompare(a.name);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.PARENT:
              this.categoriesBase = this.categoriesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return this.parentName(a.parent_id).localeCompare(this.parentName(b.parent_id))
                } else if (q["inOrder"] === "desc") {
                  return this.parentName(b.parent_id).localeCompare(this.parentName(a.parent_id))
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.CONFIGURATOR_FIELD:
              this.categoriesBase = this.categoriesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.configuratorField.localeCompare(b.configuratorField);
                } else if (q["inOrder"] === "desc") {
                  return b.configuratorField.localeCompare(a.configuratorField);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.SPECIFICATIONS:
              this.categoriesBase = this.categoriesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.specifications.length - b.specifications.length;
                } else if (q["inOrder"] === "desc") {
                  return b.specifications.length - a.specifications.length;
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.PRODUCTS:
              this.categoriesBase = this.categoriesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return this.productsInCategory(a._id) - this.productsInCategory(b._id);
                } else if (q["inOrder"] === "desc") {
                  return this.productsInCategory(b._id) - this.productsInCategory(a._id);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
          }
        }


      });
    });
  }








  delete(category: Category) {
    this.alexit.deleteCategory(category._id, category.image);
  }

  parentName(id: string) {
    const category = this.categories.filter(x => x._id === id)[0];
    return category ? category.name : "";
  }

  productsInCategory(category_id: string) {
    let products: Product[] = [];
    this.alexit.products$.subscribe(v => products = v.filter(x => x.category_id === category_id));
    return products ? products.length : 0;
  }

  updateFilters(input: HTMLInputElement) {
    if (input.value === "") {
      const currentUrlTree = this.router.parseUrl(this.router.url);
      delete currentUrlTree.queryParams["searchQuery"];
      this.router.navigateByUrl(currentUrlTree);
    } else {
      this.router.navigate([], { relativeTo: this.route, queryParams: { searchQuery: input.value }, queryParamsHandling: "merge" });
    }
  }

  sort(button: any) {
    this.trigger = button.id;
    switch (this.order) {
      case "":
        this.order = "asc";
        break;
      case "asc":
        this.order = "desc";
        break;
      case "desc":
        this.order = "";
        break;
    }
    if (this.order === "") {
      const currentUrlTree = this.router.parseUrl(this.router.url);
      delete currentUrlTree.queryParams["sortBy"];
      delete currentUrlTree.queryParams["inOrder"];
      this.router.navigateByUrl(currentUrlTree);
    } else {
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: this.trigger, inOrder: this.order }, queryParamsHandling: "merge" });
    }
  }

  nextPile() {
    if ((this.currentPile + 1) < this.paginatedCategories.length) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile + 1 }, queryParamsHandling: "merge" });
    }
  }

  previousPile() {
    if (this.currentPile !== 0) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile - 1 }, queryParamsHandling: "merge" });
    }
  }







}