import { Component, EventEmitter, Input, Output } from '@angular/core';
import { sorterValues } from '../../../../../../constants/products-sorter';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'products-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './products-header.component.html',
  styleUrl: './products-header.component.css'
})
export class ProductsHeaderComponent {

  @Output() onMobileFiltersActive = new EventEmitter();

  sorterValues = sorterValues;

  @Output() onSorting = new EventEmitter<{ sorterValue: string }>();

  @Input() initialSorterValue: string = "";





  emitOnSorting(input: any) {
    this.onSorting.emit({ sorterValue: input.value });
  }



}
