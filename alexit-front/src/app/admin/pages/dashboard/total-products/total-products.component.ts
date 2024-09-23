import { Component, Input } from '@angular/core';

@Component({
  selector: 'total-products',
  standalone: true,
  imports: [],
  templateUrl: './total-products.component.html',
  styleUrl: './total-products.component.css'
})
export class TotalProductsComponent {

  @Input() totalProducts: number = 0;

}
