import { Component, OnInit, Input, ViewChild, SimpleChange } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ReportRollupService, PhastResultsData } from '../../report-rollup.service';
import { ConvertUnitsService } from '../../../shared/convert-units/convert-units.service';
import { Settings } from '../../../shared/models/settings';
import { graphColors } from '../../../phast/phast-report/report-graphs/graphColors';
@Component({
  selector: 'app-phast-rollup-graphs',
  templateUrl: './phast-rollup-graphs.component.html',
  styleUrls: ['./phast-rollup-graphs.component.css']
})
export class PhastRollupGraphsComponent implements OnInit {
  @Input()
  settings: Settings

  furnaceSavingsPotential: number = 0;
  numPhasts: number = 0;
  energySavingsPotential: number = 0;
  totalCost: number = 0;
  totalEnergy: number = 0;
  results: Array<any>;

  @ViewChild(BaseChartDirective) private baseChart;

  pieChartLabels: Array<string>;
  pieChartData: Array<number>;
  chartColors: Array<any>;
  //chartColorDataSet: Array<any>;
  backgroundColors: Array<string>;
  options: any = {
    legend: {
      display: false
    }
  }
  graphColors: Array<string>;
  resultData: Array<PhastResultsData>;
  dataOption: string = 'cost';
  constructor(private reportRollupService: ReportRollupService, private convertUnitsService: ConvertUnitsService) { }

  ngOnInit() {
    this.graphColors = graphColors;
    this.reportRollupService.phastResults.subscribe(val => {
      if (val.length != 0) {
        this.calcPhastSums(val);
        this.getResults(val);
        this.getData();
        this.resultData = val;
      }
    })
  }

  calcPhastSums(resultsData: Array<PhastResultsData>) {
    this.results = new Array();
    let sumSavings = 0;
    let sumEnergy = 0;
    let sumCost = 0;
    let sumEnergySavings = 0;
    resultsData.forEach(result => {
      let diffCost = result.modificationResults.annualCostSavings;
      sumSavings += diffCost;
      sumCost += result.modificationResults.annualCost;
      let diffEnergy = this.convertUnitsService.value(result.modificationResults.annualEnergySavings).from(result.settings.energyResultUnit).to(this.settings.energyResultUnit);
      sumEnergySavings += diffEnergy;
      sumEnergy += this.convertUnitsService.value(result.modificationResults.annualEnergyUsed).from(result.settings.energyResultUnit).to(this.settings.energyResultUnit);;
    })
    this.furnaceSavingsPotential = sumSavings;
    this.energySavingsPotential = sumEnergySavings;
    this.totalCost = sumCost;
    this.totalEnergy = sumEnergy;
  }

  setDataOption(str: string){
    this.dataOption = str;
    this.getResults(this.resultData);
    this.getData();
  }

  getResults(resultsData: Array<PhastResultsData>) {
    this.results = new Array();
    let i = 0;
    resultsData.forEach(val => {
      let energyUsed = this.convertUnitsService.value(val.modificationResults.annualEnergyUsed).from(val.settings.energyResultUnit).to(this.settings.energyResultUnit);
      let percent;
      if(this.dataOption == 'cost'){
        percent = this.getResultPercent(val.modificationResults.annualCost, this.totalCost)
      }else{
        percent = this.getResultPercent(energyUsed, this.totalEnergy)
      }
      this.results.push({
        name: val.name,
        percent: percent,
        color: graphColors[i]
      })
      i++;
    })
  }

  getResultPercent(value: number, sum: number): number {
    let percent = (value / sum) * 100;
    return percent;
  }

  getConvertedPercent(value: number, sum: number, settings: Settings){
    let convertVal = this.convertUnitsService.value(value).from(settings.energyResultUnit).to(this.settings.energyResultUnit);
    let percent = (convertVal / sum) * 100;
    return percent;
  }

  getData() {
    this.pieChartData = new Array();
    this.pieChartLabels = new Array();
    this.backgroundColors = new Array();
    this.results.forEach(val => {
      this.pieChartLabels.push(val.name+' (%)');
      this.pieChartData.push(val.percent);
      this.backgroundColors.push(val.color);
    })
    if (this.baseChart && this.baseChart.chart) {
      this.baseChart.chart.config.data.labels = this.pieChartLabels;
      this.baseChart.chart.config.data.datasets[0].backgroundColor = this.backgroundColors;
    }
    this.getColors();
  }

  getColors() {
    this.chartColors = [
      {
        backgroundColor: this.backgroundColors
      }
    ]
  }
}
