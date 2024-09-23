import { Component, OnInit } from '@angular/core';
import { AlexitService } from '../../../services/alexit.service';
import { Order } from '../../../../models/order.model';
import { StatisticsComponent } from './statistics/statistics.component';
import { Sale } from '../../../../models/sale.model';
import { roles } from '../../../../constants/roles';
import { MyLibraryService } from '../../../services/my-library.service';
import { Product } from '../../../../models/product.model';
import { AnnualIncomeComponent } from "./annual-income/annual-income.component";
import { MonthlyIncomeComponent } from "./monthly-income/monthly-income.component";
import { WeeklyIncomeComponent } from "./weekly-income/weekly-income.component";
import { DailyIncomeComponent } from "./daily-income/daily-income.component";
import { TotalIncomeComponent } from "./total-income/total-income.component";
import { CustomersComponent } from './customers/customers.component';
import { PageViewsComponent } from './page-views/page-views.component';
import { TotalOrdersComponent } from './total-orders/total-orders.component';
import { TotalProductsComponent } from './total-products/total-products.component';
import { TodaysOrdersComponent } from "./todays-orders/todays-orders.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [
    StatisticsComponent,
    AnnualIncomeComponent,
    MonthlyIncomeComponent,
    WeeklyIncomeComponent,
    DailyIncomeComponent,
    TotalIncomeComponent,
    CustomersComponent,
    PageViewsComponent,
    TotalOrdersComponent,
    TotalProductsComponent,
    TodaysOrdersComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  orders: Order[] = [];
  sales: Sale[] = [];
  products: Product[] = [];

  annualIncome = { value: 0, previousValue: 0, percentage: "" };
  monthlyIncome = { value: 0, previousValue: 0, percentage: "" };
  weeklyIncome = { value: 0, previousValue: 0, percentage: "" };
  dailyIncome = { value: 0, previousValue: 0, percentage: "" };
  statistics: { monthYear: string, monthName: string; totalEarning: number }[] = [];
  pageViews: number = 0;
  totalCustomers: number = 0;
  totalOrders: number = 0;
  totalProducts: number = 0;







  constructor(private alexit: AlexitService, private $: MyLibraryService) { }
  ngOnInit(): void {
    this.alexit.products$.subscribe(v => {
      this.products = v;
      if (this.products.length > 0) this.totalProducts = this.products.length;
    });
    this.alexit.orders$.subscribe(v => {
      this.orders = v.sort((a, b) => new Date(b.creationTime).valueOf() - new Date(a.creationTime).valueOf()).slice(0, 8)
      this.totalOrders = v.length;
    });
    this.alexit.sales$.subscribe(v => {
      this.sales = v.sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf());
      if (this.sales.length !== 0) {
        this.countAnnualIncome();
        this.countMonthlyIncome();
        this.countWeeklyIncome();
        this.countDailyIncome();
        this.countStatistics(new Date(this.sales[this.sales.length - 1].createdAt).getFullYear());
      }
    });
    this.alexit.pageViews$.subscribe(v => this.pageViews = v);
    this.alexit.users$.subscribe(v => this.totalCustomers = v.filter(u => u.role === roles.CUSTOMER).length);
  };







  countAnnualIncome() {
    const years = this.$.groupByYear(this.sales);
    const value = this.$.sum(years, "total");
    this.annualIncome.value = value / years.length
    const previousYearTotal = years[years.length - 2].total;
    this.annualIncome.previousValue = (value / years.length) - previousYearTotal;
    this.annualIncome.percentage = this.$.analyticsDifferencePercentage((value / years.length), previousYearTotal);
  }

  countMonthlyIncome() {
    const months = this.$.groupByMonth(this.sales);
    const value = this.$.sum(months, "total");
    this.monthlyIncome.value = value / months.length;
    const previousMonthTotal = months[months.length - 2].total;
    this.monthlyIncome.previousValue = (value / months.length) - previousMonthTotal;
    this.monthlyIncome.percentage = this.$.analyticsDifferencePercentage((value / months.length), previousMonthTotal);
  }

  countWeeklyIncome() {
    const weeks = this.$.groupByWeeks(this.sales);
    const value = this.$.sum(weeks, "total");
    this.weeklyIncome.value = value / weeks.length;
    const previousWeekTotal = weeks[weeks.length - 2].total;
    this.weeklyIncome.previousValue = (value / weeks.length) - previousWeekTotal;
    this.weeklyIncome.percentage = this.$.analyticsDifferencePercentage((value / weeks.length), previousWeekTotal);
  }

  countDailyIncome() {
    const days = this.$.groupByDays(this.sales);
    const value = this.$.sum(days, "total");
    this.dailyIncome.value = value / days.length;
    const previousDayTotal = days[days.length - 2].total;
    this.dailyIncome.previousValue = (value / days.length) - previousDayTotal;
    this.dailyIncome.percentage = this.$.analyticsDifferencePercentage((value / days.length), previousDayTotal);
  }

  countStatistics(year: number) {
    const byYear = this.sales.filter(i => new Date(i.createdAt).getFullYear() === year);
    const byMonth = this.$.groupByMonth(byYear);
    let statisticsArray = [];
    for (let sale of byMonth) {
      statisticsArray.push({ monthYear: sale.monthYear, monthName: new Date(sale.monthYear).toLocaleDateString("en-US", { month: "short" }), totalEarning: sale.total, totalExpenses: 0 });
    };
    this.statistics = statisticsArray;
  }

  filterByYear(e: { yearFilter: number }) {
    this.countStatistics(e.yearFilter);
  }






}
