import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mobile-blog-topics',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './mobile-blog-topics.component.html',
  styleUrl: './mobile-blog-topics.component.css'
})
export class MobileBlogTopicsComponent {

  @Input() active: boolean = false;

  @Input() topics: { _id: string, name: string }[] = [];

  @Output() onClose = new EventEmitter();

}
