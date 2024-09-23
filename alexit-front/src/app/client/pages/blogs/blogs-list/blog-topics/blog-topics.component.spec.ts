import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogTopicsComponent } from './blog-topics.component';

describe('BlogTopicsComponent', () => {
  let component: BlogTopicsComponent;
  let fixture: ComponentFixture<BlogTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogTopicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
