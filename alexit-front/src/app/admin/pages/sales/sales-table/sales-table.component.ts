import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sale } from '../../../../../models/sale.model';
import { SaleByCtgPipe } from '../../../pipes/sale-by-ctg.pipe';
import { SaleByCodePipe } from '../../../pipes/sale-by-code.pipe';
import { SaleByNamePipe } from '../../../pipes/sale-by-name.pipe';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../../../models/category.model';
import { MyLibraryService } from '../../../../services/my-library.service';
import { AlexitService } from '../../../../services/alexit.service';
import { salesSortTriggers } from '../../../../../constants/sales-sorting';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sales-table',
  standalone: true,
  imports: [SaleByCtgPipe, SaleByCodePipe, SaleByNamePipe, FormsModule],
  templateUrl: './sales-table.component.html',
  styleUrl: './sales-table.component.css'
})
export class SalesTableComponent implements OnInit {

  @Input() sales!: Sale[];

  @Input() totals!: { quantity: number; taxBase: number; vatAmount: number; saleValue: number; };

  @Output() onSalesReportPrint = new EventEmitter();

  @Output() onSort = new EventEmitter<{ trigger: string, order: string }>();

  sortTriggers = salesSortTriggers;

  order: string = "";

  trigger: string = "";





  constructor(public $: MyLibraryService, private alexit: AlexitService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(q => {
      if (q["sortBy"] && q["inOrder"]) {
        this.trigger = q["sortBy"];
        this.order = q["inOrder"];
      }
    });
  }






  emitOnSalesReportPrint() {
    this.onSalesReportPrint.emit();
  }

  emitOnSort(button: any) {
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
    this.onSort.emit({ trigger: button.id, order: this.order });
  }

  getGroupName(group_id: string) {
    let category!: Category;
    this.alexit.categories$.subscribe(v => category = v.filter(ctg => ctg._id === group_id)[0]);
    if (category) return category.name; else return "";
  }







}
