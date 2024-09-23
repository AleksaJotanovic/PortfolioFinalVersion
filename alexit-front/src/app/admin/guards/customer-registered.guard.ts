import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const customerRegisteredGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookies = inject(CookieService);

  if (!localStorage.getItem("customer_id") && !cookies.get("customer_token")) {
    router.navigate([""]);
    return false;
  } else {
    return true;
  }

};
