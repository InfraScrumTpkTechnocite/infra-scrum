import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksHistoryComponent } from './tasks-history.component';

describe('TasksHistoryComponent', () => {
  let component: TasksHistoryComponent;
  let fixture: ComponentFixture<TasksHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
