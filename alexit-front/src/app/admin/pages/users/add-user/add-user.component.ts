import { Component } from '@angular/core';
import { AlexitService } from '../../../../services/alexit.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../../models/user.model';
import { v4 as uuid } from 'uuid';
import { roles } from '../../../../../constants/roles';
import { passwordMatch } from '../../../validators/confirm-password.validator';

@Component({
  selector: 'add-user',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

  roles: string[] = [roles.ADMIN, roles.CUSTOMER];

  userForm: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
    confirmPassword: new FormControl('', Validators.compose([Validators.required])),
    shippingAddress: new FormGroup({
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    })
  }, passwordMatch('password', 'confirmPassword'));






  constructor(private alexit: AlexitService) { };






  save() {
    const userBody: User = { ...this.userForm.value }
    this.alexit.addUser(userBody);
    this.userForm.reset();
  }

  get passwordValue() {
    return this.userForm.get('password')?.value;
  }

  get passwordControl() {
    return this.userForm.get('password');
  }

  get confirmPasswordControl() {
    return this.userForm.get('confirmPassword');
  }

  public getPasswordError() {
    const control: any = this.passwordControl;
    return control.hasError('required')
      ? 'Please enter a valid password'
      : control.hasError('minlength')
        ? 'The minimum password length is 8 characters'
        : control.hasError('maxlength')
          ? 'The maximum password length is 32 characters'
          : control.hasError('invalidPasswordMinLowerCaseLetters')
            ? 'The password must have at least 2 lower case letters [a-z]'
            : '';
  }

  public getConfirmPasswordError() {
    const control: any = this.confirmPasswordControl;
    return control.hasError('required')
      ? 'Please confirm the  password'
      : control.hasError('passwordMismatch')
        ? 'The passwords do not match'
        : '';
  }




}
