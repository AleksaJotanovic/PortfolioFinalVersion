import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MyLibraryService } from '../../../../services/my-library.service';

@Component({
  selector: 'monthly-income',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './monthly-income.component.html',
  styleUrl: './monthly-income.component.css'
})
export class MonthlyIncomeComponent {

  @Input() monthlyIncome = { value: 0, previousValue: 0, percentage: "" };




  constructor(public $: MyLibraryService) { }



}
