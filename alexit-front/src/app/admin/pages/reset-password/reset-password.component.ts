import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '../../validators/confirm-password.validator';

@Component({
  selector: 'reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(40)]),
    confirmPassword: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(40)]),
  }, passwordMatch('password', 'confirmPassword'));

  token!: string;



  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe((val) => this.token = val["token"]);
  }



  resetPassword() {
    let resetObj = {
      token: this.token.replace('-', '.').replace('-', '.'),
      password: this.resetPasswordForm.value.password
    }

    this.auth.resetPasswordService(resetObj).subscribe({
      next: (val) => {
        this.resetPasswordForm.reset();
        this.router.navigate(["admin/login"]);
      }, error: (err) => console.log(err)
    })
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
            : "";
  }

  public getConfirmPasswordError() {
    const control: any = this.confirmPasswordControl;
    return control.hasError('required')
      ? 'Please confirm the  password'
      : control.hasError('passwordMismatch')
        ? 'The passwords do not match'
        : "";
  }

}
