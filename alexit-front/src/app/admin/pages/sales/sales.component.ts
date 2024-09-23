import { Component, OnInit } from '@angular/core';
import { SalesFiltersComponent } from './sales-filters/sales-filters.component';
import { SalesTableComponent } from './sales-table/sales-table.component';
import { Category } from '../../../../models/category.model';
import { Sale } from '../../../../models/sale.model';
import { AlexitService } from '../../../services/alexit.service';
import { salesReportHtml } from '../../../../middlewares/htmls';
import { ActivatedRoute, Router } from '@angular/router';
import { salesSortTriggers } from '../../../../constants/sales-sorting';
import { MyLibraryService } from '../../../services/my-library.service';

@Component({
  selector: 'sales',
  standalone: true,
  imports: [SalesFiltersComponent, SalesTableComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {

  sales: Sale[] = [];

  salesBase: Sale[] = [];

  paginatedSales: Sale[][] = [];

  currentPile: number = 0;

  categories: Category[] = [];

  totals = { quantity: 0, taxBase: 0, vatAmount: 0, saleValue: 0 };

  date: { start: string, end: string } = { start: "", end: "" };







  constructor(private alexit: AlexitService, private route: ActivatedRoute, private router: Router, private $: MyLibraryService) { }
  ngOnInit(): void {
    this.alexit.categories$.subscribe(v => this.categories = v);
    this.route.queryParams.subscribe(q => {
      this.alexit.sales$.subscribe(v => {


        this.currentPile = Number(q["currentPile"]);

        const initPagination = () => {
          let arr = [];
          for (let i = 0; i < this.salesBase.length; i += Number(q["limit"])) {
            arr.push(this.salesBase.slice(i, i + Number(q["limit"])));
            this.paginatedSales = arr;
          }
          if (this.paginatedSales.length > 0) {
            this.sales = this.paginatedSales[this.currentPile];
          }
        }


        if (q["limit"] && q["currentPile"]) {
          initPagination();
        }



        if (q["startDate"] && q["endDate"]) {
          this.date = { start: q["startDate"], end: q["endDate"] };
          const start = new Date(this.date.start);
          const end = new Date(this.date.end);
          end.setDate(end.getDate() + 1);

          if (q["category"] !== "all" && !q["productCode"] && !q["productName"]) {
            this.salesBase = v.filter(s => (new Date(s.createdAt) >= start && new Date(s.createdAt) <= end)).filter(sale => sale.group_id === q["category"]);
            initPagination();
          } else if (q["category"] === "all" && q["productCode"] && !q["productName"]) {
            this.salesBase = v.filter(s => (new Date(s.createdAt) >= start && new Date(s.createdAt) <= end)).filter(sale => sale.articleCode.toLowerCase().indexOf(q["productCode"].toLowerCase()) >= 0);
            initPagination();
          } else if (q["category"] === "all" && !q["productCode"] && q["productName"]) {
            this.salesBase = v.filter(s => (new Date(s.createdAt) >= start && new Date(s.createdAt) <= end)).filter(sale => sale.articleName.toLowerCase().indexOf(q["productName"].toLowerCase()) >= 0);
            initPagination();
          } else if (q["category"] === "all" && q["productCode"] && q["productName"]) {
            this.salesBase = v.filter(s => (new Date(s.createdAt) >= start && new Date(s.createdAt) <= end)).filter(sale => sale.articleCode.toLowerCase().indexOf(q["productCode"].toLowerCase()) >= 0)
              .filter(sale => sale.articleName.toLowerCase().indexOf(q["productName"].toLowerCase()) >= 0);
            initPagination();
          } else if (q["category"] !== "all" && !q["productCode"] && q["productName"]) {
            this.salesBase = v.filter(s => (new Date(s.createdAt) >= start && new Date(s.createdAt) <= end)).filter(sale => sale.group_id === q["category"])
              .filter(sale => sale.articleName.toLowerCase().indexOf(q["productName"].toLowerCase()) >= 0);
            initPagination();
          } else if (q["category"] !== "all" && q["productCode"] && !q["productName"]) {
            this.salesBase = v.filter(s => (new Date(s.createdAt) >= start && new Date(s.createdAt) <= end)).filter(sale => sale.group_id === q["category"])
              .filter(sale => sale.articleCode.toLowerCase().indexOf(q["productCode"].toLowerCase()) >= 0);
            initPagination();
          } else if (q["category"] !== "all" && q["productCode"] && q["productName"]) {
            this.salesBase = v.filter(s => (new Date(s.createdAt) >= start && new Date(s.createdAt) <= end)).filter(sale => sale.group_id === q["category"])
              .filter(sale => sale.articleCode.toLowerCase().indexOf(q["productCode"].toLowerCase()) >= 0)
              .filter(sale => sale.articleName.toLowerCase().indexOf(q["productName"].toLowerCase()) >= 0);
            initPagination();
          } else if (q["category"] === "all" && !q["productCode"] && !q["productName"]) {
            this.salesBase = v.filter(s => (new Date(s.createdAt) >= start && new Date(s.createdAt) <= end));
            initPagination();
          }



        }





        if (q["sortBy"] && q["inOrder"]) {
          switch (q["sortBy"]) {
            case salesSortTriggers.GROUP:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return this.categoryName(a.group_id).localeCompare(this.categoryName(b.group_id));
                } else if (q["inOrder"] === "desc") {
                  return this.categoryName(b.group_id).localeCompare(this.categoryName(a.group_id))
                } else {
                  return 0;
                }
              });;
              initPagination();
              break;
            case salesSortTriggers.UOM:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.uom.localeCompare(b.uom);
                } else if (q["inOrder"] === "desc") {
                  return b.uom.localeCompare(a.uom);
                } else {
                  return 0;
                }
              });;
              initPagination();
              break;
            case salesSortTriggers.CODE:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.articleCode.localeCompare(b.articleCode);
                } else if (q["inOrder"] === "desc") {
                  return b.articleCode.localeCompare(a.articleCode);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case salesSortTriggers.NAME:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.articleName.localeCompare(b.articleName);
                } else if (q["inOrder"] === "desc") {
                  return b.articleName.localeCompare(a.articleName);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case salesSortTriggers.QUANTITY:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.quantity - b.quantity;
                } else if (q["inOrder"] === "desc") {
                  return b.quantity - a.quantity;
                } else {
                  return 0
                }
              });
              initPagination();
              break;
            case salesSortTriggers.PURCHASE_PRICE:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.purchasePrice - b.purchasePrice;
                } else if (q["inOrder"] === "desc") {
                  return b.purchasePrice - a.purchasePrice;
                } else {
                  return 0
                }
              });
              initPagination();
              break;
            case salesSortTriggers.MARGIN:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.margin - b.margin;
                } else if (q["inOrder"] === "desc") {
                  return b.margin - a.margin;
                } else {
                  return 0
                }
              });
              initPagination();
              break;
            case salesSortTriggers.PRICE_PER_UOM:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.pricePerUom - b.pricePerUom;
                } else if (q["inOrder"] === "desc") {
                  return b.pricePerUom - a.pricePerUom;
                } else {
                  return 0
                }
              });
              initPagination();
              break;
            case salesSortTriggers.TAX_BASE:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.taxBase - b.taxBase;
                } else if (q["inOrder"] === "desc") {
                  return b.taxBase - a.taxBase;
                } else {
                  return 0
                }
              });
              initPagination();
              break;
            case salesSortTriggers.VAT_RATE:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.vatRate - b.vatRate;
                } else if (q["inOrder"] === "desc") {
                  return b.vatRate - a.vatRate;
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case salesSortTriggers.VAT_AMOUNT:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.vat - b.vat;
                } else if (q["inOrder"] === "desc") {
                  return b.vat - a.vat;
                } else {
                  return 0
                }
              });
              initPagination();
              break;
            case salesSortTriggers.SALE_VALUE:
              this.salesBase = this.salesBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.saleValue - b.saleValue;
                } else if (q["inOrder"] === "desc") {
                  return b.saleValue - a.saleValue;
                } else {
                  return 0
                }
              });
              initPagination();
              break;
          }
        }



        this.initTotals();
      });
    });



  }










  initTotals() {
    this.totals.quantity = this.$.sum(this.salesBase, "quantity");
    this.totals.taxBase = this.$.sum(this.salesBase, "taxBase");
    this.totals.vatAmount = this.$.sum(this.salesBase, "vat");
    this.totals.saleValue = this.$.sum(this.salesBase, "saleValue");
  }

  sort(e: { trigger: string, order: string }) {
    if (e.order === "") {
      const currentUrlTree = this.router.parseUrl(this.router.url);
      delete currentUrlTree.queryParams["sortBy"];
      delete currentUrlTree.queryParams["inOrder"];
      this.router.navigateByUrl(currentUrlTree);
    } else {
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: e.trigger, inOrder: e.order }, queryParamsHandling: "merge" });
    }
  }

  updateFilters(e: { date: { start: string, end: string }, productCategory: string, productCode: string, productName: string }) {
    this.router.navigate([], {
      relativeTo: this.route, queryParams: {
        startDate: e.date.start,
        endDate: e.date.end,
        category: e.productCategory || "all",
        productCode: e.productCode,
        productName: e.productName
      },
      queryParamsHandling: "merge"
    });
  }

  printSalesReport() {
    if (this.date.start !== "" && this.date.end !== "") {
      let x = window.open();
      x?.document.open();
      x?.document.write(salesReportHtml(this.date, this.salesBase, this.totals, this.categories));
      x?.print();
      x?.close();
    } else {
      alert("First you must define date range for sales report that you want to print!");
    }
  }

  categoryName(id: string) {
    return this.categories.filter(c => c._id === id)[0].name;
  }

  nextPile() {
    if ((this.currentPile + 1) < this.paginatedSales.length) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile + 1 }, queryParamsHandling: "merge" });
    }
  }

  previousPile() {
    if (this.currentPile !== 0) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile - 1 }, queryParamsHandling: "merge" });
    }
  }






}
