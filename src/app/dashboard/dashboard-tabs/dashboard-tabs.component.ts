import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { Directory } from '../../shared/models/directory';
import { AssessmentService } from '../../assessment/assessment.service';
import { ElectronService } from 'ngx-electron';
import { DashboardService } from '../dashboard.service';
declare var packageJson: any;

@Component({
  selector: 'app-dashboard-tabs',
  templateUrl: './dashboard-tabs.component.html',
  styleUrls: ['./dashboard-tabs.component.css']
})
export class DashboardTabsComponent implements OnInit {
  @Output('directoryChange')
  directoryChange = new EventEmitter();
  @Output('selectCalculator')
  selectCalculator = new EventEmitter<string>();
  @Input()
  directory: Directory;
  @Input()
  workingDirectory: Directory;
  @Input()
  selectedCalculator: string;
  @Output('emitGoHome')
  emitGoHome = new EventEmitter<boolean>();
  @Input()
  newDirEventToggle: boolean;
  @Output('emitShowTutorials')
  emitShowTutorials = new EventEmitter<boolean>();
  @Output('emitShowAbout')
  emitShowAbout = new EventEmitter<boolean>();
  @Output('emitShowAcknowledgments')
  emitShowAcknowledgments = new EventEmitter<boolean>();
  @Input()
  dashboardView: string;
  @Output('emitGoToSettings')
  emitGoToSettings = new EventEmitter<boolean>();
  @Output('emitGoToContact')
  emitGoToContact = new EventEmitter<boolean>();
  @Output('openModal')
  openModal = new EventEmitter<boolean>();

  selectedDirectoryId: number;
  firstChange: boolean = true;
  createAssessment: boolean = false;
  versionNum: any;
  isUpdateAvailable: boolean;
  showModal: boolean;
  showVersionModal: boolean;
  mainTab: string;
  calcTab: string;
  aboutTab: string;
  constructor(private assessmentService: AssessmentService, private electronService: ElectronService, private dashboardService: DashboardService) { }

  ngOnInit() {
    // this.versionNum = packageJson.version;
    // this.directory.collapsed = false;
    // this.selectedDirectoryId = this.directory.id;
    // this.assessmentService.updateAvailable.subscribe(val => {
    //   this.isUpdateAvailable = val;
    // })
    this.dashboardService.mainTab.subscribe(val => {
      this.mainTab = val;
    })

    this.dashboardService.calcTab.subscribe(val => {
      this.calcTab = val;
    })
    this.dashboardService.aboutTab.subscribe(val => {
      this.aboutTab = val;
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.workingDirectory && !this.firstChange) {
    //   if (changes.workingDirectory.currentValue) {
    //     if (changes.workingDirectory.previousValue.id != changes.workingDirectory.currentValue.id) {
    //       this.toggleSelected(changes.workingDirectory.currentValue);
    //     }
    //   }
    // } else if (changes.selectedCalculator && !this.firstChange) {
    //   if (this.selectedCalculator != '') {
    //     this.selectedDirectoryId = null;
    //   }
    // }

    // if (this.firstChange) {
    //   this.firstChange = false;
    // }
  }

  changeTab(str: string){
    this.dashboardService.mainTab.next(str);
  }

  changeCalcTab(str: string){
    this.dashboardService.calcTab.next(str);
  }

  changeAboutTab(str: string){
    this.dashboardService.aboutTab.next(str);
  }

  toggleDirectoryCollapse(dir: Directory) {
    dir.collapsed = !dir.collapsed;
  }

  toggleSelected(dir: Directory) {
    if (dir) {
      if (dir.collapsed == true) {
        dir.collapsed = false;
      }
      this.selectedCalculator = '';
      this.selectedDirectoryId = dir.id;
      this.directoryChange.emit(dir);
    } else {
      this.selectedCalculator = '';
      this.selectedDirectoryId = null;
    }
  }
  chooseCalculator(str: string) {
    this.selectCalculator.emit(str);
  }

  getDirectory() {
    return this.directory;
  }

  goToSettings() {
    this.emitGoToSettings.emit(true);
  }

  goHome() {
    this.emitGoHome.emit(true);
  }

  showAbout() {
    this.emitShowAbout.emit(true);
  }

  showAcknowledgments() {
    this.emitShowAcknowledgments.emit(true);
  }

  showTutorials() {
    this.emitShowTutorials.emit(true);
  }

  showCreateAssessment() {
    this.assessmentService.createAssessment.next(true);
  }

  showContact() {
    this.emitGoToContact.emit(true);
  }

  closeUpdateModal() {
    this.openModal.emit(false);
    this.showModal = false;
  }

  openUpdateModal() {
    this.openModal.emit(true);
    this.showModal = true;
  }

  openVersionModal() {
    this.openModal.emit(true);
    this.showVersionModal = true;
  }

  closeVersionModal() {
    this.openModal.emit(false);
    this.showVersionModal = false;
  }

}
