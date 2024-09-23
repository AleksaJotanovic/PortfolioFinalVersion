import { AfterViewInit, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Blog } from '../../../../../models/blog.model';
import { BlogCardComponent } from "../../../pages/blogs/blogs-list/blog-card/blog-card.component";
import { interval } from 'rxjs';

@Component({
  selector: 'latest-blogs',
  standalone: true,
  imports: [BlogCardComponent],
  templateUrl: './latest-blogs.component.html',
  styleUrl: './latest-blogs.component.css'
})
export class LatestBlogsComponent implements AfterViewInit {

  @Input() blogs: Blog[] = [];

  @ViewChild("carousel") carousel!: ElementRef<HTMLDivElement>;

  @ViewChildren(BlogCardComponent) cards!: QueryList<BlogCardComponent>;

  cardWidth: number = 0;

  cardPerView: number = 0;







  ngAfterViewInit(): void {
    if (this.cards.length > 0) {
      this.startScrollShow();
    } else {
      this.cards.changes.subscribe(() => this.startScrollShow());
    }
  }







  startScrollShow() {
    this.cardWidth = this.cards.first.blogCardWidth;
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

      interval(3000).subscribe(() => this.carousel.nativeElement.scrollLeft += this.cardWidth);
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
