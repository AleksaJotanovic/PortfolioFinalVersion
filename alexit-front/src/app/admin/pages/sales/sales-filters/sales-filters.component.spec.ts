import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesFiltersComponent } from './sales-filters.component';

describe('SalesFiltersComponent', () => {
  let component: SalesFiltersComponent;
  let fixture: ComponentFixture<SalesFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesFiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
