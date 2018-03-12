import { Component, OnInit, Input, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { PhastService } from '../../phast.service';
import { AuxiliaryPowerLoss } from '../../../shared/models/phast/losses/auxiliaryPowerLoss';
import { Losses } from '../../../shared/models/phast/phast';
import { AuxiliaryPowerLossesService } from './auxiliary-power-losses.service';
import { AuxiliaryPowerCompareService } from './auxiliary-power-compare.service';
import { Settings } from '../../../shared/models/settings';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-auxiliary-power-losses',
  templateUrl: './auxiliary-power-losses.component.html',
  styleUrls: ['./auxiliary-power-losses.component.css']
})
export class AuxiliaryPowerLossesComponent implements OnInit {
  @Input()
  losses: Losses;
  @Input()
  addLossToggle: boolean;
  @Output('savedLoss')
  savedLoss = new EventEmitter<boolean>();
  @Input()
  baselineSelected: boolean;
  @Output('fieldChange')
  fieldChange = new EventEmitter<string>();
  @Input()
  isBaseline: boolean;
  @Input()
  settings: Settings;
  @Input()
  isLossesSetup: boolean;
  @Input()
  inSetup: boolean;
  @Input()
  modExists: boolean;

  inputError: boolean = false;
  resultsUnit: string;
  _auxiliaryPowerLosses: Array<AuxPowLossObj>;
  firstChange: boolean = true;
  lossesLocked: boolean = false;
  constructor(private phastService: PhastService, private auxiliaryPowerLossesService: AuxiliaryPowerLossesService, private auxiliaryPowerCompareService: AuxiliaryPowerCompareService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.firstChange) {
      if (changes.addLossToggle) {
        this.addLoss();
      }
    }
    else {
      this.firstChange = false;
    }
  }

  ngOnInit() {
    if (this.settings.energyResultUnit != 'kWh') {
      this.resultsUnit = this.settings.energyResultUnit + '/hr';
    } else {
      this.resultsUnit = 'kW';
    }
    if (!this._auxiliaryPowerLosses) {
      this._auxiliaryPowerLosses = new Array();
    }
    if (this.losses.auxiliaryPowerLosses) {
      this.setCompareVals();
      this.auxiliaryPowerCompareService.initCompareObjects();
      let lossIndex = 1;
      this.losses.auxiliaryPowerLosses.forEach(loss => {
        let tmpLoss = {
          form: this.auxiliaryPowerLossesService.getFormFromLoss(loss),
          powerUsed: loss.powerUsed || 0.0,
          collapse: false
        };
        if (!tmpLoss.form.controls.name.value) {
          tmpLoss.form.patchValue({
            name: 'Loss #' + lossIndex
          })
        }
        lossIndex++;
        this.calculate(tmpLoss);
        this._auxiliaryPowerLosses.push(tmpLoss);
      })
    }
    if (this.inSetup && this.modExists) {
      this.disableForms();
      this.lossesLocked = true;
    }
  }

  ngOnDestroy() {
    if (this.isBaseline) {
      this.auxiliaryPowerCompareService.baselineAuxLosses = null;
    } else {
      this.auxiliaryPowerCompareService.modifiedAuxLosses = null;
    }
  }
  disableForms() {
    this._auxiliaryPowerLosses.forEach(loss => {
      loss.form.disable();
    })
  }
  addLoss() {
    this._auxiliaryPowerLosses.push({
      form: this.auxiliaryPowerLossesService.initForm(this._auxiliaryPowerLosses.length + 1),
      powerUsed: 0.0,
      collapse: false
    });
    this.saveLosses();
  }

  removeLoss(lossIndex: number) {
    this._auxiliaryPowerLosses.splice(lossIndex, 1);
    this.saveLosses();
  }

  calculate(loss: AuxPowLossObj) {
    if (loss.form.status == 'VALID') {
      let tmpLoss: AuxiliaryPowerLoss = this.auxiliaryPowerLossesService.getLossFromForm(loss.form);
      loss.powerUsed = this.phastService.auxiliaryPowerLoss(tmpLoss);
    } else {
      loss.powerUsed = null;
    }
  }

  saveLosses() {
    let tmpAuxLosses = new Array<AuxiliaryPowerLoss>();
    let lossIndex = 1;
    this._auxiliaryPowerLosses.forEach(loss => {
      if (!loss.form.controls.name.value) {
        loss.form.patchValue({
          name: 'Loss #' + lossIndex
        })
      }
      lossIndex++;
      let tmpAuxLoss = this.auxiliaryPowerLossesService.getLossFromForm(loss.form);
      tmpAuxLoss.powerUsed = loss.powerUsed;
      tmpAuxLosses.push(tmpAuxLoss);
    })
    this.losses.auxiliaryPowerLosses = tmpAuxLosses;
    this.setCompareVals();
    this.savedLoss.emit(true);
  }

  collapseLoss(loss: AuxPowLossObj) {
    loss.collapse = !loss.collapse;
  }

  changeField(str: string) {
    this.fieldChange.emit(str);
  }

  focusOut() {
    this.fieldChange.emit('default');
  }

  setCompareVals() {
    if (this.isBaseline) {
      this.auxiliaryPowerCompareService.baselineAuxLosses = this.losses.auxiliaryPowerLosses;
    } else {
      this.auxiliaryPowerCompareService.modifiedAuxLosses = this.losses.auxiliaryPowerLosses;
    }
    if (this.auxiliaryPowerCompareService.differentArray && !this.isBaseline) {
      if (this.auxiliaryPowerCompareService.differentArray.length != 0) {
        this.auxiliaryPowerCompareService.checkAuxLosses();
      }
    }
  }

  setInputError(bool: boolean){
    this.inputError = bool;
  }

}

export interface AuxPowLossObj {
  form: FormGroup,
  powerUsed: number,
  collapse: boolean
}