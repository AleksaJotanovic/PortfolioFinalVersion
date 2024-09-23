import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { CrudService } from '../../../services/crud.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'admin-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent implements OnInit {

  user!: User;


  constructor(private cookies: CookieService, private router: Router, private auth: AuthService, private crud: CrudService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.crud.userGet(String(localStorage.getItem("user_id"))).subscribe(v => this.user = v.data);
  }



  logout() {
    localStorage.removeItem("user_id");
    this.cookies.delete("access_token", "/");
    if (!this.auth.isAdminLoggedIn) {
      this.router.navigate(["admin/login"]);
    }
  }



}
