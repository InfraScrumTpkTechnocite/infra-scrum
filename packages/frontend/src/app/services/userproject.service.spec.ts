import { TestBed } from '@angular/core/testing';

import { UserprojectService } from './userproject.service';

describe('UserprojectService', () => {
  let service: UserprojectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserprojectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
