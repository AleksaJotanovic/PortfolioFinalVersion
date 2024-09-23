import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../../models/product.model';
import { CrudService } from '../../../../../services/crud.service';
import { AlexitService } from '../../../../../services/alexit.service';
import { User } from '../../../../../../models/user.model';
import { Category } from '../../../../../../models/category.model';
import { MyLibraryService } from '../../../../../services/my-library.service';

@Component({
  selector: 'previously-viewed',
  standalone: true,
  imports: [],
  templateUrl: './previously-viewed.component.html',
  styleUrl: './previously-viewed.component.css'
})
export class PreviouslyViewedComponent implements OnInit {

  products: Product[] = [];

  categories: Category[] = [];



  constructor(private crud: CrudService, private alexit: AlexitService, public $: MyLibraryService) { }
  ngOnInit(): void {
    this.alexit.categories$.subscribe({ next: v => this.categories = v });
    this.alexit.products$.subscribe({ next: v => this.products = v });
    this.crud.userGet(String(localStorage.getItem('customer_id'))).subscribe(v => {
      let user: User = v.data;
      let prevViewedProds: string[] = [];
      for (let product of this.products) {
        if (user.previouslyViewed.includes(product._id)) {
          prevViewedProds.push(product._id);
        }
      }
      this.products = this.products.filter(p => prevViewedProds.includes(p._id));
    });
  }




  getCategoryName(category_id: string) {
    return this.categories.find(c => c._id === category_id)?.name;
  }


}
