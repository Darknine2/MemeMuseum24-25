import { TestBed } from '@angular/core/testing';

import { GlobalBackendService } from './global-backend-service';

describe('GlobalBackendService', () => {
  let service: GlobalBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
