import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlexitService } from '../../../services/alexit.service';
import { roles } from '../../../../constants/roles';
import { User } from '../../../../models/user.model';
import * as bcrypt from "bcryptjs";

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  valid: boolean | null = null;

  userExist: boolean = true;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)])
  });

  users: User[] = [];



  constructor(private auth: AuthService, private router: Router, private alexit: AlexitService) { }
  ngOnInit(): void {
    this.alexit.users$.subscribe(v => this.users = v.filter(x => x.role === roles.ADMIN));
  }




  async logIn() {
    const user = this.users.filter(x => x.email === this.loginForm.value.email)[0]



    if (user) {
      this.userExist = true;
      await bcrypt.compare(this.loginForm.value.password, user.password).then(matching => {
        if (matching) {
          this.valid = true;
          if (this.valid) {
            this.auth.loginService(this.loginForm.value).subscribe(v => {
              localStorage.setItem("user_id", v.data._id);
              this.router.navigate(["admin/dashboard"]);
              this.loginForm.reset();
            })
          }
        } else {
          this.valid = false;
        }
      });
    } else {
      this.userExist = false;
      this.valid = null;
    }




  }





}
