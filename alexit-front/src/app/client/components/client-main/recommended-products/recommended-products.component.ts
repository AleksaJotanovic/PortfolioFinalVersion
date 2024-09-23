import { Component, Input } from '@angular/core';
import { Product } from '../../../../../models/product.model';
import { RouterLink } from '@angular/router';
import { MyLibraryService } from '../../../../services/my-library.service';

@Component({
  selector: 'recommended-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recommended-products.component.html',
  styleUrl: './recommended-products.component.css'
})
export class RecommendedProductsComponent {

  @Input() products: Product[] = [];


  constructor(public $: MyLibraryService) { }



}
