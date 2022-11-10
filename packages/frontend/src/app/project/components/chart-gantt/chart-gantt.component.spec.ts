import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGanttComponent } from './chart-gantt.component';

describe('ChartGanttComponent', () => {
  let component: ChartGanttComponent;
  let fixture: ComponentFixture<ChartGanttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartGanttComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
