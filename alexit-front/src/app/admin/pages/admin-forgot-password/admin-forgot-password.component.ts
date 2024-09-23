import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlexitService } from '../../../services/alexit.service';
import { roles } from '../../../../constants/roles';

@Component({
  selector: 'admin-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-forgot-password.component.html',
  styleUrl: './admin-forgot-password.component.css'
})
export class AdminForgotPasswordComponent {

  incorrect: boolean = false;

  emailCheckNotification: boolean = false;

  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl("", Validators.compose([Validators.required, Validators.email]))
  })



  constructor(private auth: AuthService, private alexit: AlexitService) { }




  submit() {
    this.alexit.users$.subscribe(v => {
      let user = v.filter(u => (u.email === this.forgetPasswordForm.value.email && u.role === roles.ADMIN))[0];
      if (user) this.incorrect = false; else this.incorrect = true;
    });
    if (!this.incorrect) {
      this.auth.sendPasswordResetMail(this.forgetPasswordForm.value.email).subscribe(() => this.emailCheckNotification = true);
    }
  }

}
