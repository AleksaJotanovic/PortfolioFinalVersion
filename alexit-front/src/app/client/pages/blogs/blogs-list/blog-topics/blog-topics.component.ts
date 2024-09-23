import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'blog-topics',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './blog-topics.component.html',
  styleUrl: './blog-topics.component.css'
})
export class BlogTopicsComponent {

  @Input() topics: { _id: string, name: string }[] = [];





}
