import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerShippingComponent } from './customer-shipping.component';

describe('CustomerShippingComponent', () => {
  let component: CustomerShippingComponent;
  let fixture: ComponentFixture<CustomerShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerShippingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
