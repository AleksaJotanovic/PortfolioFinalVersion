import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersCategoriesComponent } from './offers-categories.component';

describe('OffersCategoriesComponent', () => {
  let component: OffersCategoriesComponent;
  let fixture: ComponentFixture<OffersCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
