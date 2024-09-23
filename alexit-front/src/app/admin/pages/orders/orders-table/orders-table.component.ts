import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Order } from '../../../../../models/order.model';
import { AlexitService } from '../../../../services/alexit.service';
import { User } from '../../../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { MyLibraryService } from '../../../../services/my-library.service';
import { ordersSortingTriggers } from '../../../../../constants/orders-sorting';

@Component({
  selector: 'orders-table',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.css'
})
export class OrdersTableComponent implements OnInit {

  users: User[] = [];

  orders: Order[] = [];

  ordersBase: Order[] = [];

  paginatedOrders: Order[][] = [];

  currentPile: number = 0;

  sortingTriggers = ordersSortingTriggers;

  order: string = "";

  trigger: string = "";






  constructor(private alexit: AlexitService, public $: MyLibraryService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.alexit.users$.subscribe(v => this.users = v);

    this.route.queryParams.subscribe(q => {
      this.alexit.orders$.subscribe(v => {

        this.currentPile = Number(q["currentPile"]);

        const initPagination = () => {
          let arr = []
          for (let i = 0; i < this.ordersBase.length; i += Number(q["limit"])) {
            arr.push(this.ordersBase.slice(i, i + Number(q["limit"])));
            this.paginatedOrders = arr;
          }
          if (this.paginatedOrders.length > 0) {
            this.orders = this.paginatedOrders[this.currentPile];
          }
        }


        if (q["limit"] && q["currentPile"]) {
          initPagination();
        }


        if (q["searchQuery"] && q["payment"] !== "both") {
          this.ordersBase = v.filter(o => String(o.paid) === q["payment"])
            .filter(x => (x.number + x.user.firstname + x.user.lastname + x.user.country + x.user.city +
              this.$.dateFormatNormal(x.creationTime) + String(x.grandTotal) + String(x.items.length + ' Items')).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (q["searchQuery"] && q["payment"] === "both") {
          this.ordersBase = v.filter(x => (x.number + x.user.firstname + x.user.lastname + x.user.country + x.user.city +
            this.$.dateFormatNormal(x.creationTime) + String(x.grandTotal) + String(x.items.length + ' Items')).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (!q["searchQuery"] && q["payment"] !== "both") {
          this.ordersBase = v.filter(o => String(o.paid) === q["payment"]);
          initPagination();
        } else if (!q["searchQuery"] && q["payment"] === "both") {
          this.ordersBase = v.sort((a, b) => new Date(b.creationTime).valueOf() - new Date(a.creationTime).valueOf());
          initPagination();
        }




        if (q["sortBy"] && q["inOrder"]) {
          this.trigger = q["sortBy"];
          this.order = q["inOrder"];

          switch (q["sortBy"]) {
            case this.sortingTriggers.NUMBER:
              this.ordersBase = this.ordersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.number.localeCompare(b.number);
                } else if (q["inOrder"] === "desc") {
                  return b.number.localeCompare(a.number);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.CUSTOMER:
              this.ordersBase = this.ordersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return (a.user.firstname + a.user.lastname).localeCompare(b.user.firstname + b.user.lastname);
                } else if (q["inOrder"] === "desc") {
                  return (b.user.firstname + b.user.lastname).localeCompare(a.user.firstname + a.user.lastname);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.PURCHASE:
              this.ordersBase = this.ordersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.items.length - b.items.length;
                } else if (q["inOrder"] === "desc") {
                  return b.items.length - a.items.length;
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.ADDRESS:
              this.ordersBase = this.ordersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return (a.user.country + a.user.city).localeCompare(b.user.country + b.user.city);
                } else if (q["inOrder"] === "desc") {
                  return (b.user.country + b.user.city).localeCompare(a.user.country + a.user.city);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.DATE:
              this.ordersBase = this.ordersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return new Date(a.creationTime).valueOf() - new Date(b.creationTime).valueOf();
                } else if (q["inOrder"] === "desc") {
                  return new Date(b.creationTime).valueOf() - new Date(a.creationTime).valueOf();
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.TOTAL:
              this.ordersBase = this.ordersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.grandTotal - b.grandTotal;
                } else if (q["inOrder"] === "desc") {
                  return b.grandTotal - a.grandTotal;
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
          }

        }


      });
    });

  }






  delete(id: string) {
    this.alexit.deleteOrder(id);
  }

  updateFilters(payment: string, search: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { searchQuery: search, payment: payment }, queryParamsHandling: "merge" });
  }

  sort(button: any) {
    this.trigger = button.id;
    switch (this.order) {
      case "":
        this.order = "asc";
        break;
      case "asc":
        this.order = "desc";
        break;
      case "desc":
        this.order = "";
        break;
    }
    if (this.order === "") {
      const currentUrlTree = this.router.parseUrl(this.router.url);
      delete currentUrlTree.queryParams["sortBy"];
      delete currentUrlTree.queryParams["inOrder"];
      this.router.navigateByUrl(currentUrlTree);
    } else {
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: this.trigger, inOrder: this.order }, queryParamsHandling: "merge" });
    }
  }

  nextPile() {
    if ((this.currentPile + 1) < this.paginatedOrders.length) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile + 1 }, queryParamsHandling: "merge" });
    }
  }

  previousPile() {
    if (this.currentPile !== 0) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile - 1 }, queryParamsHandling: "merge" });
    }
  }





}
