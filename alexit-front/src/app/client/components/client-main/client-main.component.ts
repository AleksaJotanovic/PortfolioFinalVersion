import { Component, OnInit } from '@angular/core';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { DiscountsComponent } from "./discounts/discounts.component";
import { RecentlyAddedComponent } from "./recently-added/recently-added.component";
import { RecommendedProductsComponent } from "./recommended-products/recommended-products.component";
import { LatestBlogsComponent } from "./latest-blogs/latest-blogs.component";
import { ConfiguratorBoastingComponent } from "./configurator-boasting/configurator-boasting.component";
import { Product } from '../../../../models/product.model';
import { AlexitService } from '../../../services/alexit.service';
import { Offer } from '../../../../models/offer.model';
import { Blog } from '../../../../models/blog.model';

@Component({
  selector: 'client-main',
  standalone: true,
  imports: [SlideshowComponent, BenefitsComponent, DiscountsComponent, RecentlyAddedComponent, RecommendedProductsComponent, LatestBlogsComponent, ConfiguratorBoastingComponent],
  templateUrl: './client-main.component.html',
  styleUrl: './client-main.component.css',
})
export class ClientMainComponent implements OnInit {

  products: Product[] = [];

  productsOnDiscount: Product[] = [];

  recentlyAddedProducts: Product[] = [];

  recommendedProducts: Product[] = [];

  offers: Offer[] = [];

  expiringOffer!: Offer;

  expiringProducts: Product[] = [];

  timer: any;

  stopwatch = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  blogs: Blog[] = [];







  constructor(private alexit: AlexitService) { }
  ngOnInit(): void {
    this.alexit.products$.subscribe(v => {
      this.products = v;
      const productsFiltered = v.filter(p => p.price.discount.value > 0);
      this.productsOnDiscount = productsFiltered.sort((a, b) => new Date(b.price.discount.activationDate).valueOf() - new Date(a.price.discount.activationDate).valueOf()).slice(0, 30);
      this.recentlyAddedProducts = v.sort((a, b) => new Date(b.creationDate).valueOf() - new Date(a.creationDate).valueOf()).slice(0, 30);
      this.recommendedProducts = v.filter(p => p.includedAsRecommended === true);
    });

    this.alexit.offers$.subscribe(v => {
      const offersFiltered = v.filter(offer => this.checkHoursDifference(offer.date.expires));
      this.offers = offersFiltered.sort((a, b) => new Date(a.date.expires).valueOf() - new Date(b.date.expires).valueOf());
      if (this.offers.length > 0) {
        this.expiringOffer = this.offers[0];
        if (this.expiringOffer) {
          let expirationDate = new Date(this.expiringOffer.date.expires);
          this.timer = setInterval(() => this.activateProductsExpiration(expirationDate), 1000);
          // this.timer = interval(1000).subscribe(() => this.activateProductsExpiration(expirationDate));
          for (let id of this.expiringOffer.products) {
            this.expiringProducts.push(this.getProduct(id));
          }
        }
      }
    });

    this.alexit.blogs$.subscribe(v => {
      this.blogs = v.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()).slice(0, 30);
    });

  }




  activateProductsExpiration(expiration: Date) {
    const difference = expiration.getTime() - new Date().getTime();
    if (difference <= 0) {
      clearInterval(this.timer);
      // this.timer.unsubscribe();
    } else {
      this.stopwatch.days = Math.floor((difference / 1000) / (3600 * 24));
      this.stopwatch.seconds = Math.floor(difference / 1000);
      this.stopwatch.minutes = Math.floor(this.stopwatch.seconds / 60);
      this.stopwatch.hours = Math.floor(this.stopwatch.minutes / 60);
      this.stopwatch.hours %= 24;
      this.stopwatch.minutes %= 60;
      this.stopwatch.seconds %= 60;
    }
  }

  checkHoursDifference(expiration: string): boolean {
    if (new Date(expiration).valueOf() >= new Date().valueOf()) {
      return true;
    } else {
      return false;
    }
  }

  getProduct(id: string) {
    return this.products.filter(p => p._id === id)[0];
  }









}
