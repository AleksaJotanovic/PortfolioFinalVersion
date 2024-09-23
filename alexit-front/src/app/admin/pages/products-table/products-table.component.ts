import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../models/category.model';
import { Product } from '../../../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CtgIfPipe } from '../../../pipes/ctg-if.pipe';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AlexitService } from '../../../services/alexit.service';
import { MyLibraryService } from '../../../services/my-library.service';
import { stockSortTriggers } from '../../../../constants/stock-sorting';

@Component({
  selector: 'products-table',
  standalone: true,
  imports: [FormsModule, CtgIfPipe, NgStyle, NgIf, RouterLink, NgFor, RouterLinkActive, NgClass],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.css'
})
export class ProductsTableComponent implements OnInit {

  products: Product[] = [];

  paginatedProducts: Product[][] = [];

  productsBase: Product[] = [];

  currentPile: number = 0;

  categories: Category[] = [];

  order: string = "";

  trigger: string = "";

  sortTriggers = stockSortTriggers;

  recommendationMode: boolean = false;







  constructor(private alexit: AlexitService, private router: Router, private route: ActivatedRoute, public $: MyLibraryService) { }
  ngOnInit(): void {
    this.alexit.categories$.subscribe(v => this.categories = v);
    this.route.queryParams.subscribe(q => {
      this.alexit.products$.subscribe(v => {

        if (this.productsBase.length === 0) this.productsBase = v;
        this.currentPile = Number(q["currentPile"]);


        const initPagination = () => {
          let arr = [];
          for (let i = 0; i < this.productsBase.length; i += Number(q["limit"])) {
            arr.push(this.productsBase.slice(i, i + Number(q["limit"])));
            this.paginatedProducts = arr;
          }
          if (this.paginatedProducts.length > 0) {
            this.products = this.paginatedProducts[this.currentPile];
          }
        }


        if (q["limit"] && q["currentPile"]) {
          initPagination();
        }



        if (q["searchQuery"] && q["categoryId"] === "all" && q["status"] === "both") {
          this.productsBase = v.filter(x => (this.categoryName(x.category_id) + x.name + x.sku).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (!q["searchQuery"] && q["categoryId"] !== "all" && q["status"] === "both") {
          this.productsBase = v.filter(x => x.category_id === q["categoryId"]);
          initPagination();
        } else if (!q["searchQuery"] && q["categoryId"] === "all" && q["status"] !== "both") {
          this.productsBase = v.filter(x => String(x.published) === q["status"]);
          initPagination();
        } else if (!q["searchQuery"] && q["categoryId"] !== "all" && q["status"] !== "both") {
          this.productsBase = v.filter(x => x.category_id === q["categoryId"]).filter(x => String(x.published) === q["status"]);
          initPagination();
        } else if (q["searchQuery"] && q["categoryId"] === "all" && q["status"] !== "both") {
          this.productsBase = v.filter(x => String(x.published) === q["status"])
            .filter(x => (this.categoryName(x.category_id) + x.name + x.sku).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (q["searchQuery"] && q["categoryId"] !== "all" && q["status"] === "both") {
          this.productsBase = v.filter(x => x.category_id === q["categoryId"])
            .filter(x => (this.categoryName(x.category_id) + x.name + x.sku).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (q["searchQuery"] && q["categoryId"] !== "all" && q["status"] !== "both") {
          this.productsBase = v.filter(x => x.category_id === q["categoryId"])
            .filter(x => String(x.published) === q["status"])
            .filter(x => (this.categoryName(x.category_id) + x.name + x.sku).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (!q["searchQuery"] && q["categoryId"] === "all" && q["status"] === "both") {
          this.productsBase = v;
          initPagination();
        }








        if (q["sortBy"] && q["inOrder"]) {
          this.trigger = q["sortBy"];
          this.order = q["inOrder"];

          switch (q["sortBy"]) {
            case this.sortTriggers.NAME:
              this.productsBase = this.productsBase.sort((a, b) => {
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
            case this.sortTriggers.CODE:
              this.productsBase = this.productsBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.sku.localeCompare(b.sku);
                } else if (q["inOrder"] === "desc") {
                  return b.sku.localeCompare(a.sku);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortTriggers.STOCK:
              this.productsBase = this.productsBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.inStock - b.inStock;
                } else if (q["inOrder"] === "desc") {
                  return b.inStock - a.inStock;
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortTriggers.CATEGORY:
              this.productsBase = this.productsBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return this.categoryName(a.category_id).localeCompare(this.categoryName(b.category_id));
                } else if (q["inOrder"] === "desc") {
                  return this.categoryName(b.category_id).localeCompare(this.categoryName(a.category_id));
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortTriggers.PRICE:
              this.productsBase = this.productsBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.price.sale - b.price.sale;
                } else if (q["inOrder"] === "desc") {
                  return b.price.sale - a.price.sale;
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








  delete(id: string) {
    this.alexit.deleteProduct(id);
    const product = this.products.filter(p => p._id === id)[0];
    for (let image of product.images) {
      this.alexit.deleteAnyFile(image);
    }
  }

  categoryName(category_id: string) {
    const category = this.categories.filter(c => c._id === category_id)[0];
    return category ? category.name : "";
  }

  includeAsRecommended(product: Product) {
    this.alexit.updateProduct({ ...product, includedAsRecommended: true });
  }

  updateFilters(search: string, category: string, status: any) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { searchQuery: search, categoryId: category, status: status }, queryParamsHandling: "merge" });
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
    if ((this.currentPile + 1) < this.paginatedProducts.length) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile + 1 }, queryParamsHandling: "merge" });
    }
  }

  previousPile() {
    if (this.currentPile !== 0) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile - 1 }, queryParamsHandling: "merge" });
    }
  }









}
