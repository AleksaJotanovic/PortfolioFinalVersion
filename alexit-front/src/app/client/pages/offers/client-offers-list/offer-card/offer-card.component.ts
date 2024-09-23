import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Offer } from '../../../../../../models/offer.model';
import { MyLibraryService } from '../../../../../services/my-library.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'offer-card',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './offer-card.component.html',
  styleUrl: './offer-card.component.css'
})
export class OfferCardComponent {

  @Input() offer!: Offer;

  @Input() categories: { _id: string, name: string }[] = [];





  constructor(public $: MyLibraryService, private router: Router) { }





  getCategoryName(category_id: string) {
    return this.categories.find(octg => octg._id === category_id)?.name;
  }

  visitOffer(offer: Offer) {
    if (this.isExpired) {
      this.router.navigate(["/offers/offer", offer._id, offer.title], { queryParams: { available: false } });
    } else {
      this.router.navigate(["/offers/offer", offer._id, offer.title], { queryParams: { available: true } });
    }
  }

  get isExpired(): boolean {
    if (new Date().valueOf() > new Date(this.offer.date.expires).valueOf()) {
      return true;
    }
    return false;
  }





}
