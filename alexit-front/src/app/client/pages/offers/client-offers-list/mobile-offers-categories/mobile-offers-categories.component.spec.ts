import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileOffersCategoriesComponent } from './mobile-offers-categories.component';

describe('MobileOffersCategoriesComponent', () => {
  let component: MobileOffersCategoriesComponent;
  let fixture: ComponentFixture<MobileOffersCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileOffersCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileOffersCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
