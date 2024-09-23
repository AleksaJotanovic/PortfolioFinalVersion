import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { offerGuard } from './offer.guard';

describe('offerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => offerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
