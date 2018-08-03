import { Component, OnInit, EventEmitter, Input, ViewChild, SimpleChanges } from '@angular/core';
import { Settings } from '../../../shared/models/settings';
import { ModalDirective } from 'ngx-bootstrap';
import { SuiteDbService } from '../../suite-db.service';
import { IndexedDbService } from '../../../indexedDb/indexed-db.service';
import { Motor } from '../../../shared/models/motor';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { CustomEquipmentService } from '../custom-equipment.service';
import { ConvertUnitsService } from '../../../shared/convert-units/convert-units.service';

@Component({
  selector: 'app-custom-motor',
  templateUrl: './custom-motor.component.html',
  styleUrls: ['./custom-motor.component.css']
})
export class CustomMotorComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  showModal: boolean;
  @Input()
  importing: boolean;

  editExistingEquipment: boolean = false;
  existingEquipment: Motor;
  deletingEquipment: boolean = false;
  gasChargeEquipment: Array<Motor>;
  @ViewChild('materialModal') public materialModal: ModalDirective;
  selectedSub: Subscription;
  selectAllSub: Subscription;

  constructor(private suiteDbService: SuiteDbService, private indexedDbService: IndexedDbService, private customEquipmentService: CustomEquipmentService, private convertUnitsService: ConvertUnitsService) { }

  ngOnInit() {
    this.gasChargeEquipment = new Array<Motor>();
    this.getCustomEquipment();
    this.selectedSub = this.customEquipmentService.getSelected.subscribe((val) => {
      if (val) {
        this.getSelected();
      }
    })

    this.selectAllSub = this.customEquipmentService.selectAll.subscribe(val => {
      this.selectAll(val);
    })
  }

  ngOnDestroy() {
    this.selectAllSub.unsubscribe();
    this.selectedSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  convertAllEquipment() 
  }

  getCustomEquipment() {
  }

  editEquipment(id: number) {
  }

  deleteEquipment(id: number) {
  }

  showEquipmentModal() {
  }

  hideEquipmentModal(event?: any) {
  }
  getSelected() {
  }

  selectAll(val: boolean) {
  }
}
