import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Courier } from '../../../../models/courier.model';
import { AlexitService } from '../../../services/alexit.service';
import { CartService } from '../../services/cart.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CrudService } from '../../../services/crud.service';
import { User } from '../../../../models/user.model';
import { Router } from '@angular/router';
import { Order } from '../../../../models/order.model';
import { NgClass } from '@angular/common';
import { Category } from '../../../../models/category.model';
import { MyLibraryService } from '../../../services/my-library.service';
import { CookieService } from 'ngx-cookie-service';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'checkout',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, ReactiveFormsModule, NgClass],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  providers: [provideNgxMask()]
})
export class CheckoutComponent implements OnInit, OnDestroy {

  couriers: Courier[] = [];

  categories: Category[] = [];

  user!: User;

  order!: Order;

  products: Product[] = [];

  @ViewChildren('courierRef') couriersRef!: QueryList<ElementRef<HTMLPictureElement>>;

  creditCardForm: FormGroup = new FormGroup({
    number: new FormControl(""),
    expiryDate: new FormControl(""),
    cvv: new FormControl("")
  });

  userForm: FormGroup = new FormGroup({
    firstname: new FormControl(""),
    lastname: new FormControl(""),
    email: new FormControl(""),
    phone: new FormControl(""),
    country: new FormControl(""),
    city: new FormControl(""),
    street: new FormControl(""),
    zip: new FormControl(""),
    note: new FormControl("")
  });






  constructor(private alexit: AlexitService, private crud: CrudService, private router: Router,
    private cartService: CartService, public $: MyLibraryService, private cookies: CookieService) { }
  ngOnInit(): void {
    this.order = JSON.parse(String(localStorage.getItem("order")));
    this.alexit.couriers$.subscribe({ next: v => this.couriers = v });
    if (localStorage.getItem("customer_id") && this.cookies.get("customer_token")) {
      this.crud.userGet(String(localStorage.getItem("customer_id"))).subscribe(v => this.user = v.data);
    }
    this.userForm.setValue({
      firstname: this.order.user.firstname,
      lastname: this.order.user.lastname,
      email: this.order.user.email,
      phone: this.order.user.phone,
      country: this.order.user.country,
      city: this.order.user.city,
      street: this.order.user.street,
      zip: this.order.user.zip,
      note: this.order.user.note
    });
    this.alexit.products$.subscribe({ next: v => this.products = v, error: e => console.log(e) });
  }
  ngOnDestroy(): void {
    if (this.order) localStorage.removeItem("order");
  }






  arePropertiesEmpty(obj: any) {
    return this.$.arePropertiesEmpty(obj);
  }

  setCourier(e: any) {
    this.couriersRef.forEach(ref => {
      if (ref.nativeElement.id === e.currentTarget.id) {
        ref.nativeElement.classList.add("active");
      } else {
        ref.nativeElement.classList.remove("active");
      }
    })
    const courier = this.couriers.find(c => c._id === e.currentTarget.id);
    if (courier) {
      const shipping = courier.pricelist.find(p => (p.weight.min < this.order.weight && p.weight.max > this.order.weight));
      if (shipping) {
        this.order = {
          ...this.order,
          courier_id: e.currentTarget.id,
          shippingCost: shipping.price,
          grandTotal: this.order.subtotal + shipping.price
        }
      }
    }
  }

  getProduct(product_id: string) {
    return this.products.filter(p => p._id === product_id)[0];
  }

  sendOrder() {
    this.order = {
      ...this.order,
      user: this.userForm.value,
    }

    this.alexit.addOrder(this.order);
    if (this.user) {
      this.user = { ...this.user, cart: [], purchaseHistory: [...this.user.purchaseHistory, this.order._id] };
      if (this.user.cart.length === 0) {
        localStorage.removeItem("cart");
        if (!localStorage.getItem("cart")) {
          this.alexit.updateUser(this.user);
        }
      }
    }

    for (let item of this.order.items) {
      if (this.getProduct(item.product_id)) {
        let product: Product = { ...this.getProduct(item.product_id), inStock: this.getProduct(item.product_id).inStock - item.quantity };
        this.alexit.updateProduct(product);
      }
    }

    this.cartService.computeCartTotals();
    this.router.navigate(['/']);
  }










}
