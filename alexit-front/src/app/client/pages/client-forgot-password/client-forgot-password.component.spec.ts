import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientForgotPasswordComponent } from './client-forgot-password.component';

describe('ClientForgotPasswordComponent', () => {
  let component: ClientForgotPasswordComponent;
  let fixture: ComponentFixture<ClientForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientForgotPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
