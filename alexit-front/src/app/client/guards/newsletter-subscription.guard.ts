import { CanActivateFn } from '@angular/router';

export const newsletterSubscriptionGuard: CanActivateFn = (route, state) => {
  return true;
};
