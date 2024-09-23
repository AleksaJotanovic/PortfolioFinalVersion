import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StatPeriodPipe } from '../../../pipes/stat-period.pipe';
import { FormsModule } from '@angular/forms';
import { Sale } from '../../../../../models/sale.model';
import { MyLibraryService } from '../../../../services/my-library.service';

@Component({
  selector: 'statistics',
  standalone: true,
  imports: [NgStyle, StatPeriodPipe, FormsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {

  @Input() sales: Sale[] = [];
  @Input() statistics: { monthYear: string, monthName: string; totalEarning: number }[] = []
  @Output() onYearFilter = new EventEmitter<{ yearFilter: number }>();

  years: number[] = [];
  yearFilter: number = 0;



  constructor(public $: MyLibraryService) { }
  ngOnInit(): void {
    if (this.sales.length > 0) {
      this.years = this.$.groupByYear(this.sales).map(s => s.fullYear).sort((a, b) => b - a).slice(1);
      this.yearFilter = this.lastYear();
    };
  }



  barHeight(total: number) {
    const whole = 2000000;
    const height = (total / whole) * 100;
    if (total > whole) {
      return "100%";
    } else {
      return String(height) + "%";
    }
  }

  lastYear() {
    return new Date(this.sales[this.sales.length - 1].createdAt).getFullYear();
  }

  emitOnYearFilter() {
    this.onYearFilter.emit({ yearFilter: this.yearFilter });
  }

  statByMonthName(monthName: string) {
    const stat = this.statistics.filter(stat => stat.monthName === monthName)[0];
    return stat ? stat : { monthYear: "", monthName: 0, totalEarning: 0 }
  }




}
