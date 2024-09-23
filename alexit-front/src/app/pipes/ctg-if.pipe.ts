import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../../models/category.model';

@Pipe({
  name: 'ctgIf',
  standalone: true
})
export class CtgIfPipe implements PipeTransform {

  transform(value: Category[], ...args: any[]): Category[] {
    if (value) {
      return value.filter((val) => val.parent_id.length > 0);
    } else {
      return [];
    }
  }

}
