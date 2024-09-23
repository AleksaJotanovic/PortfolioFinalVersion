import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { AlexitService } from '../../../../services/alexit.service';
import { blogContentItemTypes } from '../../../../../constants/blog-content-item-types';
import { Blog } from '../../../../../models/blog.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { NgClass, NgStyle } from '@angular/common';
import { timer } from 'rxjs';

@Component({
  selector: 'blog-editor',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatButton, RouterLink, NgClass, NgStyle],
  templateUrl: './blog-editor.component.html',
  styleUrl: './blog-editor.component.css'
})
export class BlogEditorComponent implements OnInit, AfterViewInit {

  blogTopics: { _id: string, name: string }[] = [];

  contentItemTypes = blogContentItemTypes;

  singleImagesList: { id: number, file: FormData }[] = [];

  galleriesList: { id: number, files: FormData }[] = [];

  featuredImage: FormData = new FormData();

  blog: Blog = {
    _id: "",
    topic_id: "",
    title: "",
    featuredImage: "",
    content: [],
    published: false,
    date: "",
    comments: []
  }

  @ViewChildren('textarea') textareas!: QueryList<ElementRef<HTMLTextAreaElement>>;

  id: string = '';

  idIncrementor: number = -1;







  constructor(private alexit: AlexitService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.alexit.blogTopics$.subscribe(bt => this.blogTopics = bt);
    this.route.params.subscribe(p => {
      if (p['id']) {
        this.id = p['id'];
        if (this.id !== '') {
          this.alexit.blogs$.subscribe(v => {
            const blog = v.filter(b => b._id === this.id)[0];
            if (blog) this.blog = blog;
          })
        }
      }
    })
  }

  ngAfterViewInit(): void {
    this.textareas.changes.subscribe((textareas: QueryList<ElementRef<HTMLTextAreaElement>>) => textareas.forEach(txt => {
      if (!txt.nativeElement.validity.valueMissing) {
        timer(0).subscribe(() => this.textareas.forEach(txt => this.fitTextareaDimensions({ target: txt.nativeElement })));
      }
    }));
    timer(0).subscribe(() => this.textareas.forEach(txt => this.fitTextareaDimensions({ target: txt.nativeElement })));
  }








  @HostListener('window:resize', ['$event'])
  onResize() {
    this.textareas.forEach(txt => this.fitTextareaDimensions({ target: txt.nativeElement }));
  }

  fitTextareaDimensions(e: any) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }

  uploadFeaturedImage(e: any, featuredImage: HTMLImageElement) {
    let imageBlob = e.target.files;
    this.featuredImage.set("file", imageBlob[0]);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      featuredImage.src = event.target.result;
    }
    reader.readAsDataURL(imageBlob.item(0));
  }

  uploadContentImage(e: any, contentImage: HTMLImageElement) {
    this.singleImagesList = this.singleImagesList.filter(img => img.id !== Number(e.currentTarget.id));
    let fileToUpload = e.target.files;
    const formdata = new FormData();
    formdata.set('file', fileToUpload[0]);
    if (e.currentTarget.id === contentImage.id) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        contentImage.src = event.target.result;
      }
      reader.readAsDataURL(fileToUpload.item(0));
    }
    this.singleImagesList.push({ id: Number(e.currentTarget.id), file: formdata });
  }

  uploadGallery(e: any, glrImage1: HTMLImageElement, glrImage2: HTMLImageElement, glrImage3: HTMLImageElement) {
    this.galleriesList = this.galleriesList.filter(glr => glr.id !== Number(e.currentTarget.id));
    const galleryRef = [glrImage1, glrImage2, glrImage3];
    let filesToUpload = e.target.files;
    const formdata = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      formdata.append("files", filesToUpload[i]);
      if (glrImage1.id === e.currentTarget.id && glrImage2.id === e.currentTarget.id && glrImage3.id === e.currentTarget.id) {
        for (let x in galleryRef) {
          let reader = new FileReader();
          reader.onload = (event: any) => {
            galleryRef[x].src = event.target.result;
          }
          reader.readAsDataURL(filesToUpload.item(x));
        }
      }
    }
    this.galleriesList.push({ id: Number(e.currentTarget.id), files: formdata })
  }

  addContentItem(e: any) {
    this.idIncrementor++;
    if (e.currentTarget.id === this.contentItemTypes.GALLERY || e.currentTarget.id === this.contentItemTypes.IMAGE) {
      this.blog.content.push({ _id: this.idIncrementor, key: e.currentTarget.id, value: [] });
    } else {
      this.blog.content.push({ _id: this.idIncrementor, key: e.currentTarget.id, value: [''] });
    }
  }

  submit() {
    if (this.id !== "") {
      this.update();
    } else {
      this.publish();
    }
  }

  publish() {
    this.blog.published = true;
    console.log(this.blog);
    if (this.blog.published) this.alexit.addBlog({ ...this.blog, _id: uuid() }, this.featuredImage, this.singleImagesList, this.galleriesList);
    this.router.navigate(['admin/blogs'], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", topicId: "all", status: "both" } });
  }

  update() {
    this.alexit.updateBlog(this.blog, this.featuredImage, this.singleImagesList, this.galleriesList);
    this.router.navigate(['admin/blogs'], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", topicId: "all", status: "both" } });
  }

  saveDraft() {
    this.blog.published = false;
    if (!this.blog.published) this.alexit.updateBlog(this.blog, this.featuredImage, this.singleImagesList, this.galleriesList);
    this.router.navigate(['admin/blogs'], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", topicId: "all", status: "both" } });
  }

  delete(id: string) {
    for (let item of this.blog.content) {
      if (item.key === this.contentItemTypes.IMAGE) {
        this.alexit.deleteAnyFile(item.value[0]);
      }
      if (item.key === this.contentItemTypes.GALLERY) {
        this.alexit.deleteAnyFile(item.value[0]);
        this.alexit.deleteAnyFile(item.value[1]);
        this.alexit.deleteAnyFile(item.value[2]);
      }
    }
    this.alexit.deleteAnyFile(this.blog.featuredImage);
    this.alexit.deleteBlog(id);
    this.router.navigate(['admin/blogs'], { queryParams: { limit: 13, currentPile: 0, searchQuery: "", topicId: "all", status: "both" } });
  }


  addBlogTopic(e: any) {
    this.alexit.addBlogTopic(e.target.value);
    e.target.value = "";
  }





}
