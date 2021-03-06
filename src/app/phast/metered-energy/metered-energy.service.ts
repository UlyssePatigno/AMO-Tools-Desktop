import { Injectable } from '@angular/core';
import { MeteredEnergyResults, MeteredEnergyElectricity, MeteredEnergyFuel, MeteredEnergySteam, MeteredEnergy } from '../../shared/models/phast/meteredEnergy';
import { PhastService } from '../phast.service';
import { PHAST } from '../../shared/models/phast/phast';
import { Settings } from '../../shared/models/settings';
import { ConvertUnitsService } from '../../shared/convert-units/convert-units.service';
import { PhastResultsService } from '../phast-results.service';
import { AuxEquipmentService } from '../aux-equipment/aux-equipment.service';
@Injectable()
export class MeteredEnergyService {

  constructor(private phastService: PhastService, private phastResultsService: PhastResultsService, private convertUnitsService: ConvertUnitsService, private auxEquipmentService: AuxEquipmentService) { }

  // meteredElectricity(input: MeteredEnergyElectricity, phast: PHAST, settings: Settings): MeteredEnergyResults {
  //   //Metered Energy Use
  //   //meteredEnergyUsed = Electricity Used during collection / Collection Time
  //   let meteredEnergyUsed = this.calcElectricityUsed(input);
  //   //Energy Intensity for Charge Material = meteredEnergyUsed / sum(charge material feed rates)
  //   let sumFeedRate = 0;
  //   if (phast.losses) {
  //     sumFeedRate = this.phastService.sumChargeMaterialFeedRate(phast.losses.chargeMaterials);
  //   }

  //   let meteredEnergyIntensity = (meteredEnergyUsed / sumFeedRate) || 0;
  //   //Electricity Used (Auxiliary) = Electricity used during collection (aux) / collection time (aux)
  //   let meteredElectricityUsed = (input.auxElectricityUsed / input.auxElectricityCollectionTime) || 0;

  //   meteredEnergyUsed = this.convertResult(meteredEnergyUsed, settings);
  //   meteredEnergyIntensity = this.convertIntensity(meteredEnergyIntensity, settings);
  //   //Calculated by PHAST
  //   let calculated = this.phastResultsService.calculatedByPhast(phast, settings);

  //   let tmpResults: MeteredEnergyResults = {
  //     meteredEnergyUsed: meteredEnergyUsed,
  //     meteredEnergyIntensity: meteredEnergyIntensity,
  //     meteredElectricityUsed: meteredElectricityUsed,
  //     calculatedFuelEnergyUsed: calculated.fuelEnergyUsed,
  //     calculatedEnergyIntensity: calculated.energyIntensity,
  //     calculatedElectricityUsed: calculated.electricityUsed
  //   }
  //   // if (fuelInput) {
  //   //   let fuelResults: MeteredEnergyResults = this.meteredFuel(fuelInput, phast, settings);
  //   //   if (settings.unitsOfMeasure == 'Metric') {
  //   //     fuelResults.meteredEnergyUsed = this.convertUnitsService.value(fuelResults.meteredEnergyUsed).from('GJ').to('kWh');
  //   //     fuelResults.meteredEnergyIntensity = this.convertUnitsService.value(fuelResults.meteredEnergyIntensity).from('GJ').to('kWh');
  //   //   } else {
  //   //     fuelResults.meteredEnergyUsed = this.convertUnitsService.value(fuelResults.meteredEnergyUsed).from('MMBtu').to('kWh');
  //   //     fuelResults.meteredEnergyIntensity = this.convertUnitsService.value(fuelResults.meteredEnergyIntensity).from('MMBtu').to('kWh');
  //   //   }
  //   //   tmpResults.meteredEnergyUsed += fuelResults.meteredEnergyUsed;
  //   //   tmpResults.meteredEnergyIntensity += fuelResults.meteredEnergyIntensity;
  //   //   tmpResults.meteredElectricityUsed += fuelResults.meteredElectricityUsed;
  //   // }
  //   return tmpResults;
  // }

  //  convertIntensity(num: number, settings: Settings): number {
  //    if (settings.energyResultUnit == 'MMBtu') {
  //      num = this.convertUnitsService.value(num).from('MMBtu').to('Btu');
  //    } else if (settings.energyResultUnit == 'GJ') {
  //      num = this.convertUnitsService.value(num).from('GJ').to('kJ');
  //    }
  //    return num;
  //  }


  // calcElectricityUsed(input: MeteredEnergyElectricity): number {
  //   return (input.electricityUsed / input.electricityCollectionTime) || 0;
  // }

