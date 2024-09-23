import { Pipe, PipeTransform } from '@angular/core';
import { Sale } from '../../../models/sale.model';

@Pipe({
  name: 'saleByName',
  standalone: true
})
export class SaleByNamePipe implements PipeTransform {

  transform(value: Sale[], input: string): any {
    if (input) {
      return value.filter(v => v.articleName.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    } else {
      return value;
    }
  }

}
