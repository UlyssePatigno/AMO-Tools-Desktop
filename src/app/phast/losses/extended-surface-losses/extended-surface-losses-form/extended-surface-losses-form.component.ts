import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { WindowRefService } from '../../../../indexedDb/window-ref.service';
import { ExtendedSurfaceCompareService } from '../extended-surface-compare.service';

@Component({
  selector: 'app-extended-surface-losses-form',
  templateUrl: './extended-surface-losses-form.component.html',
  styleUrls: ['./extended-surface-losses-form.component.css']
})
export class ExtendedSurfaceLossesFormComponent implements OnInit {
  @Input()
  lossesForm: any;
  @Output('calculate')
  calculate = new EventEmitter<boolean>();
  @Input()
  lossState: any;
  @Input()
  baselineSelected: boolean;
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Output('saveEmit')
  saveEmit = new EventEmitter<boolean>();
  @Input()
  lossIndex: number;

  @ViewChild('lossForm') lossForm: ElementRef;
  form: any;
  elements: any;

  firstChange: boolean = true;
  counter: any;

  constructor(private extendedSurfaceCompareService: ExtendedSurfaceCompareService, private windowRefService: WindowRefService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.firstChange) {
      if (!this.baselineSelected) {
        this.disableForm();
      } else {
        this.enableForm();
      }
    } else {
      this.firstChange = false;
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (!this.baselineSelected) {
      this.disableForm();
    }
    this.initDifferenceMonitor();
  }

  disableForm() {
    this.elements = this.lossForm.nativeElement.elements;
    for (var i = 0, len = this.elements.length; i < len; ++i) {
      this.elements[i].disabled = true;
    }
  }

  enableForm() {
    this.elements = this.lossForm.nativeElement.elements;
    for (var i = 0, len = this.elements.length; i < len; ++i) {
      this.elements[i].disabled = false;
    }
  }
  checkForm() {
    this.lossState.saved = false;
    if (this.lossesForm.status == "VALID") {
      this.calculate.emit(true);
    }
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }
  emitSave() {
    this.saveEmit.emit(true);
  }

  startSavePolling() {
    this.checkForm();
    if (this.counter) {
      clearTimeout(this.counter);
    }
    this.counter = setTimeout(() => {
      this.emitSave();
    }, 3000)
  }

  initDifferenceMonitor() {
    if (this.extendedSurfaceCompareService.baselineSurface && this.extendedSurfaceCompareService.modifiedSurface && this.extendedSurfaceCompareService.differentArray.length != 0) {
      let doc = this.windowRefService.getDoc();

      //surfaceArea
      this.extendedSurfaceCompareService.differentArray[this.lossIndex].different.surfaceArea.subscribe((val) => {
        let surfaceAreaElements = doc.getElementsByName('surfaceArea_' + this.lossIndex);
        surfaceAreaElements.forEach(element => {
          element.classList.toggle('indicate-different', val);
        });
      })
      //avgSurfaceTemp
      this.extendedSurfaceCompareService.differentArray[this.lossIndex].different.surfaceTemperature.subscribe((val) => {
        let avgSurfaceTempElements = doc.getElementsByName('avgSurfaceTemp_' + this.lossIndex);
        avgSurfaceTempElements.forEach(element => {
          element.classList.toggle('indicate-different', val);
        });
      })
      //ambientTemp
      this.extendedSurfaceCompareService.differentArray[this.lossIndex].different.ambientTemperature.subscribe((val) => {
        let ambientTempElements = doc.getElementsByName('ambientTemp_' + this.lossIndex);
        ambientTempElements.forEach(element => {
          element.classList.toggle('indicate-different', val);
        });
      })
      //surfaceEmissivity
      this.extendedSurfaceCompareService.differentArray[this.lossIndex].different.surfaceEmissivity.subscribe((val) => {
        let surfaceEmissivityElements = doc.getElementsByName('surfaceEmissivity_' + this.lossIndex);
        surfaceEmissivityElements.forEach(element => {
          element.classList.toggle('indicate-different', val);
        });
      })
    }
  }
}
