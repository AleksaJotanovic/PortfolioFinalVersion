import { TestBed } from '@angular/core/testing';

import { AlexitService } from './alexit.service';

describe('AlexitService', () => {
  let service: AlexitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlexitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
