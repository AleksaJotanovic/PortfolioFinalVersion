import { AfterViewInit, Component, ElementRef, EventEmitter, input, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Category } from '../../../../../../models/category.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'filters',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements OnInit, AfterViewInit {

  specifications: { key: string, values: string[] }[] = [];

  @Output() onFilterSelect = new EventEmitter<{ key: string, value: string }>();

  @Output() onPriceFilterSelect = new EventEmitter<{ min: number, max: number }>();

  @Output() onDiscountFilterSelect = new EventEmitter<{ discount: string }>();

  @Input() category!: Category;

  @Input() priceRange: { min: number, max: number } = { min: 0, max: 0 };

  @Input() rangeInput = { min: 0, max: 0 };

  @Input() initialOnDiscount: boolean = false;

  @ViewChildren("collapser") collapsers!: QueryList<ElementRef<HTMLDivElement>>





  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(q => Object.keys(q).forEach(k => this.specifications.push({ key: `${k}`, values: q[k].split(",") })));
  }
  ngAfterViewInit(): void {
    this.collapsers.changes.subscribe(() => this.collapsers.forEach(coll => {
      const inputs = coll.nativeElement.querySelectorAll("input");
      for (let i in inputs) {
        if (inputs[i].checked) {
          coll.nativeElement.classList.add("filter-active");
          break;
        }
      }
    }));
  }





  emitOnFilterSelect(key: string, value: string, input: any) {
    if (input.checked) {
      if (this.specifications.some(spec => spec.key === key)) {
        for (let spec of this.specifications) {
          if (spec.key === key) {
            spec.values.push(value);
            this.onFilterSelect.emit({ key: key, value: `${spec.values.map(v => v).join(",")}` });
          }
        }
      } else {
        this.specifications.push({ key: key, values: [value] });
        this.onFilterSelect.emit({ key: key, value: value });
      }
    } else {
      if (this.specifications.some(spec => spec.key === key)) {
        for (let spec of this.specifications) {
          if (spec.key === key) {
            spec.values = spec.values.filter(v => v !== value);
            this.onFilterSelect.emit({ key: key, value: `${spec.values.map(v => v).join(",")}` });
            if (spec.values.length === 0) {
              this.specifications = this.specifications.filter(s => s.values.length !== 0);
            }
          }
        }
      }
    }
  }

  emitOnPriceFilterSelect(min: number, max: number) {
    this.onPriceFilterSelect.emit({ min: min, max: max });
  }

  emitOnDiscountFilterSelect(input: any) {
    if (input.checked) {
      this.onDiscountFilterSelect.emit({ discount: input.value });
    } else {
      this.onDiscountFilterSelect.emit({ discount: "" });
    }
  }

  checkedInput(key: string, val: string) {
    const spec = this.specifications.find(s => s.key === key);
    if (spec) {
      if (key === spec.key && spec.values.includes(val)) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }





}
