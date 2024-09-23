import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviouslyViewedComponent } from './previously-viewed.component';

describe('PreviouslyViewedComponent', () => {
  let component: PreviouslyViewedComponent;
  let fixture: ComponentFixture<PreviouslyViewedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviouslyViewedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviouslyViewedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
