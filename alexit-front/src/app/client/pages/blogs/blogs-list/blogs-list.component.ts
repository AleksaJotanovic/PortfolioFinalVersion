import { Component, OnInit } from '@angular/core';
import { Blog } from '../../../../../models/blog.model';
import { AlexitService } from '../../../../services/alexit.service';
import { NgStyle } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MyLibraryService } from '../../../../services/my-library.service';
import { BlogTopicsComponent } from './blog-topics/blog-topics.component';
import { BlogCardComponent } from './blog-card/blog-card.component';
import { MobileBlogTopicsComponent } from './mobile-blog-topics/mobile-blog-topics.component';

@Component({
  selector: 'blogs-list',
  standalone: true,
  imports: [NgStyle, RouterLink, BlogTopicsComponent, BlogCardComponent, MobileBlogTopicsComponent],
  templateUrl: './blogs-list.component.html',
  styleUrl: './blogs-list.component.css'
})
export class BlogsListComponent implements OnInit {

  blogs: Blog[] = [];

  topics: { _id: string, name: string }[] = [];

  mobileTopicsActive: boolean = false;





  constructor(private alexit: AlexitService, public $: MyLibraryService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.initBlogs();
    this.alexit.blogTopics$.subscribe({ next: v => this.topics = v, error: err => console.log(err) });
    this.route.queryParams.subscribe(q => {
      this.initBlogs();
      if (q["topicId"] === "all") {
        this.initBlogs();
      } else {
        this.blogs = this.blogs.filter(b => b.topic_id === q["topicId"]);
      }

      if (q["searchQuery"]) {
        this.initBlogs();
        this.blogs = this.blogs.filter(b => (b.title + this.topicName(b.topic_id)).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
      } else if (q["searchQuery"] === "") {
        const currentUrlTree = this.router.parseUrl(this.router.url);
        delete currentUrlTree.queryParams["searchQuery"];
        this.router.navigateByUrl(currentUrlTree);
        this.initBlogs();
      }

    });
  }





  initBlogs() {
    this.alexit.blogs$.subscribe({ next: v => this.blogs = v, error: err => console.log(err) });
  }

  searchBlogs(input: any) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { searchQuery: input.value }, queryParamsHandling: "merge" });
  }

  topicName(topic_id: string) {
    return this.topics.find(t => t._id === topic_id)?.name
  }













}
