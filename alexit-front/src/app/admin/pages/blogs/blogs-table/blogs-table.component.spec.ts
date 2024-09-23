import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsTableComponent } from './blogs-table.component';

describe('BlogsTableComponent', () => {
  let component: BlogsTableComponent;
  let fixture: ComponentFixture<BlogsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
