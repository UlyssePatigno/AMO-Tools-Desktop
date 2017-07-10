import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { FlueGasLossesService } from './flue-gas-losses.service';
import { PhastService } from '../../phast.service';
import { FlueGas } from '../../../shared/models/phast/losses/flueGas';
import { Losses } from '../../../shared/models/phast/phast';
import { FlueGasCompareService } from './flue-gas-compare.service';
@Component({
  selector: 'app-flue-gas-losses',
  templateUrl: './flue-gas-losses.component.html',
  styleUrls: ['./flue-gas-losses.component.css']
})
export class FlueGasLossesComponent implements OnInit {
  @Input()
  losses: Losses;
  @Input()
  saveClicked: boolean;
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

  _flueGasLosses: Array<any>;
  firstChange: boolean = true;

  constructor(private phastService: PhastService, private flueGasLossesService: FlueGasLossesService, private flueGasCompareService: FlueGasCompareService) { }

  ngOnInit() {
    if (!this._flueGasLosses) {
      this._flueGasLosses = new Array();
    }
    if (this.losses.flueGasLosses) {
      this.setCompareVals();
      this.flueGasCompareService.initCompareObjects();
      this.initFlueGasses()
    }

    this.flueGasLossesService.deleteLossIndex.subscribe((lossIndex) => {
      if (lossIndex != undefined) {
        if (this.losses.flueGasLosses) {
          this._flueGasLosses.splice(lossIndex, 1);
          if (this.flueGasCompareService.differentArray && !this.isBaseline) {
            this.flueGasCompareService.differentArray.splice(lossIndex, 1);
          }
        }
      }
    })
    if (this.isBaseline) {
      this.flueGasLossesService.addLossBaselineMonitor.subscribe((val) => {
        if (val == true) {
          this._flueGasLosses.push({
            measurementType: 'By Volume',
            formByVolume: this.flueGasLossesService.initFormVolume(),
            formByMass: this.flueGasLossesService.initFormMass(),
            name: 'Loss #' + (this._flueGasLosses.length + 1),
            heatLoss: 0.0
          })
        }
      })
    } else {
      this.flueGasLossesService.addLossModificationMonitor.subscribe((val) => {
        if (val == true) {
          this._flueGasLosses.push({
            measurementType: 'By Volume',
            formByVolume: this.flueGasLossesService.initFormVolume(),
            formByMass: this.flueGasLossesService.initFormMass(),
            name: 'Loss #' + (this._flueGasLosses.length + 1),
            heatLoss: 0.0
          })
        }
      })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.firstChange) {
      if (changes.saveClicked) {
        this.saveLosses();
      }
      if (changes.addLossToggle) {
        this.addLoss();
      }
    }
    else {
      this.firstChange = false;
    }
  }

  ngOnDestroy() {
    this.flueGasCompareService.baselineFlueGasLoss = null;
    this.flueGasCompareService.modifiedFlueGasLoss = null;
    this.flueGasLossesService.deleteLossIndex.next(null);
    this.flueGasLossesService.addLossBaselineMonitor.next(false);
    this.flueGasLossesService.addLossModificationMonitor.next(false);
  }

  initFlueGasses() {
    this.losses.flueGasLosses.forEach(loss => {
      if (loss.flueGasType == "By Volume") {
        let tmpLoss = {
          measurementType: 'By Volume',
          formByVolume: this.flueGasLossesService.initByVolumeFormFromLoss(loss),
          formByMass: this.flueGasLossesService.initFormMass(),
          name: 'Loss #' + (this._flueGasLosses.length + 1),
          heatLoss: 0.0
        }
        this.calculate(tmpLoss);
        this._flueGasLosses.push(tmpLoss);
      } else if (loss.flueGasType == "By Mass") {
        let tmpLoss = {
          measurementType: 'By Mass',
          formByVolume: this.flueGasLossesService.initFormVolume(),
          formByMass: this.flueGasLossesService.initByMassFormFromLoss(loss),
          name: 'Loss #' + (this._flueGasLosses.length + 1),
          heatLoss: 0.0
        }
        this.calculate(tmpLoss);
        this._flueGasLosses.push(tmpLoss);
      }
    })
  }

