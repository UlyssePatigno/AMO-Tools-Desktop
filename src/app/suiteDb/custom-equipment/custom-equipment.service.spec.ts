import { TestBed, inject } from '@angular/core/testing';

import { CustomEquipmentService } from './custom-equipment.service';

describe('CustomEquipmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomEquipmentService]
    });
  });

  it('should be created', inject([CustomEquipmentService], (service: CustomEquipmentService) => {
    expect(service).toBeTruthy();
  }));
});
