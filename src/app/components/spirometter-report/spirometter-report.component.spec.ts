import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpirometterReportComponent } from './spirometter-report.component';

describe('SpirometterReportComponent', () => {
  let component: SpirometterReportComponent;
  let fixture: ComponentFixture<SpirometterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpirometterReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpirometterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
