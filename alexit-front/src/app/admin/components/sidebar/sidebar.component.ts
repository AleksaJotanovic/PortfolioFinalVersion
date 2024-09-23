import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  salesDateRange: { start: string, end: string } = { start: "", end: "" };

  activeRoute: string = "";





  constructor(private router: Router) { }
  ngOnInit(): void {
    this.salesDateRange.start = new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().substring(0, 10);
    this.salesDateRange.end = new Date().toISOString().substring(0, 10);
  }






  inventory() {
    this.router.navigate(["admin/products"], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", categoryId: "all", status: "both" } });
  }

  categories() {
    this.router.navigate(["admin/categories"], { queryParams: { limit: 13, currentPile: 0 } })
  }

  orders() {
    this.router.navigate(["admin/orders"], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", payment: "both" } });
  }

  users() {
    this.router.navigate(["admin/users"], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", role: "both" } });
  }

  sales() {
    this.router.navigate(["admin/sales"], {
      queryParams: {
        limit: 13, currentPile: 0, startDate: this.salesDateRange.start, endDate: this.salesDateRange.end,
        category: "all", productCode: "", productName: ""
      }
    })
  }

  offers() {
    this.router.navigate(["admin/offers"], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", offerCategoryId: "all" } });
  }

  blogs() {
    this.router.navigate(["admin/blogs"], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", topicId: "all", status: "both" } });
  }






}