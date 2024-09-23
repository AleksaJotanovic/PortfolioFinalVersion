import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { newsletterSubscriptionGuard } from './newsletter-subscription.guard';

describe('newsletterSubscriptionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => newsletterSubscriptionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
