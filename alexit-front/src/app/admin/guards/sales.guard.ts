import { CanActivateFn } from '@angular/router';

export const salesGuard: CanActivateFn = (route, state) => {
  return true;
};
