import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectuserComponent } from './edit-projectuser.component';

describe('EditProjectuserComponent', () => {
  let component: EditProjectuserComponent;
  let fixture: ComponentFixture<EditProjectuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProjectuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProjectuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
