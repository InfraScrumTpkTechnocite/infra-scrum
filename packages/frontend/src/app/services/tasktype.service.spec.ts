import { TestBed } from '@angular/core/testing';

import { TasktypeService } from './tasktype.service';

describe('TasktypeService', () => {
  let service: TasktypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasktypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
