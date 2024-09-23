import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlexitService } from '../../../services/alexit.service';
import { Product } from '../../../../models/product.model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../models/user.model';
import { CtgIfPipe } from '../../../pipes/ctg-if.pipe';
import { Order } from '../../../../models/order.model';
import { v4 as uuid } from 'uuid';
import { MyLibraryService } from '../../../services/my-library.service';
import { Category } from '../../../../models/category.model';
import { ConfiguratorService } from '../../services/configurator.service';
import { Configurator } from '../../../../models/configurator.model';
import { configurator } from '../../../../constants/configurator';
import { timer } from 'rxjs';
import { orderStatusList } from '../../../../constants/order-status-list';

@Component({
  selector: 'configurator',
  standalone: true,
  imports: [FormsModule, CtgIfPipe, RouterLink],
  templateUrl: './configurator.component.html',
  styleUrl: './configurator.component.css'
})
export class ConfiguratorComponent implements OnInit {

  users: User[] = [];

  categories: Category[] = [];

  products: Product[] = [];

  cart: { id: string, product_id: string, quantity: number }[] = [];

  configurator: Configurator = { name: "", playfield: [] }

  totalPrice: number = 0;






  constructor(private alexit: AlexitService, private router: Router, public $: MyLibraryService, public cfg: ConfiguratorService, private change: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.alexit.categories$.subscribe({ next: v => this.categories = v.filter(c => c.configuratorField !== ""), error: e => console.log(e) });
    this.alexit.users$.subscribe({ next: v => this.users = v, error: e => console.log(e) });
    this.alexit.products$.subscribe({ next: v => this.products = v, error: e => console.log(e) });
    if (this.cfg.configuratorExists) {
      this.configurator = this.cfg.getConfigurator();
    } else {
      this.configurator = configurator;
    }
    timer(0).subscribe(() => this.fillCart());
  }






  fillCart() {
    this.cart = [];
    for (let component of this.configurator.playfield) {
      if (component.product_id !== "") {
        const item = { id: uuid(), product_id: component.product_id, quantity: 1 };
        if (!this.cart.includes(item)) this.cart.push(item);
        if (this.getProduct(item.product_id)) {
          this.totalPrice = this.totalPrice + this.getProduct(item.product_id).price.sale;
        }
      }
    }
  }

  goToPayment() {
    let randomOrderNumber = Math.floor(Math.random() * 1000) + 1000;
    const user = this.users.find(u => u._id === String(localStorage.getItem("customer_id")));
    let orderItems: any[] = [];
    for (let item of this.cart) {
      orderItems.push({
        product_id: item.product_id,
        image: this.getProduct(item.product_id).images[0],
        name: this.getProduct(item.product_id).name,
        price: this.getProduct(item.product_id).price.discount.value > 0 ?
          (this.$.subtractPercentage(this.getProduct(item.product_id).price.sale, this.getProduct(item.product_id).price.discount.value))
          : this.getProduct(item.product_id).price.sale,
        quantity: 1,
        weight: this.getProduct(item.product_id).weight
      });
    }
    const totalWeight = orderItems.reduce((prev: number, cur: any) => prev + cur.weight, 0);
    const totalPrice = orderItems.reduce((prev: number, cur: any) => prev + (cur.price * cur.quantity), 0);

    const order: Order = {
      _id: uuid(),
      number: String(randomOrderNumber),
      user: {
        firstname: user ? user.firstname : "",
        lastname: user ? user.lastname : "",
        email: user ? user.email : "",
        phone: user ? user.shippingAddress.phone : "",
        country: user ? user.shippingAddress.country : "",
        city: user ? user.shippingAddress.city : "",
        street: user ? user.shippingAddress.street : "",
        zip: user ? user.shippingAddress.zip : "",
        note: ''
      },
      courier_id: "",
      pcBuild: true,
      pcBuildName: this.cfg.getConfigurator().name,
      status: orderStatusList.PLACED,
      paid: false,
      items: orderItems,
      weight: totalWeight,
      subtotal: totalPrice,
      shippingCost: 0,
      grandTotal: 0,
      creationTime: String(new Date()),
      accountingSent: false,
      saleGenerated: false
    }
    localStorage.setItem("order", JSON.stringify(order));
    if (localStorage.getItem("order")) {
      this.cfg.removeConfigurator();
      this.router.navigate(["checkout"]);
    }

  }

  getProduct(product_id: string) {
    return this.products.filter(p => p._id === product_id)[0];
  }

  saveConfigurationName(name: string) {
    this.cfg.setConfigurator({ ...this.cfg.getConfigurator(), name: name });
  }

  choose(field: string) {
    const category = this.categories.find(c => c.configuratorField === field);
    if (category) {
      this.router.navigate(["products", category._id, category.name], { queryParams: { configuratorMode: true } });
      this.cfg.setConfigurator(this.configurator);
    }
  }

  remove(product_id: string) {
    this.cart = this.cart.filter(item => item.product_id !== product_id);
    this.totalPrice = this.totalPrice - this.getProduct(product_id).price.sale;
  }



}
