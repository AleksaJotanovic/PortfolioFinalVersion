import { AfterViewInit, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ProductCardComponent } from "../../../pages/client-products/client-products-page/product-card/product-card.component";
import { Product } from '../../../../../models/product.model';
import { interval } from 'rxjs';

@Component({
  selector: 'recently-added',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './recently-added.component.html',
  styleUrl: './recently-added.component.css'
})
export class RecentlyAddedComponent implements AfterViewInit {

  @Input() products: Product[] = [];

  @ViewChild("carousel") carousel!: ElementRef<HTMLDivElement>;

  @ViewChildren(ProductCardComponent) cards!: QueryList<ProductCardComponent>;

  cardWidth: number = 0;

  cardPerView: number = 0;








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







}