  addLoss() {
    this.flueGasLossesService.addLoss(this.isBaseline);
    if (this.flueGasCompareService.differentArray) {
      this.flueGasCompareService.addObject(this.flueGasCompareService.differentArray.length - 1);
    }
    this._flueGasLosses.push({
      measurementType: 'By Volume',
      formByVolume: this.flueGasLossesService.initFormVolume(),
      formByMass: this.flueGasLossesService.initFormMass(),
      name: 'Loss #' + (this._flueGasLosses.length + 1),
      heatLoss: 0.0
    });
  }

  removeLoss(lossIndex: number) {
    this.flueGasLossesService.setDelete(lossIndex);
  }

  renameLoss() {
    let index = 1;
    this._flueGasLosses.forEach(loss => {
      loss.name = 'Loss #' + index;
      index++;
    })
  }

  calculate(loss: any) {
    //TODO: ADD call to phastService to calculate heat loss
    if (loss.measurementType == "By Volume") {
      loss.heatLoss = this.phastService.flueGasByVolume(
        loss.formByVolume.value.flueGasTemperature,
        loss.formByVolume.value.excessAirPercentage,
        loss.formByVolume.value.combustionAirTemperature,
        loss.formByVolume.value.CH4,
        loss.formByVolume.value.C2H6,
        loss.formByVolume.value.N2,
        loss.formByVolume.value.H2,
        loss.formByVolume.value.C3H8,
        loss.formByVolume.value.C4H10_CnH2n,
        loss.formByVolume.value.H2O,
        loss.formByVolume.value.CO,
        loss.formByVolume.value.CO2,
        loss.formByVolume.value.SO2,
        loss.formByVolume.value.O2
      );
    } else if (loss.measurementType == "By Mass") {
      loss.heatLoss = this.phastService.flueGasByMass(
        loss.formByMass.value.flueGasTemperature,
        loss.formByMass.value.excessAirPercentage,
        loss.formByMass.value.combustionAirTemperature,
        loss.formByMass.value.fuelTemperature,
        loss.formByMass.value.ashDischargeTemperature,
        loss.formByMass.value.moistureInAirComposition,
        loss.formByMass.value.unburnedCarbonInAsh,
        loss.formByMass.value.carbon,
        loss.formByMass.value.hydrogen,
        loss.formByMass.value.sulphur,
        loss.formByMass.value.inertAsh,
        loss.formByMass.value.o2,
        loss.formByMass.value.moisture,
        loss.formByMass.value.nitrogen
      )
    }
  }

  saveLosses() {
    let tmpFlueGasLosses = new Array<FlueGas>();
    this._flueGasLosses.forEach(loss => {
      if (loss.measurementType == "By Volume") {
        let tmpVolumeLoss = this.flueGasLossesService.buildByVolumeLossFromForm(loss.formByVolume);
        tmpFlueGasLosses.push(tmpVolumeLoss);
      }
      else if (loss.measurementType == "By Mass") {
        let tmpVolumeLoss = this.flueGasLossesService.buildByMassLossFromForm(loss.formByMass);
        tmpFlueGasLosses.push(tmpVolumeLoss);
      }
    })
    this.losses.flueGasLosses = tmpFlueGasLosses;
    this.setCompareVals();
    this.savedLoss.emit(true);
  }

  changeField(str: string) {
    this.fieldChange.emit(str);
  }

  setCompareVals() {
    if (this.isBaseline) {
      this.flueGasCompareService.baselineFlueGasLoss = this.losses.flueGasLosses;
    } else {
      this.flueGasCompareService.modifiedFlueGasLoss = this.losses.flueGasLosses;
    }
    if (this.flueGasCompareService.differentArray && !this.isBaseline) {
      if (this.flueGasCompareService.differentArray.length != 0) {
        this.flueGasCompareService.checkFlueGasLosses();
      }
    }
  }
}

