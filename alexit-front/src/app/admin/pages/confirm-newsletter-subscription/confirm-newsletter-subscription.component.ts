import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AlexitService } from '../../../services/alexit.service';
import { timer } from 'rxjs';

@Component({
  selector: 'confirm-newsletter-subscription',
  standalone: true,
  imports: [],
  templateUrl: './confirm-newsletter-subscription.component.html',
  styleUrl: './confirm-newsletter-subscription.component.css'
})
export class ConfirmNewsletterSubscriptionComponent implements OnInit {

  token!: { email: string, iat: number };






  constructor(private route: ActivatedRoute, private alexit: AlexitService, private router: Router) { }
  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.token = jwtDecode(p["token"].replace('-', '.').replace('-', '.'));
      if (this.token) {
        this.alexit.addSubscriber(this.token.email);
        timer(3000).subscribe(() => this.router.navigate([""]));
      }
    });
  }







}
