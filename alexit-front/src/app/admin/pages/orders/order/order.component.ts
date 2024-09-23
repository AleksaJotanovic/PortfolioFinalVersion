import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../../models/order.model';
import { Product } from '../../../../../models/product.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlexitService } from '../../../../services/alexit.service';
import { ItemsComponent } from './items/items.component';
import { CrudService } from '../../../../services/crud.service';
import { accountingMail, orderStatusMail } from '../../../../../middlewares/htmls';
import { User } from '../../../../../models/user.model';
import { Courier } from '../../../../../models/courier.model';
import { MyLibraryService } from '../../../../services/my-library.service';
import { StatusComponent } from "./status/status.component";
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { CustomerShippingComponent } from "./customer-shipping/customer-shipping.component";

@Component({
  selector: 'order',
  standalone: true,
  imports: [ItemsComponent, StatusComponent, OrderSummaryComponent, CustomerShippingComponent, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  order!: Order;

  products: Product[] = [];

  orders: Order[] = [];

  users: User[] = [];

  couriers: Courier[] = [];

  admin: string = "";

  changesMade: boolean = false;

  statusMessage: string = "";






  constructor(private route: ActivatedRoute, private alexit: AlexitService, private router: Router, private crud: CrudService, private $: MyLibraryService) { }

  ngOnInit(): void {
    this.alexit.orders$.subscribe(v => {
      this.orders = v;
      if (this.orders.length > 0) {
        const order = this.orders.filter(o => o._id === this.route.snapshot.params["id"])[0];
        if (order) this.order = order;
      }
    });
    this.alexit.products$.subscribe({ next: (val) => this.products = val, error: (err) => console.log(err) });
    this.alexit.users$.subscribe({ next: v => this.users = v, error: err => console.log(err) });
    this.alexit.couriers$.subscribe({ next: v => this.couriers = v, error: err => console.log(err) });
    this.crud.userGet(String(localStorage.getItem('user_id'))).subscribe(u => this.admin = u.data.firstname + " " + u.data.lastname);
  }






  getAccountingMail() {
    let orderItems = [];
    for (let item of this.order.items) {
      const product = this.products.find(p => p._id === item.product_id);
      if (product !== undefined) {
        orderItems.push({
          name: item.name,
          uom: product.uom,
          quantity: item.quantity,
          priceByUom: product.price.regular,
          taxBase: item.quantity * product.price.regular,
          vatRate: 20,
          vatAmount: Math.round((20 / 100) * (item.quantity * product.price.regular)),
          discount: product.price.discount.value,
          totalPayment: item.price * item.quantity
        });
      }
    }
    return accountingMail(orderItems, this.order, this.orders, this.admin, this.users, this.couriers);
  }


  update() {
    if (this.changesMade) {
      const mailObj = { ...this.order, orderStatusMail: orderStatusMail(this.statusMessage, this.order) }
      this.alexit.updateOrder(this.order);
      this.alexit.mailOrderStatus(mailObj);
    } else {
      this.alexit.updateOrder(this.order);
    }
    this.router.navigate(["admin/orders"], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", payment: "both" }, queryParamsHandling: "merge" });
  }

  sendAccountingPdf() {
    this.alexit.sendAccounting(this.order._id, this.getAccountingMail());
    this.alexit.updateOrder({ ...this.order, accountingSent: true });
  }

  viewInvoicePdf() {
    let x = window.open();
    x?.document.open();
    x?.document.write(this.getAccountingMail());
  }

  generateSale() {
    for (let item of this.order.items) {
      const prod = this.products.filter(p => p._id === item.product_id)[0];
      if (prod) {
        this.alexit.addSale({
          group_id: prod.category_id,
          uom: prod.uom,
          articleCode: prod.sku,
          articleName: prod.name,
          quantity: item.quantity,
          purchasePrice: prod.price.purchase,
          margin: prod.price.margin,
          pricePerUom: prod.price.regular,
          taxBase: Math.round(prod.price.regular * item.quantity),
          vatRate: 20,
          vat: this.$.countVat(Math.round(prod.price.regular * item.quantity)),
          saleValue: item.price,
          earned: Math.round(item.quantity * prod.price.earning),
          createdAt: String(new Date()),
        });
      }
    }
    this.alexit.updateOrder({ ...this.order, saleGenerated: true });
  }


}
// ☺
