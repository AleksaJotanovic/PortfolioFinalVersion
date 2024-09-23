import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order } from '../../../../../../models/order.model';
import { AlexitService } from '../../../../../services/alexit.service';

@Component({
  selector: 'customer-shipping',
  standalone: true,
  imports: [],
  templateUrl: './customer-shipping.component.html',
  styleUrl: './customer-shipping.component.css'
})
export class CustomerShippingComponent {

  @Output() onAccountingSend = new EventEmitter();

  @Output() onPdfView = new EventEmitter();

  @Input() buttonDisabled: boolean = false;

  @Input() order!: Order;



  constructor(private alexit: AlexitService) { }



  emitOnAccountingSend() {
    this.onAccountingSend.emit();
  }

  emitOnPdfView() {
    this.onPdfView.emit();
  }

  courierName(id: string): string {
    let courierName: string = "";
    this.alexit.couriers$.subscribe(v => courierName = v.filter(c => c._id === id)[0].name)
    return courierName ? courierName : "";
  }







}
