import { Injectable } from '@angular/core';
import { SaturatedPropertiesInput, SaturatedPropertiesOutput, SteamPropertiesInput, SteamPropertiesOutput, BoilerInput, BoilerOutput, DeaeratorInput, DeaeratorOutput, FlashTankInput, FlashTankOutput, HeaderInput, HeaderOutput, HeatLossInput, HeatLossOutput, TurbineInput, TurbineOutput, PrvInput, PrvOutput, HeaderOutputObj } from "../../shared/models/steam";
import { ConvertUnitsService } from "../../shared/convert-units/convert-units.service";
import { Settings } from "../../shared/models/settings";

declare var steamAddon: any;

@Injectable()
export class SteamService {


  constructor(private convertUnitsService: ConvertUnitsService) { }

  test() {
    console.log(steamAddon);
  }

  getQuantityRange(settings: Settings, thermodynamicQuantity: number): { min: number, max: number } {
    let _min: number = 0;
    let _max: number = 1;
    //temp
    if (thermodynamicQuantity == 0) {
      _min = Number(this.convertUnitsService.value(32).from('F').to(settings.steamTemperatureMeasurement).toFixed(0));
      _max = Number(this.convertUnitsService.value(1472).from('F').to(settings.steamTemperatureMeasurement).toFixed(0));
    }
    //enthalpy
    else if (thermodynamicQuantity == 1) {
      _min = Number(this.convertUnitsService.value(50).from('kJkg').to(settings.steamSpecificEnthalpyMeasurement).toFixed(0));
      _max = Number(this.convertUnitsService.value(3700).from('kJkg').to(settings.steamSpecificEnthalpyMeasurement).toFixed(0));
    }
    //entropy
    else if (thermodynamicQuantity == 2) {
      _min = Number(this.convertUnitsService.value(0).from('kJkgK').to(settings.steamSpecificEntropyMeasurement).toFixed(0));
      _max = Number(this.convertUnitsService.value(6.52).from('kJkgK').to(settings.steamSpecificEntropyMeasurement).toFixed(0));
    }
    return { min: _min, max: _max };
  }

  convertSteamPropertiesQuantityValue(steamPropertiesInput: SteamPropertiesInput, settings: Settings, forInput: boolean, output?: SteamPropertiesOutput) {
    if (forInput === true) {
      if (steamPropertiesInput.thermodynamicQuantity === 0) { // convert temperature to kelvin
        return this.convertUnitsService.value(steamPropertiesInput.quantityValue).from(settings.steamTemperatureMeasurement).to('C') + 273.15;
      } else if (steamPropertiesInput.thermodynamicQuantity === 1) { // convert specific Enthalpy
        return this.convertUnitsService.value(steamPropertiesInput.quantityValue).from(settings.steamSpecificEnthalpyMeasurement).to('kJkg');
      } else if (steamPropertiesInput.thermodynamicQuantity === 2) { // convert specific Entropy
        return this.convertUnitsService.value(steamPropertiesInput.quantityValue).from(settings.steamSpecificEntropyMeasurement).to('kJkgK');
      } else {
        return steamPropertiesInput.quantityValue;
      }
    }
    else {
      if (steamPropertiesInput.thermodynamicQuantity === 0) { // convert temperature back to original user-chosen unit
        output.temperature = this.convertUnitsService.value(steamPropertiesInput.quantityValue - 273.15).from('C').to(settings.steamTemperatureMeasurement);
        output.specificEntropy = this.convertUnitsService.value(output.specificEntropy).from('kJkgK').to(settings.steamSpecificEntropyMeasurement);
        output.specificEnthalpy = this.convertUnitsService.value(output.specificEnthalpy).from('kJkg').to(settings.steamSpecificEnthalpyMeasurement);
      } else if (steamPropertiesInput.thermodynamicQuantity === 1) { // convert specific Enthalpy
        output.specificEnthalpy = this.convertUnitsService.value(steamPropertiesInput.quantityValue).from('kJkg').to(settings.steamSpecificEnthalpyMeasurement);
        output.specificEntropy = this.convertUnitsService.value(output.specificEntropy).from('kJkgK').to(settings.steamSpecificEntropyMeasurement);
        output.temperature = this.convertUnitsService.value(output.temperature - 273.15).from('C').to(settings.steamTemperatureMeasurement);
      } else if (steamPropertiesInput.thermodynamicQuantity === 2) {
        output.specificEntropy = this.convertUnitsService.value(steamPropertiesInput.quantityValue).from('kJkgK').to(settings.steamSpecificEntropyMeasurement);
        output.temperature = this.convertUnitsService.value(output.temperature - 273.15).from('C').to(settings.steamTemperatureMeasurement);
        output.specificEnthalpy = this.convertUnitsService.value(output.specificEnthalpy).from('kJkg').to(settings.steamSpecificEnthalpyMeasurement);
      } else {
        output.temperature = this.convertUnitsService.value(output.temperature - 273.15).from('C').to(settings.steamTemperatureMeasurement);
      }
    }
  }

