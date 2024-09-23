import { Pipe, PipeTransform } from '@angular/core';
import { Sale } from '../../../interfaces';

@Pipe({
  name: 'saleDateRange',
  standalone: true
})
export class SaleDateRangePipe implements PipeTransform {

  transform(value: Sale[], input: { from: string, to: string }): any {
    return value;
  }

}
