import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MyLibraryService } from '../../../../services/my-library.service';

@Component({
  selector: 'annual-income',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './annual-income.component.html',
  styleUrl: './annual-income.component.css'
})
export class AnnualIncomeComponent {

  @Input() annualIncome = { value: 0, previousValue: 0, percentage: "" };




  constructor(public $: MyLibraryService) { }




}
