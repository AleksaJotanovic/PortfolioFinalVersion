import { CanActivateFn } from '@angular/router';

export const offerGuard: CanActivateFn = (route, state) => {

  if (route.queryParams["available"] === "true") {
    return true;
  }
  return false;
};