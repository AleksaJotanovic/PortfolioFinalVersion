import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mobile-offers-categories',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './mobile-offers-categories.component.html',
  styleUrl: './mobile-offers-categories.component.css'
})
export class MobileOffersCategoriesComponent {

  @Input() active: boolean = false;

  @Input() categories: { _id: string, name: string }[] = [];

  @Output() onClose = new EventEmitter();

}
