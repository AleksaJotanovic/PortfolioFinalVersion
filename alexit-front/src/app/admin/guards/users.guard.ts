import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

export const usersGuard: CanActivateFn = (route, state) => {
  const cookies = inject(CookieService);
  const router = inject(Router);
  const userAllowed: any = jwtDecode(cookies.get("access_token"));


  if (userAllowed.roleName === "Admin") {
    return true
  } else {
    router.navigate(["admin"]);
    return false;
  }

};
