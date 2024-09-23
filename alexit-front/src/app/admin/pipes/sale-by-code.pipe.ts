import { Pipe, PipeTransform } from '@angular/core';
import { Sale } from '../../../models/sale.model';

@Pipe({
  name: 'saleByCode',
  standalone: true
})
export class SaleByCodePipe implements PipeTransform {

  transform(value: Sale[], input: string): any {
    if (input) {
      return value.filter(v => v.articleCode.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    } else {
      return value;
    }
  }

}
