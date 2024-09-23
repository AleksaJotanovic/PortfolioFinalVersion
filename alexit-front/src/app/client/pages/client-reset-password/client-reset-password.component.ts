import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../admin/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '../../../admin/validators/confirm-password.validator';

@Component({
  selector: 'client-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './client-reset-password.component.html',
  styleUrl: './client-reset-password.component.css'
})
export class ClientResetPasswordComponent {


  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
  }, passwordMatch('password', 'confirmPassword'));

  token!: string;



  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe((val) => this.token = val['token']);
  }



  resetPassword() {
    let resetObj = {
      token: this.token.replace('-', '.').replace('-', '.'),
      password: this.resetPasswordForm.value.password
    }

    this.auth.resetPasswordService(resetObj).subscribe({
      next: (val) => {
        alert(val.message);
        this.resetPasswordForm.reset();
        this.router.navigate([""]);
      }, error: (err) => console.log(err)
    })
  }



  get passwordValue() {
    return this.resetPasswordForm.get('password')?.value;
  }

  get passwordControl() {
    return this.resetPasswordForm.get('password');
  }

  get confirmPasswordControl() {
    return this.resetPasswordForm.get('confirmPassword');
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
