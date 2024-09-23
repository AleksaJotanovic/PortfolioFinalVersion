import { Component, OnInit } from '@angular/core';
import { Offer } from '../../../../../models/offer.model';
import { AlexitService } from '../../../../services/alexit.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { offersSortingTriggers } from '../../../../../constants/offers-sorting';
import { MyLibraryService } from '../../../../services/my-library.service';

@Component({
  selector: 'offers-table',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './offers-table.component.html',
  styleUrl: './offers-table.component.css'
})
export class OffersTableComponent {

  offers: Offer[] = [];

  offersBase: Offer[] = [];

  paginatedOffers: Offer[][] = [];

  currentPile: number = 0;

  offerCategories: { _id: string, name: string }[] = [];

  sortingTriggers = offersSortingTriggers;

  order: string = "";

  trigger: string = "";






  constructor(private alexit: AlexitService, public $: MyLibraryService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.alexit.offerCategories$.subscribe(v => this.offerCategories = v);
    this.route.queryParams.subscribe(q => {
      this.alexit.offers$.subscribe(v => {

        this.currentPile = Number(q["currentPile"]);

        const initPagination = () => {
          let arr = [];
          for (let i = 0; i < this.offersBase.length; i += Number(q["limit"])) {
            arr.push(this.offersBase.slice(i, i + Number(q["limit"])));
            this.paginatedOffers = arr;
          }
          if (this.paginatedOffers.length > 0) {
            this.offers = this.paginatedOffers[this.currentPile];
          }
        };

        if (q["limit"] && q["currentPile"]) {
          initPagination();
        }



        if (q["searchQuery"] && q["offerCategoryId"] === "all") {
          this.offersBase = v.filter(x => (x.title +
            this.categoryName(x.category_id) +
            String(x.products.length) +
            String(x.discountImpact) +
            this.$.dateFormatNormal(x.date.created) +
            this.$.dateFormatNormal(x.date.expires)).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (!q["searchQuery"] && q["offerCategoryId"] !== "all") {
          this.offersBase = v.filter(x => x.category_id === q["offerCategoryId"]);
          initPagination();
        } else if (q["searchQuery"] && q["offerCategoryId"] !== "all") {
          this.offersBase = v.filter(x => x.category_id === q["offerCategoryId"])
            .filter(x => (x.title +
              this.categoryName(x.category_id) +
              String(x.products.length) +
              String(x.discountImpact) +
              this.$.dateFormatNormal(x.date.created) +
              this.$.dateFormatNormal(x.date.expires)).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (!q["searchQuery"] && q["offerCategoryId"] === "all") {
          this.offersBase = v.sort((a, b) => new Date(b.date.created).valueOf() - new Date(a.date.expires).valueOf());
          initPagination();
        }



        if (q["sortBy"] && q["inOrder"]) {
          this.trigger = q["sortBy"];
          this.order = q["inOrder"];
          switch (q["sortBy"]) {
            case this.sortingTriggers.TITLE:
              this.offersBase = this.offersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.title.localeCompare(b.title);
                } else if (q["inOrder"] === "desc") {
                  return b.title.localeCompare(a.title);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.CATEGORY:
              this.offersBase = this.offersBase.sort((a, b) => {
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
            case this.sortingTriggers.PRODUCTS_INCLUDED:
              this.offersBase = this.offersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.products.length - b.products.length;
                } else if (q["inOrder"] === "desc") {
                  return b.products.length - a.products.length;
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.DISCOUNT_IMPACT:
              this.offersBase = this.offersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.discountImpact - b.discountImpact;
                } else if (q["inOrder"] === "desc") {
                  return b.discountImpact - a.discountImpact;
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.CREATION_DATE:
              this.offersBase = this.offersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return new Date(a.date.created).valueOf() - new Date(b.date.created).valueOf();
                } else if (q["inOrder"] === "desc") {
                  return new Date(b.date.created).valueOf() - new Date(a.date.created).valueOf();
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.EXPIRATION_DATE:
              this.offersBase = this.offersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return new Date(a.date.expires).valueOf() - new Date(b.date.expires).valueOf();
                } else if (q["inOrder"] === "desc") {
                  return new Date(b.date.expires).valueOf() - new Date(a.date.expires).valueOf();
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
          }

        }



      })
    })
  }




  categoryName(category_id: string) {
    const category = this.offerCategories.filter(x => x._id === category_id)[0];
    return category ? category.name : "";
  }

  updateFilters(search: string, category_id: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { searchQuery: search, offerCategoryId: category_id }, queryParamsHandling: "merge" });
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
    if ((this.currentPile + 1) < this.paginatedOffers.length) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile + 1 }, queryParamsHandling: "merge" });
    }
  }

  previousPile() {
    if (this.currentPile !== 0) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile - 1 }, queryParamsHandling: "merge" });
    }
  }





}
