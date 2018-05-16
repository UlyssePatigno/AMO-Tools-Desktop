import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { LossesService } from '../../losses.service';
import { PHAST } from '../../../../shared/models/phast/phast';
import { FormGroup } from '@angular/forms';
import { WallLossesService } from '../../wall-losses/wall-losses.service';
import { WallLossCompareService } from '../../wall-losses/wall-loss-compare.service';
import { WallLoss } from '../../../../shared/models/phast/losses/wallLoss';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wall-tab',
  templateUrl: './wall-tab.component.html',
  styleUrls: ['./wall-tab.component.css']
})
export class WallTabComponent implements OnInit {
  @Input()
  phast: PHAST;

  badgeHover: boolean;
  displayTooltip: boolean;

  numLosses: number = 0;
  inputError: boolean;
  missingData: boolean;
  isDifferent: boolean;
  badgeClass: Array<string>;
  compareSubscription: Subscription;
  lossSubscription: Subscription;
  constructor(private lossesService: LossesService, private wallLossesService: WallLossesService, private wallLossCompareService: WallLossCompareService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.setNumLosses();
    this.lossSubscription = this.lossesService.updateTabs.subscribe(val => {
      // console.log('subscription running');
      console.log('lossSubscription val = ' + val);
      this.setNumLosses();
      this.missingData = this.checkMissingData();
      this.isDifferent = this.checkDifferent();
      console.log('this.missingData = ' + this.missingData);
      console.log('this.isDifferent = ' + this.isDifferent);
      this.setBadgeClass();
    })

    this.compareSubscription = this.wallLossCompareService.inputError.subscribe(val => {
      this.inputError = val;
      // console.log('compareSubscription val = ' + val);
      console.log('this.inputError = ' + this.inputError);
      this.setBadgeClass();
    })

    this.badgeHover = false;
  }

  ngOnDestroy() {
    this.compareSubscription.unsubscribe();
    this.lossSubscription.unsubscribe();
  }

  setBadgeClass() {
    let badgeStr: Array<string> = ['success'];
    if (this.missingData) {
      // console.log('missingData is TRUE');
      badgeStr = ['missing-data'];
    } else if (this.inputError) {
      badgeStr = ['input-error'];
    } else if (this.isDifferent) {
      badgeStr = ['loss-different'];
    }
    this.badgeClass = badgeStr;
    this.cd.detectChanges();
  }

  setNumLosses() {
    if (this.phast.losses) {
      if (this.phast.losses.wallLosses) {
        this.numLosses = this.phast.losses.wallLosses.length;
      }
    }
  }
  checkMissingData(): boolean {
    let testVal = false;
    if (this.wallLossCompareService.baselineWallLosses) {
      // console.log('wallLossComapreService.baslineWallLosses is TRUE');
      this.wallLossCompareService.baselineWallLosses.forEach(loss => {
        if (this.checkLossValid(loss) == false) {
          // console.log("loss = ");
          // console.log(loss);
          testVal = true;
          console.log('baselineWallLosses testVal = true');
          // this.missingData = true;
          // this.setBadgeClass();
        }
      })
    }
    if (this.wallLossCompareService.modifiedWallLosses) {
      this.wallLossCompareService.modifiedWallLosses.forEach(loss => {
        if (this.checkLossValid(loss) == false) {
          testVal = true;
          console.log('modifiedWallLosses testVal = true');
        }
      })
    }
    return testVal;
  }


  checkLossValid(loss: WallLoss) {
    // console.log('checkLossValid');
    let tmpForm: FormGroup = this.wallLossesService.getWallLossForm(loss);
    // console.log("tmpForm status = " + tmpForm.status);
    // console.log(tmpForm);
    if (tmpForm.status == 'VALID') {
      return true;
    } else {
      // console.log('loss valid is false');
      return false;
    }
  }

  checkDifferent() {
    // console.log('checkDifferent()');
    if (this.wallLossCompareService.baselineWallLosses && this.wallLossCompareService.modifiedWallLosses) {
      return this.wallLossCompareService.compareAllLosses();
    }
  }

  showTooltip() {
    this.badgeHover = true;

    setTimeout(() => {
      this.checkHover();
    }, 1000);
  }

  hideTooltip() {
    this.badgeHover = false;
    this.displayTooltip = false;
  }

  checkHover() {
    if (this.badgeHover) {
      this.displayTooltip = true;
    }
    else {
      this.displayTooltip = false;
    }
  }
}
