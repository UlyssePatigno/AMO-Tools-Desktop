import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DashboardService {


  mainTab: BehaviorSubject<string>;
  calcTab: BehaviorSubject<string>;
  aboutTab: BehaviorSubject<string>;
  tutorialsTab: BehaviorSubject<string>;  

  constructor() { 
    this.mainTab = new BehaviorSubject<string>('landing-screen');
    this.calcTab = new BehaviorSubject<string>('all');
    this.aboutTab = new BehaviorSubject<string>('about-app')
  }

}
