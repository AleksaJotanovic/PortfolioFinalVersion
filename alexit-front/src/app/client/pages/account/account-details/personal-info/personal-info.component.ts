import { Component } from '@angular/core';
import { User } from '../../../../../../models/user.model';
import { CrudService } from '../../../../../services/crud.service';

@Component({
  selector: 'personal-info',
  standalone: true,
  imports: [],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent {


  user!: User;


  constructor(private crud: CrudService) {
    this.crud.userGet(String(localStorage.getItem("customer_id"))).subscribe(res => {
      this.user = res.data;
    });
  }


}
