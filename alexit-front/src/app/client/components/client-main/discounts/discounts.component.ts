import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ProductCardComponent } from "../../../pages/client-products/client-products-page/product-card/product-card.component";
import { Product } from '../../../../../models/product.model';
import { interval } from 'rxjs';
import { NgFor } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { User } from '../../../../../models/user.model';
import { AlexitService } from '../../../../services/alexit.service';

@Component({
  selector: 'discounts',
  standalone: true,
  imports: [ProductCardComponent, NgFor],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.css'
})
export class DiscountsComponent implements AfterViewInit, OnInit {

  @Input() products: Product[] = [];

  @ViewChild("carousel") carousel!: ElementRef<HTMLDivElement>;

  @ViewChildren(ProductCardComponent) cards!: QueryList<ProductCardComponent>;

  cardWidth: number = 0;

  cardPerView: number = 0;

  user!: User;









  constructor(private cartService: CartService, private alexit: AlexitService) { }
  ngOnInit(): void {
    if (localStorage.getItem("customer_id")) {
      this.alexit.users$.subscribe(v => this.user = v.filter(u => u._id === String(localStorage.getItem("customer_id")))[0]);
    }
  }


  ngAfterViewInit(): void {
    if (this.cards.length > 0) {
      this.startScrollShow();
    } else {
      this.cards.changes.subscribe(() => {
        this.startScrollShow();
      });
    }
  }









  startScrollShow() {
    this.cardWidth = this.cards.first.cardWidth;
    this.cardPerView = Math.round(this.carousel.nativeElement.offsetWidth / this.cardWidth);
    if (this.cardWidth !== 0 && this.cardPerView !== 0) {
      this.cards.toArray().slice(-this.cardPerView).reverse().forEach(card => {
        this.carousel.nativeElement.insertAdjacentHTML("afterbegin", card.card.nativeElement.outerHTML);
      });
      this.cards.toArray().slice(0, this.cardPerView).forEach(card => {
        this.carousel.nativeElement.insertAdjacentHTML("beforeend", card.card.nativeElement.outerHTML);
      });
      this.carousel.nativeElement.classList.add("no-transition");
      this.carousel.nativeElement.scrollLeft = this.carousel.nativeElement.offsetWidth;
      this.carousel.nativeElement.classList.remove("no-transition");
      interval(4000).subscribe(() => this.carousel.nativeElement.scrollLeft += this.cardWidth);
    }
  }


  scrollLeft() {
    this.carousel.nativeElement.scrollLeft += (-this.cardWidth);
  }

  scrollRight() {
    this.carousel.nativeElement.scrollLeft += this.cardWidth;
  }

  infiniteScroll() {
    if (this.carousel.nativeElement.scrollLeft === 0) {
      this.carousel.nativeElement.classList.add("no-transition");
      this.carousel.nativeElement.scrollLeft = this.carousel.nativeElement.scrollWidth - (2 * this.carousel.nativeElement.offsetWidth);
      this.carousel.nativeElement.classList.remove("no-transition");
    } else if (Math.ceil(this.carousel.nativeElement.scrollLeft) === this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.offsetWidth) {
      this.carousel.nativeElement.classList.add("no-transition");
      this.carousel.nativeElement.scrollLeft = this.carousel.nativeElement.offsetWidth;
      this.carousel.nativeElement.classList.remove("no-transition");
    }
  }



  addToCart(id: string) {
    this.cartService.addToCart(id);
  }


  addToFavorites(id: string) {
    if (this.user) {
      if (!this.user.favoriteProducts.includes(id)) {
        this.user.favoriteProducts.push(id);
        this.alexit.updateUser(this.user);
      }
    } else {
      alert("You must be logged in to put product among favorites!");
    }
  }







}