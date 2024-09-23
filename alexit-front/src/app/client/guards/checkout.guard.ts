import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const cart = inject(CartService);
  const router = inject(Router);

  if (cart.getCart().length > 0) {
    return true;
  } else {
    router.navigate([""]);
    return false;
  }
};
