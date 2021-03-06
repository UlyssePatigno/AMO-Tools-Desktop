import { Component, OnInit, Input, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PSAT } from '../../../shared/models/psat';
import { PsatService } from '../../../psat/psat.service';
import { Settings } from '../../../shared/models/settings';
import { ConvertUnitsService } from '../../../shared/convert-units/convert-units.service';
import { FormGroup } from '@angular/forms';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
@Component({
  selector: 'app-achievable-efficiency',
  templateUrl: './achievable-efficiency.component.html',
  styleUrls: ['./achievable-efficiency.component.css']
})
export class AchievableEfficiencyComponent implements OnInit {
  @Input()
  psat: PSAT;
  @Input()
  settings: Settings;
  @Input()
  inPsat: boolean;

  @ViewChild('leftPanelHeader') leftPanelHeader: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeTabs();
  }

  headerHeight: number;

  efficiencyForm: FormGroup;
  toggleCalculate: boolean = true;
  tabSelect: string = 'results';

  constructor(private formBuilder: FormBuilder, private psatService: PsatService, private settingsDbService: SettingsDbService, private convertUnitsService: ConvertUnitsService) { }
  ngOnInit() {
    if (!this.psat) {
      this.efficiencyForm = this.psatService.initForm();
      //patch default/starter values for stand alone calculator
      this.efficiencyForm.patchValue({
        pumpType: this.psatService.getPumpStyleFromEnum(6),
        flowRate: 2000
      })
    } else {
      this.efficiencyForm = this.psatService.getFormFromPsat(this.psat.inputs);
    }


    //if stand alone calculator use system settings
    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
      if (this.settings.flowMeasurement != 'gpm') {
        let tmpVal = this.convertUnitsService.value(this.efficiencyForm.controls.flowRate.value).from('gpm').to(this.settings.flowMeasurement);
        this.efficiencyForm.patchValue({
          flowRate: this.psatService.roundVal(tmpVal, 2)
        })
      }
    }
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeTabs();
    }, 100);
  }

  resizeTabs() {
    if (this.leftPanelHeader.nativeElement.clientHeight) {
      this.headerHeight = this.leftPanelHeader.nativeElement.clientHeight;
    }
  }

  calculate() {
    this.toggleCalculate = !this.toggleCalculate;
  }

  setTab(str: string) {
    this.tabSelect = str;
  }
}
