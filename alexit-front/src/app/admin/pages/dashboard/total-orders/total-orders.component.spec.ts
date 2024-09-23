import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalOrdersComponent } from './total-orders.component';

describe('TotalOrdersComponent', () => {
  let component: TotalOrdersComponent;
  let fixture: ComponentFixture<TotalOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
