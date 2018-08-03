import { TestBed, inject } from '@angular/core/testing';

import { CustomMaterialsService } from './custom-materials.service';

describe('CustomEquipmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomMaterialsService]
    });
  });

  it('should be created', inject([CustomMaterialsService], (service: CustomMaterialsService) => {
    expect(service).toBeTruthy();
  }));
});
