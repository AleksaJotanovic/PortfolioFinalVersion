import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileBlogTopicsComponent } from './mobile-blog-topics.component';

describe('MobileBlogTopicsComponent', () => {
  let component: MobileBlogTopicsComponent;
  let fixture: ComponentFixture<MobileBlogTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileBlogTopicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileBlogTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
