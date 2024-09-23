import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MyLibraryService } from '../../../../services/my-library.service';

@Component({
  selector: 'daily-income',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './daily-income.component.html',
  styleUrl: './daily-income.component.css'
})
export class DailyIncomeComponent {

  @Input() dailyIncome = { value: 0, previousValue: 0, percentage: "" };

  constructor(public $: MyLibraryService) { }

}
