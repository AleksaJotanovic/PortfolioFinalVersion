import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOffersListComponent } from './client-offers-list.component';

describe('ClientOffersListComponent', () => {
  let component: ClientOffersListComponent;
  let fixture: ComponentFixture<ClientOffersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientOffersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientOffersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
