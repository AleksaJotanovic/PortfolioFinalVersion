import { Component, OnInit } from '@angular/core';
import { Blog } from '../../../../../models/blog.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CrudService } from '../../../../services/crud.service';
import { blogContentItemTypes } from '../../../../../constants/blog-content-item-types';
import { MyLibraryService } from '../../../../services/my-library.service';
import { NgClass, NgStyle } from '@angular/common';
import { AuthService } from '../../../../admin/services/auth.service';
import { AlexitService } from '../../../../services/alexit.service';
import { User } from '../../../../../models/user.model';
import { roles } from '../../../../../constants/roles';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'blog-page',
  standalone: true,
  imports: [RouterLink, NgStyle, NgClass, FormsModule],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.css'
})
export class BlogPageComponent implements OnInit {

  blog!: Blog;

  contentItemTypes = blogContentItemTypes;

  users: User[] = [];





  constructor(private route: ActivatedRoute, private alexit: AlexitService, public $: MyLibraryService, public auth: AuthService) { }
  ngOnInit(): void {
    this.route.params.subscribe(p => this.alexit.blogs$.subscribe(v => this.blog = v.filter(b => b._id === p["id"])[0]));
    this.alexit.users$.subscribe(v => this.users = v.filter(user => user.role === roles.CUSTOMER));
  }





  postComment(comment: HTMLTextAreaElement) {
    this.blog.comments.push({ user_id: String(localStorage.getItem("customer_id")), content: comment.value });
    this.alexit.miniUpdateBlog(this.blog);
    comment.value = "";
  }

  getUserName(id: string) {
    const firstname = this.users.find(user => user._id === id)?.firstname;
    const lastname = this.users.find(user => user._id === id)?.lastname;
    return firstname + " " + lastname;
  }







}
