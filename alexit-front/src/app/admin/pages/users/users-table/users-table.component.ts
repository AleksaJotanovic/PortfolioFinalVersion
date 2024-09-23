import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlexitService } from '../../../../services/alexit.service';
import { roles } from '../../../../../constants/roles';
import { usersSortingTriggers } from '../../../../../constants/users-sorting';

@Component({
  selector: 'users-table',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent implements OnInit {

  @Output() onUserDelete = new EventEmitter<{ id: string }>()

  users: User[] = [];

  usersBase: User[] = [];

  paginatedUsers: User[][] = [];

  currentPile: number = 0;

  roles: string[] = [roles.ADMIN, roles.CUSTOMER];

  trigger: string = "";

  order: string = "";

  sortingTriggers = usersSortingTriggers;






  constructor(private alexit: AlexitService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(q => {
      this.alexit.users$.subscribe(v => {

        this.currentPile = Number(q["currentPile"]);

        const initPagination = () => {
          let arr = [];
          for (let i = 0; i < this.usersBase.length; i += Number(q["limit"])) {
            arr.push(this.usersBase.slice(i, i + Number(q["limit"])));
            this.paginatedUsers = arr;
          }
          if (this.paginatedUsers.length > 0) {
            this.users = this.paginatedUsers[this.currentPile];
          }
        }



        if (q["limit"] && q["currentPile"]) {
          initPagination();
        }



        if (q["searchQuery"] && q["role"] !== "both") {
          this.usersBase = v.filter(u => u.role === q["role"])
            .filter(x => (x.firstname + x.lastname + x.email + x.role).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (q["searchQuery"] && q["role"] === "both") {
          this.usersBase = v.filter(x => (x.firstname + x.lastname + x.email + x.role).toLowerCase().indexOf(q["searchQuery"].toLowerCase()) >= 0);
          initPagination();
        } else if (!q["searchQuery"] && q["role"] !== "both") {
          this.usersBase = v.filter(u => u.role === q["role"]);
          initPagination();
        } else if (!q["searchQuery"] && q["role"] === "both") {
          this.usersBase = v.sort((a, b) => a.role.localeCompare(b.role));
          initPagination();
        }







        if (q["sortBy"] && q["inOrder"]) {
          this.trigger = q["sortBy"];
          this.order = q["inOrder"];

          switch (q["sortBy"]) {
            case this.sortingTriggers.EMAIL:
              this.usersBase = this.usersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.email.localeCompare(b.email);
                } else if (q["inOrder"] === "desc") {
                  return b.email.localeCompare(a.email);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.FIRSTNAME:
              this.usersBase = this.usersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.firstname.localeCompare(b.firstname);
                } else if (q["inOrder"] === "desc") {
                  return b.firstname.localeCompare(a.firstname);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
            case this.sortingTriggers.LASTNAME:
              this.usersBase = this.usersBase.sort((a, b) => {
                if (q["inOrder"] === "asc") {
                  return a.lastname.localeCompare(b.lastname);
                } else if (q["inOrder"] === "desc") {
                  return b.lastname.localeCompare(a.lastname);
                } else {
                  return 0;
                }
              });
              initPagination();
              break;
          }

        }




      });

    });
  }




  delete(id: string) {
    this.alexit.deleteUser(id);
  }

  updateFilters(search: string, role: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { searchQuery: search, role: role }, queryParamsHandling: "merge" });
  }

  sort(button: any) {
    this.trigger = button.id;
    switch (this.order) {
      case "":
        this.order = "asc";
        break;
      case "asc":
        this.order = "desc";
        break;
      case "desc":
        this.order = "";
        break;
    }
    if (this.order === "") {
      const currentUrlTree = this.router.parseUrl(this.router.url);
      delete currentUrlTree.queryParams["sortBy"];
      delete currentUrlTree.queryParams["inOrder"];
      this.router.navigateByUrl(currentUrlTree);
    } else {
      this.router.navigate([], { relativeTo: this.route, queryParams: { sortBy: this.trigger, inOrder: this.order }, queryParamsHandling: "merge" });
    }
  }

  nextPile() {
    if ((this.currentPile + 1) < this.paginatedUsers.length) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile + 1 }, queryParamsHandling: "merge" });
    }
  }

  previousPile() {
    if (this.currentPile !== 0) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { currentPile: this.currentPile - 1 }, queryParamsHandling: "merge" });
    }
  }





}
