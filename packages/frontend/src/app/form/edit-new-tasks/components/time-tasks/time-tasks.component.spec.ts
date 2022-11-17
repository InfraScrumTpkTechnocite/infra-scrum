import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTasksComponent } from './time-tasks.component';

describe('TimeTasksComponent', () => {
  let component: TimeTasksComponent;
  let fixture: ComponentFixture<TimeTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
