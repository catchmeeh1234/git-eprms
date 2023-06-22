import { TestBed } from '@angular/core/testing';

import { PrUpdateStatusService } from './pr-update-status.service';

describe('PrUpdateStatusService', () => {
  let service: PrUpdateStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrUpdateStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
