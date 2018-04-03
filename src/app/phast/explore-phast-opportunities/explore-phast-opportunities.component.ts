import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { PHAST } from '../../shared/models/phast/phast';
import { Assessment } from '../../shared/models/assessment';
import { Settings } from '../../shared/models/settings';
import { LossTab } from '../tabs';
import { PhastCompareService } from '../phast-compare.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { LossesService } from '../losses/losses.service';
@Component({
  selector: 'app-explore-phast-opportunities',
  templateUrl: './explore-phast-opportunities.component.html',
  styleUrls: ['./explore-phast-opportunities.component.css']
})
export class ExplorePhastOpportunitiesComponent implements OnInit {
  @Input()
  assessment: Assessment;
  @Input()
  phast: PHAST;
  @Input()
  settings: Settings;
  @Input()
  containerHeight: number;

  @Output('save')
  save = new EventEmitter<boolean>();

  tabSelect: string = 'results';
  exploreModIndex: number;
  currentField: string = 'default';
  toggleCalculate: boolean = false;
  lossTab: LossTab = {
    step: 0,
    tabName: '',
    componentStr: ''
  };

  modExists: boolean = false;
  selectModificationSubscription: Subscription;
  constructor(private phastCompareService: PhastCompareService, private lossesService: LossesService) { }

  ngOnInit() {
    this.selectModificationSubscription = this.phastCompareService.selectedModification.subscribe(mod => {
      if (mod) {
        this.exploreModIndex = _.findIndex(this.phast.modifications, (val) => {
          return val.phast.name == mod.name
        })
        if (this.exploreModIndex != undefined) {
          this.modExists = true;
        }
      }
    })
  }

  ngOnDestroy() {
    this.selectModificationSubscription.unsubscribe();
  }

  setTab(str: string) {
    this.tabSelect = str;
  }

  getResults() {
    this.startSavePolling();
    this.toggleCalculate = !this.toggleCalculate;
  }

  focusField(str: string) {
    this.currentField = str;
  }

  changeTab(tab: LossTab) {
    this.lossTab = tab;
  }

  startSavePolling() {
    this.save.emit(true);
  }

  addModification() {
    this.lossesService.openNewModal.next(true);
  }
}
