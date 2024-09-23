import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../admin/services/auth.service';
import { User } from '../../../../models/user.model';
import { AlexitService } from '../../../services/alexit.service';
import { roles } from '../../../../constants/roles';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'client-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './client-forgot-password.component.html',
  styleUrl: './client-forgot-password.component.css'
})
export class ClientForgotPasswordComponent implements OnInit {

  users: User[] = [];

  userExist: boolean = true;

  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl("", Validators.compose([Validators.required, Validators.email]))
  });





  constructor(private auth: AuthService, private alexit: AlexitService, private router: Router) { }
  ngOnInit(): void {
    this.alexit.users$.subscribe(v => this.users = v.filter(user => user.role === roles.CUSTOMER));
  }






  submit(warning: HTMLElement) {
    const user = this.users.find(usr => usr.email === this.forgetPasswordForm.value.email);
    if (user) {
      this.userExist = true;
      if (this.userExist) {
        warning.classList.add("active");
        this.auth.sendPasswordResetMail(this.forgetPasswordForm.value.email).subscribe(() => {
          this.router.navigate([""]);
        });
      }
    } else {
      warning.classList.add("active");
      this.userExist = false;
    }
  }







}
