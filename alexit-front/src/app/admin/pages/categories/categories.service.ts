import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  categoryFormValue$ = new BehaviorSubject<{
    name: string,
    parent_id: string,
    configuratorField: string,
    specifications: { key: string, values: string[] }[]
  }>({ name: "", parent_id: "", configuratorField: "", specifications: [] });




  constructor() { }




  setCategoryFormValue(value: { name: string, parent_id: string, configuratorField: string, specifications: { key: string, values: string[] }[] }) {
    this.categoryFormValue$.next(value);
  }






}
