import { Component, Input } from '@angular/core';

@Component({
  selector: 'total-orders',
  standalone: true,
  imports: [],
  templateUrl: './total-orders.component.html',
  styleUrl: './total-orders.component.css'
})
export class TotalOrdersComponent {

  @Input() totalOrders: number = 0;

}
