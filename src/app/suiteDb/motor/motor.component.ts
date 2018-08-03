import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Motor } from '../../shared/models/equipment';
import { SuiteDbService } from '../suite-db.service';
import { IndexedDbService } from '../../indexedDb/indexed-db.service';
import * as _ from 'lodash';
import { Settings } from '../../shared/models/settings';
import { ConvertUnitsService } from '../../shared/convert-units/convert-units.service';
import { PhastService } from '../../phast/phast.service';





@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.css']
})
export class MotorComponent implements OnInit {
  @Output('closeModal')
  closeModal = new EventEmitter<Motor>();
  @Input()
  settings: Settings;
  @Input()
  editExistingEquipment: boolean;
  @Input()
  existingEquipment: Motor;
  @Input()
  deletingEquipment: boolean;
  @Output('hideModal')
  hideModal = new EventEmitter();
  // @Input()
  // newEquipment: Motor;
  newEquipment: Motor = {
    

  };
  selectedEquipment: Motor;
  allEquipments: Array<Motor>;
  allCustomEquipments: Array<Motor>;
  isValid: boolean;
  nameError: string = null;
  canAdd: boolean;
  isNameValid: boolean;
  currentField: string = 'selectedEquipment';
  totalOfMotors: number = 0;
  difference: number = 0;
  differenceError: boolean = false;
  idbEditEquipmentId: number;
  sdbEditEquipmentId: number;
  constructor(private suiteDbService: SuiteDbService, private indexedDbService: IndexedDbService, private convertUnitsService: ConvertUnitsService, private phastService: PhastService) { }

  ngOnInit() {

    if (this.editExistingEquipment) {
    }
    else {
    }
  }

  checkInputEquipment() {
    if (this.editExistingEquipment && this.existingEquipment) {
      this.newEquipment = this.existingEquipment;
    }
    else if (this.newEquipment === undefined || this.newEquipment === null) {
      this.newEquipment = {
        
      };
    }
  }

  getTotalOfMotors() {
    this.getDiff();
  }

  addEquipment() {
    if (this.canAdd) {

    }
  }

  updateEquipment() {

  }

  deleteEquipment() {

  }

  getDiff() {

  }

  hideEquipmentModal() {
    this.hideModal.emit();
  }

  setExisting() {
    if (this.editExistingEquipment && this.existingEquipment) {
      this.newEquipment = {
      }
      if (this.settings.unitsOfMeasure == 'Metric') {
      }
      this.getTotalOfMotors();
      this.setHHV();
    }
    else if (this.selectedEquipment) {
      this.newEquipment = {
      }
      if (this.settings.unitsOfMeasure == 'Metric') {
      }
      this.getTotalOfMotors();
      this.checkEquipmentName();
      this.setHHV();
    }
  }

  setHHV() {
    this.getTotalOfMotors();

  }

  checkEditEquipmentName() {

  }

  checkEquipmentName() {

  }

  focusField(str: string) {
    this.currentField = str;
  }
}