  // meteredFuel(inputs: MeteredEnergyFuel, phast: PHAST, settings: Settings): MeteredEnergyResults {
  //   //Metered Energy Use
  //   //Metered Fuel Used = HHV * Flow Rate (if flow rate given)
  //   let meteredEnergyUsed = this.calcFuelUsed(inputs);
  //   //Energy Intensity for Charge Materials =  Metered Energy Used / Sum(charge material feed rates)
  //   let sumFeedRate = 0;
  //   if (phast.losses) {
  //     sumFeedRate = this.phastService.sumChargeMaterialFeedRate(phast.losses.chargeMaterials);
  //   }
  //   let meteredEnergyIntensity = (meteredEnergyUsed / sumFeedRate) || 0;
  //   //Electricity Used (Auxiliary) = Electricity used during collection / collection time
  //   let meteredElectricityUsed = (inputs.electricityUsed / inputs.electricityCollectionTime) || 0;

  //   meteredEnergyUsed = this.convertResult(meteredEnergyUsed, settings);
  //   meteredEnergyIntensity = this.convertIntensity(meteredEnergyIntensity, settings);

  //   //Calculated By PHAST
  //   let calculated = this.phastResultsService.calculatedByPhast(phast, settings);

  //   let tmpResults: MeteredEnergyResults = {
  //     meteredEnergyUsed: meteredEnergyUsed,
  //     meteredEnergyIntensity: meteredEnergyIntensity,
  //     meteredElectricityUsed: meteredElectricityUsed,
  //     calculatedFuelEnergyUsed: calculated.fuelEnergyUsed,
  //     calculatedEnergyIntensity: calculated.energyIntensity,
  //     calculatedElectricityUsed: calculated.electricityUsed
  //   }
  //   return tmpResults;
  // }

  // calcFuelUsed(inputs: MeteredEnergyFuel): number {
  //   return (inputs.fuelEnergy / inputs.collectionTime) || 0;
  // }

  // meteredSteam(inputs: MeteredEnergySteam, phast: PHAST, settings: Settings): MeteredEnergyResults {
  //   //Metered Energy Use
  //   //Metered Fuel Used = HHV * Flow Rate
  //   let meteredEnergyUsed = this.calcSteamEnergyUsed(inputs);
  //   //Energy Intensity for Charge Materials =  Metered Energy Used / Sum(charge material feed rates)
  //   let sumFeedRate = 0;
  //   if (phast.losses) {
  //     sumFeedRate = this.phastService.sumChargeMaterialFeedRate(phast.losses.chargeMaterials);
  //   }
  //   let meteredEnergyIntensity = (meteredEnergyUsed / sumFeedRate) || 0;
  //   //Electricity Used (Auxiliary) = Electricity used during collection / collection time
  //   let meteredElectricityUsed = (inputs.electricityUsed / inputs.electricityCollectionTime) || 0;
  //   meteredEnergyUsed = this.convertSteamEnergyUsed(meteredEnergyUsed, settings);
  //   // meteredEnergyIntensity = this.convertSteamEnergyUsed(meteredEnergyIntensity, settings);
  //   //Calculated By PHAST
  //   let calculated = this.phastResultsService.calculatedByPhast(phast, settings);

  //   let tmpResults: MeteredEnergyResults = {
  //     meteredEnergyUsed: meteredEnergyUsed,
  //     meteredEnergyIntensity: meteredEnergyIntensity,
  //     meteredElectricityUsed: meteredElectricityUsed,
  //     calculatedFuelEnergyUsed: calculated.fuelEnergyUsed,
  //     calculatedEnergyIntensity: calculated.energyIntensity,
  //     calculatedElectricityUsed: calculated.electricityUsed
  //   }
  //   return tmpResults;
  // }

  // calcSteamEnergyUsed(inputs: MeteredEnergySteam): number {
  //   return (inputs.totalHeatSteam * inputs.flowRate / inputs.collectionTime) || 0;
  // }
  // convertResult(val: number, settings: Settings): number {
  //   if (settings.energySourceType == 'Electricity') {
  //     val = this.convertUnitsService.value(val).from('kWh').to(settings.energyResultUnit)
  //   } else if (settings.unitsOfMeasure == 'Metric') {
  //     val = this.convertUnitsService.value(val).from('GJ').to(settings.energyResultUnit);
  //   } else {
  //     val = this.convertUnitsService.value(val).from('MMBtu').to(settings.energyResultUnit);
  //   }
  //   return val;
  // }

