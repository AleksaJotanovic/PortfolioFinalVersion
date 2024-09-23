import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../../models/category.model';
import { PtIfPipe } from '../../../../pipes/pt-if.pipe';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'sidemenu',
  standalone: true,
  imports: [PtIfPipe, RouterLink, NgClass],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css'
})
export class SidemenuComponent {

  @Input() categories: Category[] = [];

  @Input() sidemenuActive: boolean = false;

  @Output() onSidemenuClose = new EventEmitter();

  @Output() onProductsSidemenuToggle = new EventEmitter<{ productsSidemenu: HTMLDivElement, sidemenuGoback: HTMLSpanElement }>();

  @Output() onToggleMobileSubcategories = new EventEmitter<{ button: HTMLButtonElement, mobileSubcategories: HTMLDivElement }>()








  getMobileSubcategories(parent_id: string): Category[] {
    return this.categories.filter(c => c.parent_id === parent_id)
  }

  emitOnProductsSidemenuToggle(productsSidemenu: HTMLDivElement, sidemenuGoback: HTMLSpanElement) {
    this.onProductsSidemenuToggle.emit({ productsSidemenu: productsSidemenu, sidemenuGoback: sidemenuGoback });
  }


  emitOnToggleMobileSubcategories(e: any, mobileSubcategories: HTMLDivElement) {
    this.onToggleMobileSubcategories.emit({ button: e.target, mobileSubcategories: mobileSubcategories });
  }




}
