import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'quantity-exceeded',
  standalone: true,
  imports: [],
  templateUrl: './quantity-exceeded.component.html',
  styleUrl: './quantity-exceeded.component.css'
})
export class QuantityExceededComponent implements OnInit {

  @ViewChild('alert') alert!: ElementRef<HTMLDialogElement>;



  constructor(public cartService: CartService) { }
  ngOnInit(): void {
    this.cartService.quantityExceeded.subscribe(v => { if (v) this.alert.nativeElement.showModal(); })
  }





}
