import { Component, OnInit, Input } from '@angular/core';
import { Settings } from '../../../shared/models/settings';
import { FormGroup } from '@angular/forms';
import { BoilerInput, BoilerOutput } from '../../../shared/models/steam';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { SteamService } from '../steam.service';
import { BoilerService } from './boiler.service';

@Component({
  selector: 'app-boiler',
  templateUrl: './boiler.component.html',
  styleUrls: ['./boiler.component.css']
})
export class BoilerComponent implements OnInit {
  @Input()
  settings: Settings;

  headerHeight: number;
  tabSelect: string = 'results';
  currentField: string = 'default';
  boilerForm: FormGroup;
  input: BoilerInput;
  results: BoilerOutput;
  constructor(private settingsDbService: SettingsDbService, private steamService: SteamService, private boilerService: BoilerService) { }

  ngOnInit() {
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }
    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
    }
    this.getForm();
    this.calculate(this.boilerForm);
  }

  setTab(str: string) {
    this.tabSelect = str;
  }
  changeField(str: string) {
    this.currentField = str;
  }

  getForm() {
    this.boilerForm = this.boilerService.initForm(this.settings);
  }

  calculate(form: FormGroup) {
    this.input = this.boilerService.getObjFromForm(form);
    if (form.status == 'VALID') {
      this.results = this.steamService.boiler(this.input, this.settings);
    } else {
      this.results = this.getEmptyResults();
    }
  }

  getEmptyResults(): BoilerOutput {
    let results: BoilerOutput = {
      steamPressure: 0,
      steamTemperature: 0,
      steamSpecificEnthalpy: 0,
      steamSpecificEntropy: 0,
      steamQuality: 0,
      steamMassFlow: 0,
      steamEnergyFlow: 0,

      blowdownPressure: 0,
      blowdownTemperature: 0,
      blowdownSpecificEnthalpy: 0,
      blowdownSpecificEntropy: 0,
      blowdownQuality: 0,
      blowdownMassFlow: 0,
      blowdownEnergyFlow: 0,

      feedwaterPressure: 0,
      feedwaterTemperature: 0,
      feedwaterSpecificEnthalpy: 0,
      feedwaterSpecificEntropy: 0,
      feedwaterQuality: 0,
      feedwaterMassFlow: 0,
      feedwaterEnergyFlow: 0,
      boilerEnergy: 0,
      fuelEnergy: 0,
    }
    return results;
  }
}
