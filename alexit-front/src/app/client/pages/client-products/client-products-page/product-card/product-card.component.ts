import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Product } from '../../../../../../models/product.model';
import { RouterLink } from '@angular/router';
import { MyLibraryService } from '../../../../../services/my-library.service';
import { Category } from '../../../../../../models/category.model';
import { AlexitService } from '../../../../../services/alexit.service';
import { NgOptimizedImage } from '@angular/common';
import { Offer } from '../../../../../../models/offer.model';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit, AfterViewInit {

  categories: Category[] = [];

  offerCategories: { _id: string, name: string }[] = [];

  offers: Offer[] = [];

  @Input() product!: Product;

  @Output() onAddToCart = new EventEmitter<{ product_id: string }>();

  @Output() onAddToFavorites = new EventEmitter<{ id: string }>();

  @Input() configuratorMode: boolean = false;

  @Output() onAddToConfigurator = new EventEmitter<{ id: string, configuratorField: string }>();


  @ViewChild("card") card!: ElementRef<HTMLDivElement>;

  cardWidth: number = 0;







  constructor(public $: MyLibraryService, private alexit: AlexitService) { }
  ngOnInit(): void {
    this.alexit.categories$.subscribe(v => this.categories = v);
    this.alexit.offerCategories$.subscribe(v => this.offerCategories = v);
    this.alexit.offers$.subscribe(v => this.offers = v);
  }
  ngAfterViewInit(): void {
    this.cardWidth = this.card.nativeElement.offsetWidth;
  }







  emitOnAddToCart() {
    this.onAddToCart.emit({ product_id: this.product._id });
  }

  emitOnAddToFavorites(id: string) {
    this.onAddToFavorites.emit({ id: id });
  }

  emitOnAddToConfigurator(product: Product) {
    const category = this.categories.find(c => c._id === product.category_id);
    if (category) this.onAddToConfigurator.emit({ id: product._id, configuratorField: category.configuratorField });
  }

  offerCategoryName(product_id: string) {
    const offer = this.offers.find(o => o.products.includes(product_id));
    const offerCategory = this.offerCategories.find(c => c._id === offer?.category_id);
    return offerCategory?.name;
  }










}
