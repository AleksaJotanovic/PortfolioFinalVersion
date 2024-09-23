import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'offers-categories',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './offers-categories.component.html',
  styleUrl: './offers-categories.component.css'
})
export class OffersCategoriesComponent {

  @Input() categories: { _id: string, name: string }[] = [];


}
