import { Injectable } from '@angular/core';
import { Settings } from '../shared/models/settings';
import { IndexedDbService } from './indexed-db.service';
import * as _ from 'lodash';
import { Assessment } from '../shared/models/assessment';
import { UpdateDataService } from '../shared/update-data.service';
import { SettingsService } from '../settings/settings.service';
@Injectable()
export class SettingsDbService {
  allSettings: Array<Settings>;
  constructor(private indexedDbService: IndexedDbService, private settingService: SettingsService) { }

  setAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.indexedDbService.db) {
        this.indexedDbService.getAllSettings().then(settings => {
          this.allSettings = settings;
          resolve(true)
        })
      } else {
        this.allSettings = [];
        resolve(false);
      }
    })
  }

  getAll(): Array<Settings> {
    return this.allSettings;
  }

  getById(id: number): Settings {
    let selectedSettings: Settings = _.find(this.allSettings, (settings) => { return settings.id == id })
    selectedSettings = this.checkSettings(selectedSettings);
    return selectedSettings;
  }

  getByDirectoryId(id: number): Settings {
    let selectedSettings: Settings = _.find(this.allSettings, (settings) => { return settings.directoryId == id });
    if (!selectedSettings) {
      selectedSettings = _.find(this.allSettings, (settings) => { return settings.directoryId == 1 })
    }
    selectedSettings = this.checkSettings(selectedSettings);
    return selectedSettings;
  }

  getByAssessmentId(assessment: Assessment): Settings {
    let selectedSettings: Settings = _.find(this.allSettings, (settings) => { return settings.assessmentId == assessment.id });
    if (!selectedSettings) {
      selectedSettings = this.getByDirectoryId(assessment.directoryId)
    }
    if (!selectedSettings) {
      selectedSettings = this.getByDirectoryId(1);
    }
    selectedSettings = this.checkSettings(selectedSettings);
    return selectedSettings;
  }


  checkSettings(settings: Settings): Settings {
    if (!settings.energyResultUnit) {
      settings = this.settingService.setEnergyResultUnitSetting(settings);
    }

    if (!settings.temperatureMeasurement) {
      settings = this.settingService.setTemperatureUnit(settings);
    }
    if (!settings.fuelCost) {
      settings.fuelCost = 3.99;
    }
    if (!settings.steamCost) {
      settings.steamCost = 4.69;
    }
    if (!settings.electricityCost) {
      settings.electricityCost = .066;
    }
    return settings;
  }

}
