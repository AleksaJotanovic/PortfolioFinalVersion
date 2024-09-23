import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClientHeaderComponent } from './components/client-header/client-header.component';
import { ClientFooterComponent } from './components/client-footer/client-footer.component';
import { RouterOutlet } from '@angular/router';
import { AlexitService } from '../services/alexit.service';
import { CrudService } from '../services/crud.service';
import { NgStyle } from '@angular/common';
import { CartService } from './services/cart.service';
import { AuthService } from '../admin/services/auth.service';
import { timer } from 'rxjs';
import { Product } from '../../models/product.model';

@Component({
  selector: 'client',
  standalone: true,
  imports: [ClientHeaderComponent, ClientFooterComponent, RouterOutlet, NgStyle],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit, AfterViewInit {

  pageViews: number = 0;

  isReady: boolean = false;

  @ViewChild("preloadCanvas") preloadCanvas!: ElementRef<HTMLDivElement>;





  constructor(private alexit: AlexitService, private crud: CrudService, private cartService: CartService, private auth: AuthService) { }
  ngOnInit(): void {
    this.onInitUsers();
    if (!this.auth.isAdminLoggedIn) {
      this.alexit.pageViews$.subscribe(v => {
        this.pageViews = v;
        if (this.pageViews !== 0) {
          this.pageViews = this.pageViews + 1;
          this.crud.pageViewsPut(this.pageViews).subscribe(() => console.log('Welcome to www.alexit.com'));
        }
      })
    }
  }

  ngAfterViewInit(): void {
    timer(3000).subscribe(() => {
      this.isReady = true
      if (this.isReady) {
        this.preloadCanvas.nativeElement.classList.add("closed");
        if (this.preloadCanvas.nativeElement.classList.contains("closed")) {
          timer(500).subscribe(() => this.preloadCanvas.nativeElement.style.display = "none");
        }
      }
    });
  }






  onActivate() {
    window.scroll(0, 0);
  }

  onInitUsers() {
    if (!localStorage.getItem("customer_id") && !localStorage.getItem("cart")) {
      this.cartService.setCart([]);
      this.cartService.computeCartTotals();
    } else if (localStorage.getItem("customer_id") && localStorage.getItem("cart")?.length === 0) {
      this.crud.userGet(String(localStorage.getItem("customer_id"))).subscribe(v => {
        this.cartService.setCart(v.data.cart);
        this.cartService.computeCartTotals();
      });
    } else if (localStorage.getItem("customer_id") && localStorage.getItem("cart")?.length !== 0) {
      this.crud.userGet(String(localStorage.getItem("customer_id"))).subscribe(v => {
        this.cartService.setCart(v.data.cart);
        this.cartService.computeCartTotals();
      });
    } else {
      this.cartService.computeCartTotals();
    }
  }






}