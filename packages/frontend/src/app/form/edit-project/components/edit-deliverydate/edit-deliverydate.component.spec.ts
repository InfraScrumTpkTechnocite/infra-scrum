import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeliverydateComponent } from './edit-deliverydate.component';

describe('EditDeliverydateComponent', () => {
  let component: EditDeliverydateComponent;
  let fixture: ComponentFixture<EditDeliverydateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDeliverydateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeliverydateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
