import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Blog } from '../../../../../../models/blog.model';
import { NgStyle } from '@angular/common';
import { MyLibraryService } from '../../../../../services/my-library.service';
import { RouterLink } from '@angular/router';
import { AlexitService } from '../../../../../services/alexit.service';
import { blogContentItemTypes } from '../../../../../../constants/blog-content-item-types';

@Component({
  selector: 'blog-card',
  standalone: true,
  imports: [NgStyle, RouterLink],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.css'
})
export class BlogCardComponent implements OnInit, AfterViewInit {

  @Input() blog!: Blog;

  topics: { _id: string, name: string }[] = [];

  blogCardWidth: number = 0;

  @ViewChild("card") card!: ElementRef<HTMLDivElement>;

  contentItemTypes = blogContentItemTypes;






  constructor(public $: MyLibraryService, private alexit: AlexitService, private el: ElementRef) { }
  ngOnInit(): void {
    this.alexit.blogTopics$.subscribe(v => this.topics = v);
  }
  ngAfterViewInit(): void {
    this.blogCardWidth = this.card.nativeElement.offsetWidth;
  }







  topicName(id: string) {
    return this.topics.find(t => t._id === id)?.name;
  }

  firstTextItem(content: { _id: number, key: string, value: string[] }[]) {
    const filter = content.filter(c => c.key === this.contentItemTypes.TEXT)[0];
    return filter.value[0];
  }










}
