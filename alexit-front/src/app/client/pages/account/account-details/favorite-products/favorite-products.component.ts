import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../../models/product.model';
import { AlexitService } from '../../../../../services/alexit.service';
import { CrudService } from '../../../../../services/crud.service';
import { User } from '../../../../../../models/user.model';
import { MyLibraryService } from '../../../../../services/my-library.service';
import { Category } from '../../../../../../models/category.model';


@Component({
  selector: 'favorite-products',
  standalone: true,
  imports: [],
  templateUrl: './favorite-products.component.html',
  styleUrl: './favorite-products.component.css'
})
export class FavoriteProductsComponent implements OnInit {

  products: Product[] = [];

  categories: Category[] = [];



  constructor(private alexit: AlexitService, private crud: CrudService, public $: MyLibraryService) { }
  ngOnInit(): void {
    this.alexit.categories$.subscribe({ next: v => this.categories = v });
    this.alexit.products$.subscribe({ next: v => this.products = v });
    this.crud.userGet(String(localStorage.getItem('customer_id'))).subscribe(v => {
      let user: User = v.data;
      let favoritedProduct: string[] = [];
      for (let product of this.products) {
        if (user.favoriteProducts.includes(product._id)) {
          favoritedProduct.push(product._id);
        }
      }
      this.products = this.products.filter(p => favoritedProduct.includes(p._id));
      console.log(this.products);
    });
  }





  getCategoryName(category_id: string) {
    return this.categories.find(c => c._id === category_id)?.name;
  }



}
