import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../../models/category.model';
import { FormsModule } from '@angular/forms';
import { SaleByCtgPipe } from '../../../pipes/sale-by-ctg.pipe';
import { CtgIfPipe } from '../../../../pipes/ctg-if.pipe';

@Component({
  selector: 'sales-filters',
  standalone: true,
  imports: [FormsModule, SaleByCtgPipe, CtgIfPipe],
  templateUrl: './sales-filters.component.html',
  styleUrl: './sales-filters.component.css'
})
export class SalesFiltersComponent {

  @Input() categories!: Category[];

  @Input() date: { start: string, end: string } = { start: "", end: "" };

  @Output() onFiltersUpdate = new EventEmitter<{ date: { start: string, end: string }, productCategory: string, productCode: string, productName: string }>();






  emitOnFiltersUpdate(category_id: string, startDate: string, endDate: string, productCode: string, productName: string) {
    this.onFiltersUpdate.emit({ date: { start: startDate, end: endDate }, productCategory: category_id, productCode: productCode, productName: productName });
  }






}
