import { Component, OnInit } from '@angular/core';
import { AlexitService } from '../../../../../services/alexit.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../../../models/product.model';
import { CartService } from '../../../../services/cart.service';
import { CrudService } from '../../../../../services/crud.service';
import { User } from '../../../../../../models/user.model';
import { MyLibraryService } from '../../../../../services/my-library.service';
import { Category } from '../../../../../../models/category.model';
import { Offer } from '../../../../../../models/offer.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [NgClass],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;

  categories: Category[] = []

  quantity: number = 1;

  selectedImage: string = "";






  constructor(private alexit: AlexitService, private route: ActivatedRoute, private cartService: CartService, private crud: CrudService, public $: MyLibraryService) { }
  ngOnInit(): void {
    this.alexit.products$.subscribe(v => {
      this.product = v.filter(p => p._id === this.route.snapshot.params["productId"])[0];
      if (this.product) this.selectedImage = this.product.images[0];
    });
    this.alexit.categories$.subscribe(v => this.categories = v);
    if (localStorage.getItem('customer_id')) {
      this.crud.userGet(String(localStorage.getItem('customer_id'))).subscribe(v => {
        let user: User = v.data;
        if (this.product) {
          if (!user.previouslyViewed.includes(this.product._id)) {
            user.previouslyViewed.push(this.product._id);
            this.alexit.updateUser(user);
          }
        }
      });
    }


  }







  addToCart(product: Product) {
    this.cartService.addToCart(product._id);
  }

  addToFavorites(id: string) {
    if (localStorage.getItem('customer_id')) {
      this.crud.userGet(String(localStorage.getItem('customer_id'))).subscribe(v => {
        let user: User = v.data;
        if (!user.favoriteProducts.includes(id)) {
          user.favoriteProducts.push(id);
          this.alexit.updateUser(user);
        }
      });
    } else {
      alert('You must be logged in to put product among favorites!');
    }
  }


  getCategoryName(category_id: string) {
    return this.categories.find(ctg => ctg._id === category_id)?.name;
  }

  offerCategoryName(product_id: string) {
    let offer!: Offer;
    let offerCategory!: { _id: string, name: string };
    this.alexit.offers$.subscribe(v => offer = v.filter(o => o.products.includes(product_id))[0]);
    this.alexit.offerCategories$.subscribe(v => {
      if (offer) v.filter(ctg => ctg._id === offer.category_id)[0];
    });
    if (offer && offerCategory) return offerCategory.name; else return "";
  }


  increaseQuantity() {
    if (this.quantity > this.product.inStock) {
      this.cartService.quantityExceeded.next(true)
    } else {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }




}