  steamProperties(steamPropertiesInput: SteamPropertiesInput, settings: Settings): SteamPropertiesOutput {
    let input: SteamPropertiesInput = steamPropertiesInput;
    input.pressure = this.convertUnitsService.value(input.pressure).from(settings.steamPressureMeasurement).to('MPa');
    input.quantityValue = this.convertSteamPropertiesQuantityValue(input, settings, true);

    let output: SteamPropertiesOutput = steamAddon.steamProperties(steamPropertiesInput);
    output.pressure = this.convertUnitsService.value(output.pressure).from('MPa').to(settings.steamPressureMeasurement);
    output.specificVolume = this.convertUnitsService.value(output.specificVolume).from('m3kg').to(settings.steamSpecificVolumeMeasurement);
    this.convertSteamPropertiesQuantityValue(input, settings, false, output);
    return output;
  }

  saturatedProperties(saturatedPropertiesInput: SaturatedPropertiesInput, pressureOrTemperature: number, settings: Settings): SaturatedPropertiesOutput {
    let input = saturatedPropertiesInput;
    let output: SaturatedPropertiesOutput;

    if (pressureOrTemperature === 0) {
      input.saturatedPressure = this.convertUnitsService.value(input.saturatedPressure).from(settings.steamPressureMeasurement).to('MPa');
      output = steamAddon.saturatedPropertiesGivenPressure(input);
    } else {
      input.saturatedTemperature = this.convertUnitsService.value(input.saturatedTemperature).from(settings.steamTemperatureMeasurement).to('C') + 273.15;
      output = steamAddon.saturatedPropertiesGivenTemperature(input);
    }

    output.gasEntropy = this.convertUnitsService.value(output.gasEntropy).from('kJkgK').to(settings.steamSpecificEntropyMeasurement);
    output.liquidEntropy = this.convertUnitsService.value(output.liquidEntropy).from('kJkgK').to(settings.steamSpecificEntropyMeasurement);

    output.saturatedPressure = this.convertUnitsService.value(output.saturatedPressure).from('MPa').to(settings.steamPressureMeasurement);
    output.saturatedTemperature = this.convertUnitsService.value(output.saturatedTemperature - 273.15).from('C').to(settings.steamTemperatureMeasurement);

    output.evaporationVolume = this.convertUnitsService.value(output.evaporationVolume).from('m3kg').to(settings.steamSpecificVolumeMeasurement);
    output.gasVolume = this.convertUnitsService.value(output.gasVolume).from('m3kg').to(settings.steamSpecificVolumeMeasurement);
    output.liquidVolume = this.convertUnitsService.value(output.liquidVolume).from('m3kg').to(settings.steamSpecificVolumeMeasurement);

    return output;
  }

