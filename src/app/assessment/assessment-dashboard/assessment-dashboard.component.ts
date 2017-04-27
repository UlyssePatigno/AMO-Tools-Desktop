import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { MockDirectory } from '../../shared/mocks/mock-directory';
import { Directory } from '../../shared/models/directory';

@Component({
  selector: 'app-assessment-dashboard',
  templateUrl: './assessment-dashboard.component.html',
  styleUrls: ['./assessment-dashboard.component.css']
})
export class AssessmentDashboardComponent implements OnInit {
  @Input()
  directory: Directory;
  @Output('directoryChange')
  directoryChange = new EventEmitter();
  @Output('deleteDataSignal')
  deleteDataSignal = new EventEmitter<boolean>();
  @Output('deleteCheckedItems')
  deleteCheckedItems = new EventEmitter<boolean>();

  view: string;
  isFirstChange: boolean = true;
  constructor() { }

  ngOnInit() {
    if (!this.view) {
      this.view = 'list';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.directory && !this.isFirstChange) {
      this.view == 'list';
    }

    if (this.isFirstChange) {
      this.isFirstChange = false;
    }
  }
  changeView($event) {
    if (this.view == $event && this.view == 'settings') {
      this.view = 'list';
    } else {
      this.view = $event;
    }
  }

  changeDirectory($event) {
    if (this.view == 'settings') {
      this.view = 'list';
    }
    this.directoryChange.emit($event);
  }

  signalDelete() {
    this.deleteDataSignal.emit(true);
  }

  signalDeleteItems() {
    this.deleteCheckedItems.emit(true);
  }

}
