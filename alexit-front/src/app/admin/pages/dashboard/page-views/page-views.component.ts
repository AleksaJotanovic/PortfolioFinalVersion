import { Component, Input } from '@angular/core';

@Component({
  selector: 'page-views',
  standalone: true,
  imports: [],
  templateUrl: './page-views.component.html',
  styleUrl: './page-views.component.css'
})
export class PageViewsComponent {

  @Input() pageViews: number = 0;

}
