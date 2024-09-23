import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AlexitService } from './services/alexit.service';
import { Product } from '../models/product.model';
import { CrudService } from './services/crud.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  products: Product[] = [];

  constructor(private alexit: AlexitService, private crud: CrudService) { }
  ngOnInit(): void {
    this.alexit.initCategories();
    this.alexit.initCouriers();
    this.alexit.initPageViews();
    this.alexit.initProducts();
    this.alexit.initOrders();
    this.alexit.initBlogTopics();
    this.alexit.initBlogs();
    this.alexit.initOfferCategories();
    this.alexit.initOffers();
    this.alexit.initSubscribers();
    this.alexit.initSales();
    this.alexit.initUsers();
    this.alexit.products$.subscribe(v => this.products = v);
    this.alexit.offers$.subscribe(v => {
      const offer = v.find(x => new Date().valueOf() > new Date(x.date.expires).valueOf());
      if (offer && offer.products.length > 0) {
        for (let i in offer.products) {
          const product = this.products.find(x => x._id === offer.products[i]);
          if (product) {
            this.crud.productPut({ ...product, price: { ...product.price, discount: { value: 0, activationDate: "" } } }).subscribe(() => console.log("Products updated!"));
          }
        }
        this.crud.offerPut({ ...offer, products: [] });
      }
    })
  }



  onActivate() {
    window.scroll(0, 0);
  }


}
