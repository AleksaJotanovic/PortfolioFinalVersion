import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlexitService } from '../../../../services/alexit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../../models/user.model';
import { roles } from '../../../../../constants/roles';

@Component({
  selector: 'user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  roles: string[] = [roles.ADMIN, roles.CUSTOMER];

  userForm: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', [Validators.required]),
    shippingAddress: new FormGroup({
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    })
  });





  constructor(private alexit: AlexitService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.alexit.users$.subscribe(v => {
      const user = v.find((u) => u._id === this.route.snapshot.params['id']);
      if (user !== undefined) {
        this.userForm.setValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          shippingAddress: user.shippingAddress
        })
      }
    });
  }





  update() {
    const userBody: User = { ...this.userForm.value, _id: this.route.snapshot.params['id'] };
    this.alexit.updateUser(userBody);
    this.userForm.reset();
    this.router.navigate(['admin/users']);
  }




}
