import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../models/product.model';
import { AlexitService } from '../../services/alexit.service';
import { v4 as uuid } from 'uuid';
import { MyLibraryService } from '../../services/my-library.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  totalQuantity$ = new BehaviorSubject<number>(0);

  totalPrice$ = new BehaviorSubject<number>(0);

  products: Product[] = [];

  cart$ = new BehaviorSubject<{ id: string, product_id: string, quantity: number }[]>([]);

  quantityExceeded = new BehaviorSubject<boolean>(false);





  constructor(private alexit: AlexitService, private $: MyLibraryService) {
    this.alexit.products$.subscribe({ next: v => this.products = v, error: err => console.log(err) });
  }





  setCart(array: any[]) {
    localStorage.setItem("cart", JSON.stringify(array));
  }

  getCart(): any[] {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  }

  saveToCart(objectToAdd: any) {
    const array = this.getCart();
    array.push(objectToAdd);
    this.setCart(array);
  }

  updateCart(updatedObject: any) {
    const array = this.getCart();
    const index = array.findIndex((obj: any) => obj.id === updatedObject.id);
    if (index !== -1) {
      array[index] = updatedObject;
      this.setCart(array);
    }
  }

  removeItem(objectIdToRemove: string) {
    this.quantityExceeded.next(false);
    if (localStorage.getItem("customer_id")) {
      let array = this.getCart();
      let user: any;
      this.alexit.users$.subscribe({ next: v => user = v.find(u => u._id === String(localStorage.getItem("customer_id"))) });
      array = array.filter((obj: any) => obj.id !== objectIdToRemove);
      this.setCart(array);
      user = { ...user, cart: this.getCart() };
      this.alexit.updateUser(user);
    } else {
      let array = this.getCart();
      array = array.filter((obj: any) => obj.id !== objectIdToRemove);
      this.setCart(array);
    }
  }

  addToCart(product_id: string) {
    if (localStorage.getItem("customer_id")) {
      let productExists = false;
      let user: any;
      this.alexit.users$.subscribe({ next: v => user = v.find(u => u._id === String(localStorage.getItem("customer_id"))) });

      for (let item of this.getCart()) {
        if (item.product_id === product_id) {
          if ((item.quantity + 1) > this.getProduct(product_id).inStock) {
            productExists = true;
            this.quantityExceeded.next(true);
            break;
          } else {
            this.quantityExceeded.next(false);
            let updateCartObj = { ...item, quantity: (item.quantity += 1) };
            this.updateCart(updateCartObj);
            user = { ...user, cart: this.getCart() };
            this.alexit.updateUser(user);
            productExists = true;
            break;
          }
        }
      }
      if (!productExists) {
        this.saveToCart({ id: uuid(), product_id: product_id, quantity: 1 });
        if (user) {
          user = { ...user, cart: this.getCart() };
          this.alexit.updateUser(user);
        }
      }
      this.computeCartTotals();
    } else {
      let productExists = false;
      for (let item of this.getCart()) {
        if (item.product_id === product_id) {
          if ((item.quantity + 1) > this.getProduct(product_id).inStock) {
            productExists = true;
            this.quantityExceeded.next(true);
            break;
          } else {
            this.quantityExceeded.next(false);
            let updateCartObj = { ...item, quantity: (item.quantity += 1) };
            this.updateCart(updateCartObj);
            productExists = true;
            break;
          }
        }
      }
      if (!productExists) {
        this.saveToCart({ id: uuid(), product_id: product_id, quantity: 1 });
      }
      this.computeCartTotals();
    }
  }

  getProduct(product_id: string) {
    return this.products.filter(p => p._id === product_id)[0];
  }

  computeCartTotals() {
    this.alexit.products$.subscribe(() => {
      let totalQuantityValue = 0;
      let totalPriceValue = 0;
      for (let item of this.getCart()) {
        if (this.getProduct(item.product_id)) {
          if (this.getProduct(item.product_id).price.discount.value > 0) {
            totalPriceValue += item.quantity * this.$.countDiscount(this.getProduct(item.product_id).price.sale, this.getProduct(item.product_id).price.discount.value);
          } else {
            totalPriceValue += item.quantity * this.getProduct(item.product_id).price.sale;
          }
          totalQuantityValue += item.quantity;
        }
      }
      this.totalQuantity$.next(totalQuantityValue);
      this.totalPrice$.next(totalPriceValue);
      this.cart$.next(this.getCart());
    });
  }

  decrementQuantity(item: any) {
    this.quantityExceeded.next(false);
    if (localStorage.getItem("customer_id")) {
      let itemUpdateObj = { ...item, quantity: item.quantity -= 1 };
      let user: any;
      this.alexit.users$.subscribe({ next: v => user = v.find(u => u._id === String(localStorage.getItem("customer_id"))) });
      this.updateCart(itemUpdateObj);
      if (item.quantity === 0) {
        this.computeCartTotals();
        this.removeItem(itemUpdateObj.id);
      } else {
        this.computeCartTotals();
      }
      user = { ...user, cart: this.getCart() };
      this.alexit.updateUser(user);
    } else {
      let itemUpdateObj = { ...item, quantity: item.quantity -= 1 };
      this.updateCart(itemUpdateObj);
      if (item.quantity === 0) {
        this.computeCartTotals();
        this.removeItem(itemUpdateObj.id);
      } else {
        this.computeCartTotals();
      }
    }
  }




}
