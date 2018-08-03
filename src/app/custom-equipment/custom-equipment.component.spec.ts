import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEquipmentComponent } from './custom-equipment.component';

describe('CustomEquipmentComponent', () => {
  let component: CustomEquipmentComponent;
  let fixture: ComponentFixture<CustomEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
