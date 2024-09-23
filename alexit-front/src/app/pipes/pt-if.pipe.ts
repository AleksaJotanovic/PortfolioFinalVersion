import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../../models/category.model';

@Pipe({
  name: 'ptIf',
  standalone: true
})
export class PtIfPipe implements PipeTransform {

  transform(value: Category[], ...args: unknown[]): any {
    if (value) {
      return value.filter(v => (v.parent_id === ''));
    }
  }

}
