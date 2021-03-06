import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { PHAST } from '../../../../shared/models/phast/phast';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-explore-slag-form',
  templateUrl: './explore-slag-form.component.html',
  styleUrls: ['./explore-slag-form.component.css']
})
export class ExploreSlagFormComponent implements OnInit {
  @Input()
  phast: PHAST;
  @Output('emitCalculate')
  emitCalculate = new EventEmitter<boolean>();
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Input()
  settings: Settings;
  @Input()
  exploreModIndex: number;

  showSlag: boolean = false;

  constructor() { }

  ngOnInit() {
    this.initData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.exploreModIndex) {
      if (!changes.exploreModIndex.isFirstChange()) {
        this.initData();
      }
    }
  }

  initData() {
    let check = (this.phast.losses.slagLosses[0].weight != this.phast.modifications[this.exploreModIndex].phast.losses.slagLosses[0].weight);
    this.showSlag = check;
  }

  toggleSlag() {
    if (this.showSlag == false) {
      this.phast.modifications[this.exploreModIndex].phast.losses.slagLosses[0].weight = this.phast.losses.slagLosses[0].weight;
    }
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }

  focusOut() {

  }

  calculate() {
    this.emitCalculate.emit(true);
  }
}
