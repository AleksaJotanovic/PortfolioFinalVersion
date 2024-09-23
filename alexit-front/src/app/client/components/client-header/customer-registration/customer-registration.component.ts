import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AlexitService } from '../../../../services/alexit.service';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { passwordMatch } from '../../../../admin/validators/confirm-password.validator';
import { User } from '../../../../../models/user.model';

@Component({
  selector: 'customer-registration',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, RouterLink, NgClass],
  templateUrl: './customer-registration.component.html',
  styleUrl: './customer-registration.component.css',
  providers: [provideNgxMask()]
})
export class CustomerRegistrationComponent implements OnInit {

  @Output() onRegistration = new EventEmitter<{ registrationForm: FormGroup }>();

  @Output() onLogin = new EventEmitter<{ loginForm: FormGroup }>();

  @Output() onModalClose = new EventEmitter();

  registrationForm: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
    shippingAddress: new FormGroup({
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(5)]),
      phone: new FormControl('', [Validators.required, Validators.minLength(3)]),
    })
  }, passwordMatch("password", "confirmPassword"));

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)])
  });

  emailInUse: boolean = false;

  @Input() formActive = { signup: false, signin: true };

  @Input() loginError: boolean = false;

  users: User[] = [];









  constructor(private alexit: AlexitService) { }
  ngOnInit(): void {
    this.alexit.users$.subscribe({ next: v => this.users = v, error: e => console.log(e) });
  }




  get registerEmail() {
    return this.registrationForm.get('email')
  }

  get loginEmail() {
    return this.loginForm.get('email');
  }

  get loginPassword() {
    return this.loginForm.get('password');
  }


  loginSubmitDisabled() {
    if (this.loginEmail?.invalid && !this.loginEmail.value && this.loginPassword?.invalid && !this.loginPassword.value && this.loginPassword.hasError("minlength") && this.loginPassword.hasError("maxlength")) {
      return true;
    } else if (!this.loginEmail?.invalid && this.loginEmail?.value && !this.loginPassword?.invalid && this.loginPassword?.value && !this.loginPassword.hasError("minlength") && !this.loginPassword.hasError("maxlength")) {
      return false;
    }
    return true;
  }





  emitOnRegistration(registrationForm: FormGroup) {
    if (this.registerEmail?.value.slice(-10) === '@gmail.com') {
      const user = this.users.filter(u => u.email === this.registerEmail?.value)[0];
      if (user !== undefined) {
        this.emailInUse = true
      } else {
        this.emailInUse = false
        if (!this.emailInUse) this.onRegistration.emit({ registrationForm: registrationForm });
      }
    }


  }

  emitOnLogin(loginForm: FormGroup) {
    this.onLogin.emit({ loginForm: loginForm });
  }






}