  //  convertSteamEnergyUsed(val: number, settings: Settings) {
  //    if (settings.unitsOfMeasure == 'Metric') {
  //      val = this.convertUnitsService.value(val).from('kJ').to(settings.energyResultUnit);
  //    } else {
  //      val = this.convertUnitsService.value(val).from('Btu').to(settings.energyResultUnit);
  //    }
  //    return val;
  //  }

  //UPDATES 6/11/2018
  ////////////////////////////////////
  calculateMeteredEnergy(phast: PHAST, settings: Settings): MeteredEnergyResults {
    let results: MeteredEnergyResults = {
      meteredEnergyUsed: 0,
      meteredEnergyIntensity: 0,
      meteredElectricityUsed: 0,
      calculatedFuelEnergyUsed: 0,
      calculatedEnergyIntensity: 0,
      calculatedElectricityUsed: 0
    };
    let steamEnergyUsed: number = 0;
    let fuelEnergyUsed: number = 0;
    let electricityEnergyUsed: number = 0;
    if (phast.meteredEnergy.steam) {
      steamEnergyUsed = this.calcSteamEnergyUsed(phast.meteredEnergy.meteredEnergySteam)
      steamEnergyUsed = this.convertSteamEnergyUsed(steamEnergyUsed, settings);
    }
    if (phast.meteredEnergy.electricity) {
      electricityEnergyUsed = this.calcElectricEnergyUsed(phast.meteredEnergy.meteredEnergyElectricity);
      electricityEnergyUsed = this.convertUnitsService.value(electricityEnergyUsed).from('kWh').to(settings.energyResultUnit);
    }
    if (phast.meteredEnergy.fuel) {
      fuelEnergyUsed = this.calcFuelEnergyUsed(phast.meteredEnergy.meteredEnergyFuel);
      fuelEnergyUsed = this.convertFuelEnergyUsed(fuelEnergyUsed, settings);
    }

    let sumFeedRate = 0;
    if (phast.losses) {
      sumFeedRate = this.phastService.sumChargeMaterialFeedRate(phast.losses.chargeMaterials);
    }

    results.meteredEnergyUsed = steamEnergyUsed + fuelEnergyUsed + electricityEnergyUsed;
    results.meteredEnergyIntensity = this.convertIntensity((results.meteredEnergyUsed / sumFeedRate), settings);
    let auxResults: Array<{ name: string, totalPower: number, motorPower: string }> = this.auxEquipmentService.calculate(phast);
    results.meteredElectricityUsed = this.auxEquipmentService.getResultsSum(auxResults);
    let calculated = this.phastResultsService.calculatedByPhast(phast, settings);
    results.calculatedElectricityUsed = calculated.electricityUsed;
    results.calculatedEnergyIntensity = calculated.energyIntensity;
    results.calculatedFuelEnergyUsed = calculated.fuelEnergyUsed;
    return results;
  }


  calcElectricEnergyUsed(inputs: MeteredEnergyElectricity): number {
    return inputs.electricityUsed / inputs.electricityCollectionTime;
  }

  calcSteamEnergyUsed(inputs: MeteredEnergySteam): number {
    return (inputs.totalHeatSteam * inputs.flowRate / inputs.collectionTime);
  }

  calcFuelEnergyUsed(inputs: MeteredEnergyFuel): number {
    return (inputs.fuelEnergy / inputs.collectionTime)
  }

  convertSteamEnergyUsed(val: number, settings: Settings) {
    if (settings.unitsOfMeasure == 'Metric') {
      val = this.convertUnitsService.value(val).from('kJ').to(settings.energyResultUnit);
    } else {
      val = this.convertUnitsService.value(val).from('Btu').to(settings.energyResultUnit);
    }
    return val;
  }

  convertFuelEnergyUsed(val: number, settings: Settings): number {
    if (settings.unitsOfMeasure == 'Metric') {
      val = this.convertUnitsService.value(val).from('GJ').to(settings.energyResultUnit);
    } else {
      val = this.convertUnitsService.value(val).from('MMBtu').to(settings.energyResultUnit);
    }
    return val;
  }

  convertIntensity(num: number, settings: Settings): number {
    if (settings.energyResultUnit == 'MMBtu') {
      num = this.convertUnitsService.value(num).from('MMBtu').to('Btu');
    } else if (settings.energyResultUnit == 'GJ') {
      num = this.convertUnitsService.value(num).from('GJ').to('kJ');
    }
    return num;
  }
}
