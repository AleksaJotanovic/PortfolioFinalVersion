import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Courier } from '../../../../../models/courier.model';
import { Product } from '../../../../../models/product.model';
import { MyLibraryService } from '../../../../services/my-library.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  @Input() couriers: Courier[] = [];

  @Input() cart: { id: string, product_id: string, quantity: number }[] = [];

  @Input() totalPrice: number = 0;

  @Input() totalQuantity: number = 0;

  @Input() products: Product[] = [];

  @Input() cartActive: boolean = false;

  @Output() onCartClose = new EventEmitter();

  @Output() onIncrementQuantity = new EventEmitter<{ product: Product }>();

  @Output() onDecrementQuantity = new EventEmitter<{ item: any }>();

  @Output() onRemove = new EventEmitter<{ id: string }>();

  @Output() onCheckout = new EventEmitter();





  constructor(public $: MyLibraryService) { }





  getCartProduct(product_id: string) {
    return this.products.filter(p => p._id === product_id)[0];
  }

  emitOnIncrementQuantity(product: Product) {
    this.onIncrementQuantity.emit({ product: product });
  }

  emitOnDecrementQuantity(item: any) {
    this.onDecrementQuantity.emit({ item: item });
  }

  emitOnRemove(id: string) {
    this.onRemove.emit({ id: id });
  }

  emitOnCheckout() {
    this.onCheckout.emit();
  }





}
