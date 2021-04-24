import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspirometterComponent } from './espirometter.component';

describe('EspirometterComponent', () => {
  let component: EspirometterComponent;
  let fixture: ComponentFixture<EspirometterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspirometterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspirometterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
