import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order } from '../../../../../../models/order.model';
import { NgClass } from '@angular/common';
import { MyLibraryService } from '../../../../../services/my-library.service';

@Component({
  selector: 'order-summary',
  standalone: true,
  imports: [NgClass],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent {

  @Input() order!: Order;

  @Output() onChangePayment = new EventEmitter<{ isPaid: boolean }>();

  @Output() onStatusMessageInput = new EventEmitter<{ value: string }>();




  constructor(public $: MyLibraryService) { }




  emitOnChangePayment(isPaid: boolean) {
    this.onChangePayment.emit({ isPaid: isPaid });
  }

  emitOnStatusMessageInput(e: any) {
    this.onStatusMessageInput.emit({ value: e.target.value });
  }






}
