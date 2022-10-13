import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanStatusComponent } from './kanban-status.component';

describe('KanbanStatusComponent', () => {
  let component: KanbanStatusComponent;
  let fixture: ComponentFixture<KanbanStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
