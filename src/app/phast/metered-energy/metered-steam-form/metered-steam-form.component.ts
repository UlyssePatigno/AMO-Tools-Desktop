import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MeteredEnergySteam } from '../../../shared/models/phast/meteredEnergy';
import { Settings } from '../../../shared/models/settings';

@Component({
  selector: 'app-metered-steam-form',
  templateUrl: './metered-steam-form.component.html',
  styleUrls: ['./metered-steam-form.component.css']
})
export class MeteredSteamFormComponent implements OnInit {
  @Input()
  inputs: MeteredEnergySteam;
  @Output('emitCalculate')
  emitCalculate = new EventEmitter<boolean>();
  @Input()
  settings: Settings;
  @Output('emitSave')
  emitSave = new EventEmitter<boolean>();
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Input()
  inCalc: boolean;

  constructor() { }

  ngOnInit() {
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }

  calculate() {
    this.emitSave.emit(true);
    this.emitCalculate.emit(true);
  }

}
