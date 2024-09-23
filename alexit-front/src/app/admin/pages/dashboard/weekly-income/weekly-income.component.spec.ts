import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyIncomeComponent } from './weekly-income.component';

describe('WeeklyIncomeComponent', () => {
  let component: WeeklyIncomeComponent;
  let fixture: ComponentFixture<WeeklyIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyIncomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
