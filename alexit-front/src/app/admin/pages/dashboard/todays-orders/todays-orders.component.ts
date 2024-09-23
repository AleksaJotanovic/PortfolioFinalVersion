import { Component, Input } from '@angular/core';
import { Order } from '../../../../../models/order.model';
import { RouterLink } from '@angular/router';
import { MyLibraryService } from '../../../../services/my-library.service';

@Component({
  selector: 'todays-orders',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './todays-orders.component.html',
  styleUrl: './todays-orders.component.css'
})
export class TodaysOrdersComponent {

  constructor(public $: MyLibraryService) { }

  @Input() orders: Order[] = [];

}
