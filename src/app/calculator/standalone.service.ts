import { Injectable } from '@angular/core';
declare var standaloneAddon: any;
import { CombinedHeatPower, CombinedHeatPowerOutput } from '../shared/models/combinedHeatPower';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class StandaloneService {


  pumpTab: BehaviorSubject<string>;
  furnaceTab: BehaviorSubject<string>;
  utilitiesTab: BehaviorSubject<string>;
  motorTab: BehaviorSubject<string>;

  constructor() { 
    this.pumpTab = new BehaviorSubject<string>('none')
    this.furnaceTab = new BehaviorSubject<string>('none')
    this.utilitiesTab = new BehaviorSubject<string>('none')
    this.motorTab = new BehaviorSubject<string>('none')
  }
  test(){
    console.log(standaloneAddon)
  }


  CHPcalculator(inputs: CombinedHeatPower): CombinedHeatPowerOutput{
    return standaloneAddon.CHPcalculator(inputs);
  }
}
