import { Component, OnInit } from '@angular/core';
import { Offer } from '../../../../../models/offer.model';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../../../../services/crud.service';
import { Product } from '../../../../../models/product.model';
import { AlexitService } from '../../../../services/alexit.service';
import { MyLibraryService } from '../../../../services/my-library.service';
import { ProductCardComponent } from "../../client-products/client-products-page/product-card/product-card.component";

@Component({
  selector: 'offer-page',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './offer-page.component.html',
  styleUrl: './offer-page.component.css'
})
export class OfferPageComponent implements OnInit {

  offer!: Offer;

  products: Product[] = [];





  constructor(private route: ActivatedRoute, private crud: CrudService, private alexit: AlexitService, public $: MyLibraryService) { }
  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.crud.offerGet(p["id"]).subscribe(res => {
        this.offer = res.data;
        this.alexit.products$.subscribe(v => {
          if (this.offer) {
            this.products = v.filter(p => this.offer.products.includes(p._id));
          }
        });
      });
    });
  }










}
