import { Component, Input } from '@angular/core';

@Component({
  selector: 'customers',
  standalone: true,
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {

  @Input() totalCustomers: number = 0;

}
