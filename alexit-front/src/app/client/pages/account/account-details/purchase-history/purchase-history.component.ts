import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../../models/product.model';
import { CrudService } from '../../../../../services/crud.service';
import { MyLibraryService } from '../../../../../services/my-library.service';
import { AlexitService } from '../../../../../services/alexit.service';
import { Order } from '../../../../../../models/order.model';
import { User } from '../../../../../../models/user.model';

@Component({
  selector: 'purchase-history',
  standalone: true,
  imports: [],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.css'
})
export class PurchaseHistoryComponent implements OnInit {

  orders: Order[] = [];



  constructor(private crud: CrudService, public $: MyLibraryService, private alexit: AlexitService) { }
  ngOnInit(): void {
    this.crud.userGet(String(localStorage.getItem('customer_id'))).subscribe(res => {
      this.alexit.orders$.subscribe({
        next: v => {
          const user = res.data as User;
          for (let id of user.purchaseHistory) {
            const order = v.find(o => o._id === id);
            if (order) this.orders.push(order);
          }
        }, error: e => console.log(e)
      });
    });
  }





}

