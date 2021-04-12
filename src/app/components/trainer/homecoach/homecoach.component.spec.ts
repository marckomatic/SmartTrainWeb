import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomecoachComponent } from './homecoach.component';

describe('HomecoachComponent', () => {
  let component: HomecoachComponent;
  let fixture: ComponentFixture<HomecoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomecoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomecoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
