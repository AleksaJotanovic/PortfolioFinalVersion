import { Component, OnInit } from '@angular/core';
import { roles } from '../../../../../constants/roles';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatch } from '../../../validators/confirm-password.validator';
import { AlexitService } from '../../../../services/alexit.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../../../models/user.model';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'user-editor',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, RouterLink],
  templateUrl: './user-editor.component.html',
  styleUrl: './user-editor.component.css'
})
export class UserEditorComponent implements OnInit {

  roles = roles


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

  passwordVisible: boolean = false;

  id: string = "";









  constructor(private alexit: AlexitService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"] || "";
    if (this.id === "") this.passwordVisible = true;
    this.alexit.users$.subscribe(v => {
      const user = v.filter((u) => u._id === this.id)[0]
      if (user) {
        this.userForm.patchValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          shippingAddress: user.shippingAddress
        });
        if (user.role === roles.ADMIN && user._id === localStorage.getItem("user_id")) {
          this.passwordVisible = true;
        } else if (user.role === roles.CUSTOMER) {
          this.userForm.disable();
        }
      }
    });
  }






  submit() {
    if (this.id !== "") {
      this.update();
    } else {
      this.save();
    }
    this.router.navigate(["/admin/users"], { queryParams: { limit: 13, currentPile: 0, searchQuery: '', role: 'both' } });
  }

  update() {
    const userBody: User = { ...this.userForm.value, _id: this.route.snapshot.params['id'] };
    this.alexit.updateUser(userBody);
    this.userForm.reset();
    this.router.navigate(['admin/users']);
  }

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
