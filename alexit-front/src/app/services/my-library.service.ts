import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class MyLibraryService {




  constructor() { }




  isPositive(value: number): boolean {
    return Math.sign(value) === 1;
  }

  money(number: number): string {
    return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  dateYearMonthDay(value: string): string {
    return new Date(value).toISOString().split('T')[0];
  }

  countDiscount(value: number, percentage: number): number {
    const percentageValue = Math.round(Number(percentage / 100) * value);
    return value - percentageValue;
  }

  dateFormatNormal(value: string) {
    return new Date(value).toLocaleDateString();
  }

  dateJustDay(value: string) {
    const day = String(new Date(value).getDay());
    if (day.length === 1) {
      return "0" + day;
    } else {
      return day;
    }
  }

  dateJustMonthName(value: string) {
    return new Date(value).toLocaleString('en-us', { month: 'short' });
  }

  roundNumberSimple(decimal: number) {
    return decimal.toFixed(1);
  }




  sum(array: any[], property: string) {
    let sum = 0;
    array.forEach(e => sum += (e[property]));
    return sum;
  }

  arePropertiesEmpty(obj: any) {
    for (let prop in obj) {
      if (typeof obj[prop] === "string" && obj[prop].trim() === "") {
        return true;
      }
    }
    return false;
  }

  addCharAtIndex(inputString: string, charToAdd: string, index: number) {
    if (index < 0 || index > inputString.length) {
      throw new Error('Index out of bounds');
    };
    return inputString.slice(0, index) + charToAdd + inputString.slice(index);
  };

  subtractPercentage(value: number, percentage: number): number {
    const percentageOfValue = Math.round(Number(percentage / 100) * value);
    return value - percentageOfValue;
  };

  analyticsDifferencePercentage(current: number, past: number) {
    const difference = current - past;
    const result = (difference / past) * 100;
    return this.roundNumberSimple(result) + "%";
  }




  countVat(price: any) {
    return Math.round(Number(20 / 100) * Number(price));
  }

  countSalePrice(price: any) {
    const vat = Number(this.countVat(price));
    return Math.round(Number(vat) + Number(price));
  };

  countEarning(margin: any, price: any) {
    return Math.round(Number(price) * Number(String('0.' + margin)));
  };

  countRegularPrice(margin: any, price: any) {
    const marginCf = Number('1.' + margin);
    return Math.round(Number(price) * Number(marginCf));
  };

  groupByWeeks(array: any[]) {
    let weeksArray: any[] = [];
    let currentWeek: any[] = [];
    array.forEach((obj) => {
      currentWeek.push({ earned: obj.earned, date: new Date(obj.createdAt).toLocaleDateString() });
      if (currentWeek.length === 7) {
        weeksArray.push({ week: currentWeek, total: this.sum(currentWeek, 'earned') });
        currentWeek = [];
      };
    });
    return weeksArray;
  };

  groupByMonth(array: any[]) {
    const groupedData: any[] = [];
    array.forEach(item => {
      const monthYear = `${new Date(item.createdAt).getFullYear()}-${(new Date(item.createdAt).getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      const existingGroup = groupedData.find(group => group.monthYear === monthYear);
      if (existingGroup) {
        existingGroup.month.push(item);
        existingGroup.total = this.sum(existingGroup.month, 'earned');
      } else {
        groupedData.push({
          monthYear,
          month: [item],
          total: 0
        });
      }
    });
    return groupedData;
  };

  countStatistics(products: Product[]) {
    const groupedData: any[] = [];
    products.forEach(product => {
      const monthYear = `${new Date(product.creationDate).getFullYear()}-${(new Date(product.creationDate).getMonth() + 1).toString().padStart(2, '0')}`;
      const existingGroup = groupedData.find(group => group.monthYear === monthYear);
      if (existingGroup) {
        existingGroup.month.push(product);
      } else {
        groupedData.push({ monthYear, month: [product], expenses: 0 });
      }
    });
    for (let group of groupedData) {
      group.month.forEach((x: Product) => group.expenses += (x.price.purchase * x.inStock));
    }
    return groupedData;
  }

  groupByYear(array: any[]) {
    const groupedData: any[] = [];
    array.forEach((obj) => {
      const fullYear = new Date(obj.createdAt).getFullYear();
      const yearIndex = groupedData.findIndex((group) => group.fullYear === fullYear);
      if (yearIndex === -1) {
        groupedData.push({ fullYear, year: [obj], total: 0 });
      } else {
        groupedData[yearIndex].year.push(obj);
        groupedData[yearIndex].total = this.sum(groupedData[yearIndex].year, 'earned');
      }
    });
    return groupedData;
  };

  groupByDays(array: any[]) {
    const groupedData: any[] = [];
    array.forEach(item => {
      const day = new Date(item.createdAt).toLocaleDateString();
      const existingGroup = groupedData.find(group => group.day === day);
      if (existingGroup) {
        existingGroup.dayItems.push(item);
        existingGroup.total = this.sum(existingGroup.dayItems, 'earned');
      } else {
        groupedData.push({
          day,
          dayItems: [item],
          total: item.earned
        });
      }
    });
    return groupedData;
  };









}
