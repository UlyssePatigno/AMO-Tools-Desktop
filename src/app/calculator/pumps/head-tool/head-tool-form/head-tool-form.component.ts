import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-head-tool-form',
  templateUrl: './head-tool-form.component.html',
  styleUrls: ['./head-tool-form.component.css']
})
export class HeadToolFormComponent implements OnInit {
  @Input()
  headToolForm: any;
  @Output('calculate')
  calculate = new EventEmitter<boolean>();
  @Input()
  settings: Settings;
  @Input()
  inAssessment: boolean;
  @Output('changeField')
  changeField = new EventEmitter<string>();
  diameterError: string = null;
  smallUnit: string;
  tmpPipeDiameter: number;
  constructor() { }

  ngOnInit() {
    if (this.headToolForm) {
      this.tmpPipeDiameter = this.headToolForm.value.suctionPipeDiameter;
    }
    if (this.settings.distanceMeasurement == 'ft') {
      this.smallUnit = 'in'
    } else {
      this.smallUnit = 'mm'
    }
    this.calc();
  }

  calc() {
    if (this.checkPipeDiameter()) {
      this.headToolForm.patchValue({
        suctionPipeDiameter: this.tmpPipeDiameter
      })
      this.calculate.emit(true);
    }
  }


  focusField(str: string){
    this.changeField.emit(str);
  }

  checkPipeDiameter() {
     if (this.headToolForm.value.tmpPipeDiameter == 0) {
      this.diameterError = "Cannot have 0 diameter";
      return false;
    }
    else if (this.headToolForm.value.tmpPipeDiameter < 0) {
      this.diameterError = "Cannot have negative diameter";
      return false;
    }
    else {
      this.diameterError = null;
      return true;
    }
  }
}
