import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MyLibraryService } from '../../../../services/my-library.service';

@Component({
  selector: 'weekly-income',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './weekly-income.component.html',
  styleUrl: './weekly-income.component.css'
})
export class WeeklyIncomeComponent {

  @Input() weeklyIncome = { value: 0, previousValue: 0, percentage: "" };


  constructor(public $: MyLibraryService) { }

}
