import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { customerRegisteredGuard } from './customer-registered.guard';

describe('customerRegisteredGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => customerRegisteredGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
