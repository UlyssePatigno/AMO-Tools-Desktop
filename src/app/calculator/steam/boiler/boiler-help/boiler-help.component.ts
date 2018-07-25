import { Component, OnInit, Input } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-boiler-help',
  templateUrl: './boiler-help.component.html',
  styleUrls: ['./boiler-help.component.css']
})
export class BoilerHelpComponent implements OnInit {
  @Input()
  currentField: string;
  @Input()
  settings: Settings;
  @Input()
  thermodynamicQuantity: number;
  
  constructor() { }

  ngOnInit() {
  }

}