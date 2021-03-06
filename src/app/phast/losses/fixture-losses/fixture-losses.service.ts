import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FixtureLoss } from '../../../shared/models/phast/losses/fixtureLoss';

@Injectable()
export class FixtureLossesService {

  constructor(private formBuilder: FormBuilder) {
  }

  initForm(lossNum: number): FormGroup {
    return this.formBuilder.group({
      'materialName': ['', Validators.required],
      'feedRate': ['', Validators.required],
      'initialTemp': ['', Validators.required],
      'finalTemp': ['', Validators.required],
      'correctionFactor': [1.0, Validators.required],
      'specificHeat': ['', Validators.required],
      'name': ['Loss #'+lossNum]
    })
  }

  getFormFromLoss(loss: FixtureLoss): FormGroup {
    return this.formBuilder.group({
      'materialName': [loss.materialName, Validators.required],
      'feedRate': [loss.feedRate, Validators.required],
      'initialTemp': [loss.initialTemperature, Validators.required],
      'finalTemp': [loss.finalTemperature, Validators.required],
      'correctionFactor': [loss.correctionFactor, Validators.required],
      'specificHeat': [loss.specificHeat, Validators.required],
      'name': [loss.name]
    })
  }

  getLossFromForm(form: FormGroup): FixtureLoss {
    let tmpLoss: FixtureLoss = {
      specificHeat: form.controls.specificHeat.value,
      feedRate: form.controls.feedRate.value,
      initialTemperature: form.controls.initialTemp.value,
      finalTemperature: form.controls.finalTemp.value,
      correctionFactor: form.controls.correctionFactor.value,
      materialName: form.controls.materialName.value,
      name: form.controls.name.value
    }
    return tmpLoss;
  }
}