  //ENTROPY
  convertSteamSpecificEntropyOutput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from('kJkgK').to(settings.steamSpecificEntropyMeasurement);
  }
  convertSteamSpecificEntropyInput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from(settings.steamSpecificEntropyMeasurement).to('kJkgK');
  }
  //ENTHALPY
  convertSteamSpecificEnthalpyOutput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from('kJkg').to(settings.steamSpecificEnthalpyMeasurement);
  }
  convertSteamSpecificEnthalpyInput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from(settings.steamSpecificEnthalpyMeasurement).to('kJkg');
  }
  //PRESSURE
  convertSteamPressureInput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from(settings.steamPressureMeasurement).to('MPa');
  }
  convertSteamPressureOutput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from('MPa').to(settings.steamPressureMeasurement);
  }
  //TEMPERATURE
  convertSteamTemperatureInput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from(settings.steamTemperatureMeasurement).to('C') + 273.15;
  }
  convertSteamTemperatureOutput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val - 273.15).from('C').to(settings.steamTemperatureMeasurement);
  }
  //SPECIFIC VOLUME
  convertSteamSpecificVolumeMeasurementInput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from(settings.steamSpecificVolumeMeasurement).to('m3kg');
  }
  convertSteamSpecificVolumeMeasurementOutput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from('m3kg').to(settings.steamSpecificVolumeMeasurement);
  }
  //MASS FLOW
  convertSteamMassFlowInput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from(settings.steamMassFlowMeasurement).to('kg');
  }
  convertSteamMassFlowOutput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from('kg').to(settings.steamMassFlowMeasurement);
  }
  //Energy
  convertEnergyFlowInput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from(settings.steamEnergyMeasurement).to('MJ')
  }
  convertEnergyFlowOutput(val: number, settings: Settings): number {
    return this.convertUnitsService.value(val).from('MJ').to(settings.steamEnergyMeasurement);
  }

  boiler(input: BoilerInput, settings: Settings): BoilerOutput {
    input.steamMassFlow = this.convertSteamMassFlowInput(input.steamMassFlow, settings);
    input.deaeratorPressure = this.convertSteamPressureInput(input.deaeratorPressure, settings);
    input.steamPressure = this.convertSteamPressureInput(input.steamPressure, settings);

    if (input.thermodynamicQuantity == 0) {
      input.quantityValue = this.convertSteamTemperatureInput(input.quantityValue, settings);
    } else if (input.thermodynamicQuantity == 1) {
      input.quantityValue = this.convertSteamSpecificEnthalpyInput(input.quantityValue, settings);
    } else if (input.thermodynamicQuantity == 2) {
      input.quantityValue = this.convertSteamSpecificEntropyInput(input.quantityValue, settings);
    }
    //send to suite
    let results: BoilerOutput = steamAddon.boiler(input);
    //Convert Output
    //pressure
    results.steamPressure = this.convertSteamPressureOutput(results.steamPressure, settings);
    results.blowdownPressure = this.convertSteamPressureOutput(results.blowdownPressure, settings);
    results.feedwaterPressure = this.convertSteamPressureOutput(results.feedwaterPressure, settings);
    //temp
    results.steamTemperature = this.convertSteamTemperatureOutput(results.steamTemperature, settings);
    results.blowdownTemperature = this.convertSteamTemperatureOutput(results.blowdownTemperature, settings);
    results.feedwaterTemperature = this.convertSteamTemperatureOutput(results.feedwaterTemperature, settings);
    //enthalpy
    results.steamSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.steamSpecificEnthalpy, settings);
    results.blowdownSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.blowdownSpecificEnthalpy, settings);
    results.feedwaterSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.feedwaterSpecificEnthalpy, settings);
    //entropy
    results.steamSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.steamSpecificEntropy, settings);
    results.blowdownSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.blowdownSpecificEntropy, settings);
    results.feedwaterSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.feedwaterSpecificEntropy, settings);
    //massFlow
    results.steamMassFlow = this.convertSteamMassFlowOutput(results.steamMassFlow, settings);
    results.blowdownMassFlow = this.convertSteamMassFlowOutput(results.blowdownMassFlow, settings);
    results.feedwaterMassFlow = this.convertSteamMassFlowOutput(results.feedwaterMassFlow, settings);
    //energy
    results.steamEnergyFlow = this.convertEnergyFlowOutput(results.steamEnergyFlow, settings);
    results.blowdownEnergyFlow = this.convertEnergyFlowOutput(results.blowdownEnergyFlow, settings);
    results.feedwaterEnergyFlow = this.convertEnergyFlowOutput(results.feedwaterEnergyFlow, settings);
    results.boilerEnergy = this.convertEnergyFlowOutput(results.boilerEnergy, settings);
    results.fuelEnergy = this.convertEnergyFlowOutput(results.fuelEnergy, settings);
    return results;
  }

  deaerator(input: DeaeratorInput, settings: Settings): DeaeratorOutput {
    //convert inputs
    input.deaeratorPressure = this.convertSteamPressureInput(input.deaeratorPressure, settings);
    input.waterPressure = this.convertSteamPressureInput(input.waterPressure, settings);
    input.steamPressure = this.convertSteamPressureInput(input.steamPressure, settings);
    input.feedwaterMassFlow = this.convertSteamMassFlowInput(input.feedwaterMassFlow, settings);
    if (input.waterThermodynamicQuantity == 0) {
      input.waterQuantityValue = this.convertSteamTemperatureInput(input.waterQuantityValue, settings);
    } else if (input.waterThermodynamicQuantity == 1) {
      input.waterQuantityValue = this.convertSteamSpecificEnthalpyInput(input.waterQuantityValue, settings);
    } else if (input.waterThermodynamicQuantity == 2) {
      input.waterQuantityValue = this.convertSteamSpecificEntropyInput(input.waterQuantityValue, settings);
    }
    if (input.steamThermodynamicQuantity == 0) {
      input.steamQuantityValue = this.convertSteamTemperatureInput(input.steamQuantityValue, settings);
    } else if (input.steamThermodynamicQuantity == 1) {
      input.steamQuantityValue = this.convertSteamSpecificEnthalpyInput(input.steamQuantityValue, settings);
    } else if (input.steamThermodynamicQuantity == 2) {
      input.steamQuantityValue = this.convertSteamSpecificEntropyInput(input.steamQuantityValue, settings);
    }

    //calc
    let results: DeaeratorOutput = steamAddon.deaerator(input);
    //convert outputs
    //energy flow
    results.feedwaterEnergyFlow = this.convertEnergyFlowOutput(results.feedwaterEnergyFlow, settings);
    results.inletSteamEnergyFlow = this.convertEnergyFlowOutput(results.inletSteamEnergyFlow, settings);
    results.inletWaterEnergyFlow = this.convertEnergyFlowOutput(results.inletWaterEnergyFlow, settings);
    results.ventedSteamEnergyFlow = this.convertEnergyFlowOutput(results.ventedSteamEnergyFlow, settings);
    //mass flow
    results.feedwaterMassFlow = this.convertSteamMassFlowOutput(results.feedwaterMassFlow, settings);
    results.inletSteamMassFlow = this.convertSteamMassFlowOutput(results.inletSteamMassFlow, settings);
    results.inletWaterMassFlow = this.convertSteamMassFlowOutput(results.inletWaterMassFlow, settings);
    results.ventedSteamMassFlow = this.convertSteamMassFlowOutput(results.ventedSteamMassFlow, settings);
    //pressure
    results.feedwaterPressure = this.convertSteamPressureOutput(results.feedwaterPressure, settings);
    results.inletSteamPressure = this.convertSteamPressureOutput(results.inletSteamPressure, settings);
    results.inletWaterPressure = this.convertSteamPressureOutput(results.inletWaterPressure, settings);
    results.ventedSteamPressure = this.convertSteamPressureOutput(results.ventedSteamPressure, settings);
    //specific enthalpy
    results.feedwaterSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.feedwaterSpecificEnthalpy, settings);
    results.inletSteamSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.inletSteamSpecificEnthalpy, settings);
    results.inletWaterSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.inletWaterSpecificEnthalpy, settings);
    results.ventedSteamSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.ventedSteamSpecificEnthalpy, settings);
    //specific entropy
    results.feedwaterSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.feedwaterSpecificEntropy, settings);
    results.inletSteamSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.inletSteamSpecificEntropy, settings);
    results.inletWaterSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.inletWaterSpecificEntropy, settings);
    results.ventedSteamSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.ventedSteamSpecificEntropy, settings);
    //feedwater temp
    results.feedwaterTemperature = this.convertSteamTemperatureOutput(results.feedwaterTemperature, settings);
    results.inletSteamTemperature = this.convertSteamTemperatureOutput(results.inletSteamTemperature, settings);
    results.inletWaterTemperature = this.convertSteamTemperatureOutput(results.inletWaterTemperature, settings);
    results.ventedSteamTemperature = this.convertSteamTemperatureOutput(results.ventedSteamTemperature, settings);
    return results;
  }

  flashTank(input: FlashTankInput, settings: Settings): FlashTankOutput {
    //convert inputs
    input.inletWaterPressure = this.convertSteamPressureInput(input.inletWaterPressure, settings);
    input.inletWaterMassFlow = this.convertSteamMassFlowInput(input.inletWaterMassFlow, settings);
    input.tankPressure = this.convertSteamPressureInput(input.tankPressure, settings);
    if (input.thermodynamicQuantity == 0) {
      input.quantityValue = this.convertSteamTemperatureInput(input.quantityValue, settings);
    } else if (input.thermodynamicQuantity == 1) {
      input.quantityValue = this.convertSteamSpecificEnthalpyInput(input.quantityValue, settings);
    } else if (input.thermodynamicQuantity == 2) {
      input.quantityValue = this.convertSteamSpecificEntropyInput(input.quantityValue, settings);
    }
    //get results w/ converted inputs
    let results: FlashTankOutput = steamAddon.flashTank(input);
    //convert outputs
    //flow
    results.inletWaterMassFlow = this.convertSteamMassFlowOutput(results.inletWaterMassFlow, settings);
    results.outletGasMassFlow = this.convertSteamMassFlowOutput(results.outletGasMassFlow, settings);
    results.outletLiquidMassFlow = this.convertSteamMassFlowOutput(results.outletLiquidMassFlow, settings);
    //pressure
    results.inletWaterPressure = this.convertSteamPressureOutput(results.inletWaterPressure, settings);
    results.outletGasPressure = this.convertSteamPressureOutput(results.outletGasPressure, settings);
    results.outletLiquidPressure = this.convertSteamPressureOutput(results.outletLiquidPressure, settings);
    //enthalpy
    results.inletWaterSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.inletWaterSpecificEnthalpy, settings);
    results.outletGasSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.outletGasSpecificEnthalpy, settings);
    results.outletLiquidSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.outletLiquidSpecificEnthalpy, settings);
    //entropy
    results.inletWaterSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.inletWaterSpecificEntropy, settings);
    results.outletGasSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.outletGasSpecificEntropy, settings);
    results.outletLiquidSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.outletLiquidSpecificEntropy, settings);
    //temp
    results.inletWaterTemperature = this.convertSteamTemperatureOutput(results.inletWaterTemperature, settings);
    results.outletGasTemperature = this.convertSteamTemperatureOutput(results.outletGasTemperature, settings);
    results.outletLiquidTemperature = this.convertSteamTemperatureOutput(results.outletLiquidTemperature, settings);
    return results;
  }

  header(input: HeaderInput, settings: Settings): HeaderOutput {
    //convertInputs
    input.headerPressure = this.convertSteamPressureInput(input.headerPressure, settings);
    input.inlets.forEach(inlet => {
      inlet.pressure = this.convertSteamPressureInput(inlet.pressure, settings);
      inlet.massFlow = this.convertSteamMassFlowInput(inlet.massFlow, settings);
      if (inlet.thermodynamicQuantity == 0) {
        inlet.quantityValue = this.convertSteamTemperatureInput(inlet.quantityValue, settings);
      } else if (inlet.thermodynamicQuantity == 1) {
        inlet.quantityValue = this.convertSteamSpecificEnthalpyInput(inlet.quantityValue, settings);
      } else if (inlet.thermodynamicQuantity == 2) {
        inlet.quantityValue = this.convertSteamSpecificEntropyInput(inlet.quantityValue, settings);
      }
    })
    let results: HeaderOutput = steamAddon.header(input);
    //converOutput
    for (var key in results) {
      results[key].energyFlow = this.convertEnergyFlowOutput(results[key].energyFlow, settings) / 1000000;
      results[key].massFlow = this.convertSteamMassFlowOutput(results[key].massFlow, settings);
      results[key].pressure = this.convertSteamPressureOutput(results[key].pressure, settings);
      results[key].specificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results[key].specificEnthalpy, settings);
      results[key].specificEntropy = this.convertSteamSpecificEntropyOutput(results[key].specificEntropy, settings);
      results[key].temperature = this.convertSteamTemperatureOutput(results[key].temperature, settings);
    }
    return results;
  }

  heatLoss(input: HeatLossInput, settings: Settings): HeatLossOutput {
    //convert inputs
    input.inletMassFlow = this.convertSteamMassFlowInput(input.inletMassFlow, settings);
    input.inletPressure = this.convertSteamPressureInput(input.inletPressure, settings);
    if (input.thermodynamicQuantity == 0) {
      input.quantityValue = this.convertSteamTemperatureInput(input.quantityValue, settings);
    } else if (input.thermodynamicQuantity == 1) {
      input.quantityValue = this.convertSteamSpecificEnthalpyInput(input.quantityValue, settings);
    } else if (input.thermodynamicQuantity == 2) {
      input.quantityValue = this.convertSteamSpecificEntropyInput(input.quantityValue, settings);
    }
    //get results
    let results: HeatLossOutput = steamAddon.heatLoss(input);
    //convert outputs
    //flow
    results.inletMassFlow = this.convertSteamMassFlowOutput(results.inletMassFlow, settings);
    results.outletMassFlow = this.convertSteamMassFlowOutput(results.outletMassFlow, settings);
    //pressure
    results.inletPressure = this.convertSteamPressureOutput(results.inletPressure, settings);
    results.outletPressure = this.convertSteamPressureOutput(results.outletPressure, settings);
    //enthalpy
    results.inletSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.inletSpecificEnthalpy, settings);
    results.outletSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.outletSpecificEnthalpy, settings);
    //entropy
    results.inletSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.inletSpecificEntropy, settings);
    results.outletSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.outletSpecificEntropy, settings);
    //temp
    results.inletTemperature = this.convertSteamTemperatureOutput(results.inletTemperature, settings);
    results.outletTemperature = this.convertSteamTemperatureOutput(results.outletTemperature, settings);
    //energy flow
    results.inletEnergyFlow = this.convertEnergyFlowOutput(results.inletEnergyFlow, settings);
    results.outletEnergyFlow = this.convertEnergyFlowOutput(results.outletEnergyFlow, settings);
    results.heatLoss = this.convertEnergyFlowOutput(results.heatLoss, settings);
    return results;

  }
  prvWithoutDesuperheating(input: PrvInput, settings: Settings): PrvOutput {
    //convert inputs
    input.inletPressure = this.convertSteamPressureInput(input.inletPressure, settings);
    input.inletMassFlow = this.convertSteamMassFlowInput(input.inletMassFlow, settings);
    input.outletPressure = this.convertSteamPressureInput(input.outletPressure, settings);
    if (input.thermodynamicQuantity == 0) {
      input.quantityValue = this.convertSteamTemperatureInput(input.quantityValue, settings);
    } else if (input.thermodynamicQuantity == 1) {
      input.quantityValue = this.convertSteamSpecificEnthalpyInput(input.quantityValue, settings);
    } else if (input.thermodynamicQuantity == 2) {
      input.quantityValue = this.convertSteamSpecificEntropyInput(input.quantityValue, settings);
    }
    //calc results
    let results: PrvOutput = steamAddon.prvWithoutDesuperheating(input);
    //convert results
    //flow
    results.inletMassFlow = this.convertSteamMassFlowOutput(results.inletMassFlow, settings);
    results.outletMassFlow = this.convertSteamMassFlowOutput(results.outletMassFlow, settings);
    //pressure
    results.inletPressure = this.convertSteamPressureOutput(results.inletPressure, settings);
    results.outletPressure = this.convertSteamPressureOutput(results.outletPressure, settings);
    //enthalpy
    results.inletSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.inletSpecificEnthalpy, settings);
    results.outletSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.outletSpecificEnthalpy, settings);
    //entropy
    results.inletSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.inletSpecificEntropy, settings);
    results.outletSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.outletSpecificEntropy, settings);
    //temp
    results.inletTemperature = this.convertSteamTemperatureOutput(results.inletTemperature, settings);
    results.outletTemperature = this.convertSteamTemperatureOutput(results.outletTemperature, settings);
    //energyFlow
    results.inletEnergyFlow = this.convertEnergyFlowOutput(results.inletEnergyFlow, settings);
    results.outletEnergyFlow = this.convertEnergyFlowOutput(results.outletEnergyFlow, settings);
    return results;
  }
  prvWithDesuperheating(input: PrvInput, settings: Settings): PrvOutput {
    //convert inputs
    input.inletPressure = this.convertSteamPressureInput(input.inletPressure, settings);
    input.inletMassFlow = this.convertSteamMassFlowInput(input.inletMassFlow, settings);
    input.outletPressure = this.convertSteamPressureInput(input.outletPressure, settings);
    input.feedwaterPressure = this.convertSteamPressureInput(input.feedwaterPressure, settings);
    input.desuperheatingTemp = this.convertSteamTemperatureInput(input.desuperheatingTemp, settings);
    if (input.thermodynamicQuantity == 0) {
      input.quantityValue = this.convertSteamTemperatureInput(input.quantityValue, settings);
    } else if (input.thermodynamicQuantity == 1) {
      input.quantityValue = this.convertSteamSpecificEnthalpyInput(input.quantityValue, settings);
    } else if (input.thermodynamicQuantity == 2) {
      input.quantityValue = this.convertSteamSpecificEntropyInput(input.quantityValue, settings);
    }
    if (input.feedwaterThermodynamicQuantity == 0) {
      input.feedwaterQuantityValue = this.convertSteamTemperatureInput(input.quantityValue, settings);
    } else if (input.feedwaterThermodynamicQuantity == 1) {
      input.feedwaterQuantityValue = this.convertSteamSpecificEnthalpyInput(input.quantityValue, settings);
    } else if (input.feedwaterThermodynamicQuantity == 2) {
      input.feedwaterQuantityValue = this.convertSteamSpecificEntropyInput(input.quantityValue, settings);
    }
    //calc results
    let results: PrvOutput = steamAddon.prvWithDesuperheating(input);
    //convert results
    //flow
    results.inletMassFlow = this.convertSteamMassFlowOutput(results.inletMassFlow, settings);
    results.outletMassFlow = this.convertSteamMassFlowOutput(results.outletMassFlow, settings);
    results.feedwaterMassFlow = this.convertSteamMassFlowOutput(results.feedwaterMassFlow, settings);
    //pressure
    results.inletPressure = this.convertSteamPressureOutput(results.inletPressure, settings);
    results.outletPressure = this.convertSteamPressureOutput(results.outletPressure, settings);
    results.feedwaterPressure = this.convertSteamPressureOutput(results.feedwaterPressure, settings);
    //enthalpy
    results.inletSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.inletSpecificEnthalpy, settings);
    results.outletSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.outletSpecificEnthalpy, settings);
    results.feedwaterSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.feedwaterSpecificEnthalpy, settings);
    //entropy
    results.inletSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.inletSpecificEntropy, settings);
    results.outletSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.outletSpecificEntropy, settings);
    results.feedwaterSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.feedwaterSpecificEntropy, settings);
    //temp
    results.inletTemperature = this.convertSteamTemperatureOutput(results.inletTemperature, settings);
    results.outletTemperature = this.convertSteamTemperatureOutput(results.outletTemperature, settings);
    results.feedwaterTemperature = this.convertSteamTemperatureOutput(results.feedwaterTemperature, settings);
    //energyFlow
    results.inletEnergyFlow = this.convertEnergyFlowOutput(results.inletEnergyFlow, settings);
    results.outletEnergyFlow = this.convertEnergyFlowOutput(results.outletEnergyFlow, settings);
    results.feedwaterEnergyFlow = this.convertEnergyFlowOutput(results.feedwaterEnergyFlow, settings);
    return results;
  }

  turbine(input: TurbineInput, settings: Settings): TurbineOutput {
    input.inletPressure = this.convertSteamPressureInput(input.inletPressure, settings);
    input.outletSteamPressure = this.convertSteamPressureInput(input.outletSteamPressure, settings);
    if (input.turbineProperty == 0) {
      input.massFlowOrPowerOut = this.convertSteamMassFlowInput(input.massFlowOrPowerOut, settings);
    }
    if (input.inletQuantity == 0) {
      input.inletQuantityValue = this.convertSteamTemperatureInput(input.inletQuantityValue, settings);
    } else if (input.inletQuantity == 1) {
      input.inletQuantityValue = this.convertSteamSpecificEnthalpyInput(input.inletQuantityValue, settings);
    } else if (input.inletQuantity == 2) {
      input.inletQuantityValue = this.convertSteamSpecificEntropyInput(input.inletQuantityValue, settings);
    }
    if (input.solveFor == 1) {
      if (input.outletQuantity == 0) {
        input.outletQuantityValue = this.convertSteamTemperatureInput(input.outletQuantityValue, settings);
      } else if (input.outletQuantity == 1) {
        input.outletQuantityValue = this.convertSteamSpecificEnthalpyInput(input.outletQuantityValue, settings);
      } else if (input.outletQuantity == 2) {
        input.outletQuantityValue = this.convertSteamSpecificEntropyInput(input.outletQuantityValue, settings);
      }
    }
    let results: TurbineOutput = steamAddon.turbine(input);
    //comes back as tonnes
    results.massFlow = this.convertUnitsService.value(results.massFlow).from('tonne').to(settings.steamMassFlowMeasurement);
    results.outletEnergyFlow = this.convertEnergyFlowOutput(results.outletEnergyFlow, settings);
    results.inletEnergyFlow = this.convertEnergyFlowOutput(results.inletEnergyFlow, settings);
    results.energyOut = this.convertEnergyFlowOutput(results.energyOut, settings);
    results.powerOut = this.convertUnitsService.value(results.powerOut).from('MJ').to(settings.steamPowerMeasurement);
    results.outletPressure = this.convertSteamPressureOutput(results.outletPressure, settings);
    results.inletPressure = this.convertSteamPressureOutput(results.inletPressure, settings);
    results.outletSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.outletSpecificEnthalpy, settings);
    results.inletSpecificEnthalpy = this.convertSteamSpecificEnthalpyOutput(results.inletSpecificEnthalpy, settings);
    results.outletSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.outletSpecificEntropy, settings);
    results.inletSpecificEntropy = this.convertSteamSpecificEntropyOutput(results.inletSpecificEntropy, settings);
    results.outletTemperature = this.convertSteamTemperatureOutput(results.outletTemperature, settings);
    results.inletTemperature = this.convertSteamTemperatureOutput(results.inletTemperature, settings);

    return results;
  }

  getDisplayUnit(unit: string) {
    if (unit) {
      let dispUnit: string = this.convertUnitsService.getUnit(unit).unit.name.display;
      dispUnit = dispUnit.replace('(', '');
      dispUnit = dispUnit.replace(')', '');
      return dispUnit;
    }
  }

}
