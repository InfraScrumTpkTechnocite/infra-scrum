import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewTasksComponent } from './edit-new-tasks.component';

describe('EditNewTasksComponent', () => {
  let component: EditNewTasksComponent;
  let fixture: ComponentFixture<EditNewTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNewTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditNewTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
