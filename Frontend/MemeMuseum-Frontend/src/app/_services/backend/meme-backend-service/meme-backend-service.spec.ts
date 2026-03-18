import { TestBed } from '@angular/core/testing';

import { MemeBackendService } from './meme-backend-service';

describe('MemeBackendService', () => {
  let service: MemeBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemeBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
