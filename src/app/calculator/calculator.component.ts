import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  @Input()
  selectedCalculator: string;
  @Input()
  goCalcHome: boolean;
  @Output('selectCalculator')
  selectCalculator = new EventEmitter<string>();

  selectedTool: string;
  isFirstChange: boolean = true;
  constructor(private dashboardService: DashboardService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isFirstChange) {
      this.selectedTool = 'none';
    } else {
      this.isFirstChange = false;
    }
  }


  ngOnInit() {
    this.selectedTool = 'none';
    this.dashboardService.calcTab.subscribe(val => {
      this.selectedCalculator = val;
    })
  }

  showTool(calc: string, tool: string) {
    this.isFirstChange = true;
    this.selectedTool = tool;
    this.selectCalculator.emit(calc);
  }

}
