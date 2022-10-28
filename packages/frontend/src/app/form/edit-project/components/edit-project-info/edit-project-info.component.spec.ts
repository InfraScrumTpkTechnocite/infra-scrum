import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectInfoComponent } from './edit-project-info.component';

describe('EditProjectInfoComponent', () => {
  let component: EditProjectInfoComponent;
  let fixture: ComponentFixture<EditProjectInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProjectInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProjectInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
