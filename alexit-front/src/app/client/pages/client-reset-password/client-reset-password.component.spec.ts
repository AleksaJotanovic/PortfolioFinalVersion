import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientResetPasswordComponent } from './client-reset-password.component';

describe('ClientResetPasswordComponent', () => {
  let component: ClientResetPasswordComponent;
  let fixture: ComponentFixture<ClientResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientResetPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
