import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMotorComponent } from './custom-motor.component';

describe('CustomMotorComponent', () => {
  let component: CustomMotorComponent;
  let fixture: ComponentFixture<CustomMotorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomMotorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
