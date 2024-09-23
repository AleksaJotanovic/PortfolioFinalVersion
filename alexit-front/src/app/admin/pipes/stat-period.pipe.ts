import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statPeriod',
  standalone: true
})
export class StatPeriodPipe implements PipeTransform {

  transform(value: { month: string; total: number }[], input: number): any {
    if (input > 0) {
    }
  }

}
