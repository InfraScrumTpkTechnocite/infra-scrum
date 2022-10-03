import { TestBed } from '@angular/core/testing';

import { TimeentryService } from './timeentry.service';

describe('TimeentryService', () => {
  let service: TimeentryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeentryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
