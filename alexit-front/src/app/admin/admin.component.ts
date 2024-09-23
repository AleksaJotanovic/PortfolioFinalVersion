import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { Router, RouterOutlet } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'admin',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, AdminHeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements AfterViewInit, OnInit {

  isReady: boolean = false;


  @ViewChild("preloadCanvas") preloadCanvas!: ElementRef<HTMLDivElement>;




  onActivate() {
    window.scroll(0, 0);
  }



  constructor(private router: Router) { }
  ngOnInit(): void {
    if (this.router.url === "/admin") {
      this.router.navigate(["admin/dashboard"]);
    }
  }



  ngAfterViewInit(): void {
    timer(3000).subscribe(() => {
      this.preloadCanvas.nativeElement.classList.add("closed");
      if (this.preloadCanvas.nativeElement.classList.contains("closed")) {
        this.isReady = true
      }
    });
  }



}
