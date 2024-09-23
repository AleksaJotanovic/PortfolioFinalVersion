import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Blog } from '../../../../../models/blog.model';
import { AlexitService } from '../../../../services/alexit.service';
import { FormsModule } from '@angular/forms';
import { blogsSortingTriggers } from '../../../../../constants/blogs-sorting';
import { MyLibraryService } from '../../../../services/my-library.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'blogs-table',
  standalone: true,
  imports: [RouterLink, FormsModule, NgClass],
  templateUrl: './blogs-table.component.html',
  styleUrl: './blogs-table.component.css'
})
export class BlogsTableComponent implements OnInit {

  blogs: Blog[] = [];

  blogsBase: Blog[] = [];

  paginatedBlogs: Blog[][] = [];

  currentPile: number = 0;

  blogTopics: { _id: string, name: string }[] = [];

  sortingTriggers = blogsSortingTriggers;

  trigger: string = "";

  order: string = "";

  status: boolean | null = null;






  constructor(private alexit: AlexitService, public $: MyLibraryService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.alexit.blogTopics$.subscribe(v => this.blogTopics = v);
    this.route.queryParams.subscribe(q => {
      this.alexit.blogs$.subscribe(v => {

        this.currentPile = Number(q["currentPile"]);

        const initPagination = () => {
          let arr = []
          for (let i = 0; i < this.blogsBase.length; i += Number(q["limit"])) {
            arr.push(this.blogsBase.slice(i, i + Number(q["limit"])));
            this.paginatedBlogs = arr;
          }
          if (this.paginatedBlogs.length > 0) {
            this.blogs = this.paginatedBlogs[this.currentPile]
          }
        }



        if (q["limit"] && q["currentPile"]) {
          initPagination();
        }






        if (q["searchQuery"] && q["topicId"] === "all" && q["status"] === "both") {
          this.blogsBase = v.filter(x => (x.title + this.topicName(x.topic_id) + String(x.comments.length) +
            this.$.dateFormatNormal(x.date)).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (!q["searchQuery"] && q["topicId"] !== "all" && q["status"] === "both") {
          this.blogsBase = v.filter(x => x.topic_id === q["topicId"]);
          initPagination();
        } else if (!q["searchQuery"] && q["topicId"] === "all" && q["status"] !== "both") {
          this.blogsBase = v.filter(x => x.published === false);
          initPagination();
        } else if (!q["searchQuery"] && q["topicId"] !== "all" && q["status"] !== "both") {
          this.blogsBase = v.filter(x => x.topic_id === q["topicId"]).filter(x => x.published === false);
          initPagination();
        } else if (q["searchQuery"] && q["topicId"] === "all" && q["status"] !== "both") {
          this.blogsBase = v.filter(x => x.published === false)
            .filter(x => (x.title + this.topicName(x.topic_id) + String(x.comments.length) +
              this.$.dateFormatNormal(x.date)).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (q["searchQuery"] && q["topicId"] !== "all" && q["status"] === "both") {
          this.blogsBase = v.filter(x => x.topic_id === q["topicId"])
            .filter(x => (x.title + this.topicName(x.topic_id) + String(x.comments.length) +
              this.$.dateFormatNormal(x.date)).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (q["searchQuery"] && q["topicId"] !== "all" && q["status"] !== "both") {
          this.blogsBase = v.filter(x => x.topic_id === q["topicId"]).filter(x => x.published === false)
            .filter(x => (x.title + this.topicName(x.topic_id) + String(x.comments.length) +
              this.$.dateFormatNormal(x.date)).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (!q["searchQuery"] && q["topicId"] === "all" && q["status"] === "both") {
          this.blogsBase = v.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
          initPagination();
        }






        if (q["sortBy"] && q["inOrder"]) {
          this.trigger = q["sortBy"];
          this.order = q["inOrder"];

          switch (q["sortBy"]) {
            case this.sortingTriggers.TITLE:
              this.blogsBase = this.blogsBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.title.localeCompare(b.title);
                } else if (q["inOrder"] === "desc") {
                  return b.title.localeCompare(a.title);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.TOPIC:
              this.blogsBase = this.blogsBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return this.topicName(a.topic_id).localeCompare(this.topicName(b.topic_id));
                } else if (q["inOrder"] === "desc") {
                  return this.topicName(b.topic_id).localeCompare(this.topicName(a.topic_id));
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.COMMENTS:
              this.blogsBase = this.blogsBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.comments.length - b.comments.length;
                } else if (q["inOrder"] === "desc") {
                  return b.comments.length - a.comments.length;
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.DATE:
              this.blogsBase = this.blogsBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return new Date(a.date).valueOf() - new Date(b.date).valueOf();
                } else if (q["inOrder"] === "desc") {
                  return new Date(b.date).valueOf() - new Date(a.date).valueOf();
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
          }

        }




      })
    });
  }








  topicName(topic_id: string) {
    const topic = this.blogTopics.filter(x => x._id === topic_id)[0];
    return topic ? topic.name : "";
  }

  updateFilters(search: string, topic_id: string, status: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { searchQuery: search, topicId: topic_id, status: status }, queryParamsHandling: "merge" });
  }


  sort(button: any) {
    this.trigger = button.id;
    switch (this.order) {
      case "":
        this.order = "asc";
        break;
      case "asc":
        this.order = "desc";
        break;
      case "desc":
        this.order = "";
        break;
    }
    if (this.order === "") {
      const currentUrlTree = this.router.parseUrl(this.router.url);
      delete currentUrlTree.queryParams["sortBy"];
      delete currentUrlTree.queryParams["inOrder"];
      this.router.navigateByUrl(currentUrlTree);
    } else {
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: this.trigger, inOrder: this.order }, queryParamsHandling: "merge" });
    }
  }

  nextPile() {
    if ((this.currentPile + 1) < this.paginatedBlogs.length) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile + 1 }, queryParamsHandling: "merge" });
    }
  }

  previousPile() {
    if (this.currentPile !== 0) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile - 1 }, queryParamsHandling: "merge" });
    }
  }










}
