import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Motor } from '../../shared/models/equipment';
import { ImportExportService } from '../../shared/import-export/import-export.service';
import { SuiteDbService } from '../suite-db.service';
import { IndexedDbService } from '../../indexedDb/indexed-db.service';

@Injectable()
export class CustomEquipmentService {

  selectedMotor: Array<Motor>;

  getSelected: BehaviorSubject<boolean>;
  selectAll: BehaviorSubject<boolean>;
  constructor(private importExportService: ImportExportService, private suiteDbService: SuiteDbService, private indexedDbService: IndexedDbService) {
    this.selectedMotor = new Array<Motor>();
    this.getSelected = new BehaviorSubject<boolean>(false);
    this.selectAll = new BehaviorSubject<boolean>(false);
  }


  buildSelectedData(): EquipmentData {
    let data: EquipmentData = {
      motor: this.selectedMotor
    }
    return data;
  }

  importSelected(data: EquipmentData) {
    if (data.motor.length != 0) {
      this.importAtmosphere(data.motor)
    }

  }


  importAtmosphere(data: Array<Motor>) {
    data.forEach(equipment => {
      delete equipment.id;
      equipment.selected = false;
      let test: boolean = this.suiteDbService.insertMotor(equipment);
      if (test == true) {
        this.indexedDbService.addMotor(equipment);
      }
    })
  }


  deleteSelected(data: EquipmentData) {
    if (data.motor.length != 0) {
      this.deleteMotor(data.motor)
    }
    }
  }


  deleteMotor(data: Array<Motor>) {
    let sdbEquipment: Array<Motor> = this.suiteDbService.selectedMotor();
    data.forEach(equipment => {
      this.indexedDbService.deleteMotor(equipment.id);
      let sdbId: number = _.find(sdbEquipment, (sdbMaterial) => { return equipment.manufacturer == sdbEquipment.manufacturer }).id;
      this.suiteDbService.deleteMotor(sdbId);
    })
  }

}


export interface EquipmentData {
  motor: Array<Motor>
}
