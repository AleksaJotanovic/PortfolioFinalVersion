import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookies = inject(CookieService);

  if (!localStorage.getItem("user_id") || !cookies.get("access_token")) {
    router.navigate(["admin/login"]);
    return false;
  } else {
    return true;
  }

};
