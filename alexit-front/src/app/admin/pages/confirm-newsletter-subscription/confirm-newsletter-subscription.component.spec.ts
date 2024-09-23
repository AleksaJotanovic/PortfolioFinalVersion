import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmNewsletterSubscriptionComponent } from './confirm-newsletter-subscription.component';

describe('ConfirmNewsletterSubscriptionComponent', () => {
  let component: ConfirmNewsletterSubscriptionComponent;
  let fixture: ComponentFixture<ConfirmNewsletterSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmNewsletterSubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmNewsletterSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
