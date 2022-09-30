import { TestBed } from '@angular/core/testing';

import { KanbanstatusService } from './kanbanstatus.service';

describe('KanbanstatusService', () => {
  let service: KanbanstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
