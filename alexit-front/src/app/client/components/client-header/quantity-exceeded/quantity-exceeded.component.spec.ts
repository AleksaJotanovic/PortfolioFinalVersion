import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityExceededComponent } from './quantity-exceeded.component';

describe('QuantityExceededComponent', () => {
  let component: QuantityExceededComponent;
  let fixture: ComponentFixture<QuantityExceededComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityExceededComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuantityExceededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
