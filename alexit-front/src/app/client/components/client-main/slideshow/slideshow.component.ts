import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Offer } from '../../../../../models/offer.model';
import { NgClass, NgStyle } from '@angular/common';
import { Product } from '../../../../../models/product.model';
import { MyLibraryService } from '../../../../services/my-library.service';
import { interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'slideshow',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './slideshow.component.html',
  styleUrl: './slideshow.component.css'
})
export class SlideshowComponent implements OnInit {

  @Input() offers: Offer[] = [];

  @Input() products: Product[] = [];

  @Input() expiringOffer!: Offer;

  @Input() stopwatch = { days: 0, hours: 0, minutes: 0, seconds: 0 };


  @ViewChild("slider") slider!: ElementRef<HTMLDivElement>;
  offerSlideIndex: number = 0;
  viewOfferLink: string[] = [];


  @ViewChild("slider2") slider2!: ElementRef<HTMLDivElement>;
  productSlideIndex: number = 0;
  viewProductLink: string[] = [];





  constructor(public $: MyLibraryService, private router: Router) { }
  ngOnInit(): void {
    interval(6000).subscribe(() => this.slideToNextOffer());
    interval(9000).subscribe(() => this.slideToNextProduct());
  }






  slideToOffer(index: number) {
    this.offerSlideIndex = index;
    this.slider.nativeElement.style.transform = `translateX(-${index * 100}%)`;
    const slides = this.slider.nativeElement.querySelectorAll("div.slide");
    let offer!: Offer;
    for (let i in slides) {
      if (Number(slides[i].id) === index) {
        offer = this.offers.filter((offer, i) => i === index)[0];
        break;
      }
    }
    if (offer) this.viewOfferLink = ["/offers/offer", offer._id, offer.title];
  }

  slideToNextOffer() {
    this.offerSlideIndex++;
    if (this.offerSlideIndex === this.offers.length) this.offerSlideIndex = 0;
    this.slideToOffer(this.offerSlideIndex);
  }

  slideToPreviousOffer() {
    this.offerSlideIndex--;
    if (this.offerSlideIndex < 0) this.offerSlideIndex = this.offers.length - 1;
    this.slideToOffer(this.offerSlideIndex);
  }



  slideToProduct(index: number) {
    this.productSlideIndex = index;
    this.slider2.nativeElement.style.transform = `translateX(-${index * 100}%)`;
    const slides = this.slider2.nativeElement.querySelectorAll("div.slide2");
    let product!: Product;
    for (let i in slides) {
      if (Number(slides[i].id) === index) {
        product = this.products.filter((prod, i) => i === index)[0];
        break;
      }
    }
    if (product) this.viewProductLink = ["/products/product", product._id, product.name];
  }

  slideToNextProduct() {
    this.productSlideIndex++;
    if (this.productSlideIndex === this.products.length) this.productSlideIndex = 0;
    this.slideToProduct(this.productSlideIndex);
  }

  slideToPreviousProduct() {
    this.productSlideIndex--;
    if (this.productSlideIndex < 0) this.productSlideIndex = this.products.length - 1;
    this.slideToProduct(this.productSlideIndex);
  }

  viewProduct() {
    if (this.viewProductLink.length > 0) {
      this.router.navigate(this.viewProductLink);
    } else {
      this.router.navigate(["/products/product", this.products[0]._id, this.products[0].name]);
    }
  }

  viewOffer() {
    if (this.viewOfferLink.length > 0) {
      this.router.navigate(this.viewOfferLink, { queryParams: { available: true } });
    } else {
      this.router.navigate(["/offers/offer", this.offers[0]._id, this.offers[0].title], { queryParams: { available: true } });
    }
  }








}
