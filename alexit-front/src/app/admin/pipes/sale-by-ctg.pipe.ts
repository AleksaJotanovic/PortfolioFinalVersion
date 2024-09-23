import { Pipe, PipeTransform } from '@angular/core';
import { Sale } from '../../../models/sale.model';

@Pipe({
  name: 'saleByCtg',
  standalone: true
})
export class SaleByCtgPipe implements PipeTransform {

  transform(value: Sale[], input: string): any {
    if (input) {
      return value.filter(v => v.group_id === input);
    } else {
      return value;
    }
  }
}
