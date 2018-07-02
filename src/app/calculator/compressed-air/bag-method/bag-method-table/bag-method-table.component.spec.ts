import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BagMethodTableComponent } from './bag-method-table.component';

describe('BagMethodTableComponent', () => {
  let component: BagMethodTableComponent;
  let fixture: ComponentFixture<BagMethodTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BagMethodTableComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BagMethodTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
