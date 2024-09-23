import { Component, OnInit } from '@angular/core';
import { Offer } from '../../../../../models/offer.model';
import { AlexitService } from '../../../../services/alexit.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MyLibraryService } from '../../../../services/my-library.service';
import { OffersCategoriesComponent } from './offers-categories/offers-categories.component';
import { OfferCardComponent } from './offer-card/offer-card.component';
import { MobileOffersCategoriesComponent } from "./mobile-offers-categories/mobile-offers-categories.component";

@Component({
  selector: 'client-offers-list',
  standalone: true,
  imports: [RouterLink, OffersCategoriesComponent, OfferCardComponent, MobileOffersCategoriesComponent],
  templateUrl: './client-offers-list.component.html',
  styleUrl: './client-offers-list.component.css'
})
export class ClientOffersListComponent implements OnInit {

  offers: Offer[] = [];

  categories: { _id: string, name: string }[] = [];

  mobileCategoriesActive: boolean = false;





  constructor(private alexit: AlexitService, public $: MyLibraryService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.initOffers();
    this.alexit.offerCategories$.subscribe({ next: v => this.categories = v, error: err => console.log(err) });
    this.route.queryParams.subscribe(q => {

      this.initOffers();

      if (q["categoryId"] === "all") {
        this.initOffers();
      } else {
        this.offers = this.offers.filter(o => o.category_id === q["categoryId"]);
      }

      if (q["searchQuery"]) {
        this.initOffers();
        this.offers = this.offers.filter(o => (o.title + this.categoryName(o.category_id)).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
      } else if (q["searchQuery"] === "") {
        const currentUrlTree = this.router.parseUrl(this.router.url);
        delete currentUrlTree.queryParams["searchQuery"];
        this.router.navigateByUrl(currentUrlTree);
        this.initOffers();
      }


    });
  }





  initOffers() {
    this.alexit.offers$.subscribe({ next: v => this.offers = v, error: err => console.log(err) });
  }

  searchOffers(input: any) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { searchQuery: input.value }, queryParamsHandling: "merge" });
  }

  categoryName(category_id: string) {
    return this.categories.find(c => c._id === category_id)?.name;
  }







}
