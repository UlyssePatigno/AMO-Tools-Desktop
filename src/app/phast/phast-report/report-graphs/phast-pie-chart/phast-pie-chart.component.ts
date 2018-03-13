import { Component, OnInit, Input, ViewChild, SimpleChanges, ElementRef } from '@angular/core';
import { PHAST, PhastResults, ShowResultsCategories } from '../../../../shared/models/phast/phast';
import { WindowRefService } from '../../../../indexedDb/window-ref.service';
import { PhastReportService } from '../../phast-report.service';
import { SvgToPngService } from '../../../../shared/svg-to-png/svg-to-png.service';
import { graphColors, grayScaleGraphColors } from '../graphColors';
import * as d3 from 'd3';
import * as c3 from 'c3';

@Component({
  selector: 'app-phast-pie-chart',
  templateUrl: './phast-pie-chart.component.html',
  styleUrls: ['./phast-pie-chart.component.css']
})
export class PhastPieChartComponent implements OnInit {
  @Input()
  results: PhastResults;
  @Input()
  resultCats: ShowResultsCategories;
  @Input()
  isBaseline: boolean;
  @Input()
  modExists: boolean;
  @Input()
  printView: boolean;
  @Input()
  chartContainerWidth: number;
  @Input()
  chartIndex: number;
  @Input()
  graphColors: Array<string>;

  @ViewChild("ngChart") ngChart: ElementRef;
  @ViewChild('btnDownload') btnDownload: ElementRef;

  exportName: string;

  chartContainerHeight: number;

  legendPadding: number;
  legendTileHeight: number;
  legendTileWidth: number;

  chartData: any = {
    pieChartLabels: new Array<string>(),
    pieChartData: new Array<number>()
  }

  pieChartData: Array<Array<any>>;

  options: any = {
    legend: {
      display: false
    }
  }

  totalWallLoss: number;
  totalAtmosphereLoss: number;
  totalOtherLoss: number;
  totalCoolingLoss: number;
  totalOpeningLoss: number;
  totalFixtureLoss: number;
  totalLeakageLoss: number;
  totalExtSurfaceLoss: number;
  totalChargeMaterialLoss: number;
  totalFlueGas: number;
  totalAuxPower: number;
  totalSlag: number;
  totalExhaustGasEAF: number;
  totalExhaustGas: number;
  totalSystemLosses: number;

  doc: any;
  window: any;

  chart: any;
  svg: any;
  tmpChartData: Array<any>;


  constructor(private phastReportService: PhastReportService, private windowRefService: WindowRefService, private svgToPngService: SvgToPngService) { }

  ngOnInit() {

    // this.initPatterns();
    this.graphColors = grayScaleGraphColors;
    // this.graphColors = graphColors;


    // if (this.printView) {
    //   this.graphColors = grayScaleGraphColors;
    // }
    // else {
    //   this.graphColors = graphColors;
    // }
  }

  ngAfterViewInit() {
    if (!this.printView) {
      this.legendPadding = 0;
      this.legendTileHeight = 13;
      this.legendTileWidth = 20;
      if (this.modExists) {
        this.chartContainerWidth = this.chartContainerWidth / 2;
      }
      this.chartContainerHeight = 315;
    }
    else {
      this.legendPadding = 5;
      this.legendTileHeight = 25;
      this.legendTileWidth = 50;
      this.chartContainerHeight = 450;
      this.chartContainerWidth = 1000;
    }

    this.getData(this.results, this.resultCats);
    this.initChart();



    if (!this.printView) {
      this.updateChart();
    }

    this.setupPatterns();


  }

  setupPatterns() {

    let defs = d3.select("defs");

    //diagonal stripe 1
    defs.append("pattern").attr('id', 'diagonal-stripe-1')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzEnLz4KPC9zdmc+Cg==')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);

    //diagonal stripe 2
    defs.append('pattern').attr('id', 'diagonal-stripe-2')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzInLz4KPC9zdmc+')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);

    //diagonal stripe 3
    defs.append('pattern').attr('id', 'diagonal-stripe-3')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzMnLz4KPC9zdmc+')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);

    //diagonal stripe 4
    defs.append('pattern').attr('id', 'diagonal-stripe-4')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSdibGFjaycvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J3doaXRlJyBzdHJva2Utd2lkdGg9JzMnLz4KPC9zdmc+')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);

    //diagonal stripe 5
    defs.append('pattern').attr('id', 'diagonal-stripe-5')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSdibGFjaycvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J3doaXRlJyBzdHJva2Utd2lkdGg9JzInLz4KPC9zdmc+')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);

    //diagonal stripe 6
    defs.append('pattern').attr('id', 'diagonal-stripe-6')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSdibGFjaycvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J3doaXRlJyBzdHJva2Utd2lkdGg9JzEnLz4KPC9zdmc+')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);


    //circles 1
    defs.append('pattern').attr('id', 'circles-1')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSJ3aGl0ZSIgLz4KICA8Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0iYmxhY2siLz4KPC9zdmc+')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);


    //circles 4
    defs.append('pattern').attr('id', 'circles-4')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8Y2lyY2xlIGN4PScyLjUnIGN5PScyLjUnIHI9JzIuNScgZmlsbD0nYmxhY2snLz4KPC9zdmc+')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);


    //dots 2
    defs.append('pattern').attr('id', 'dots-2')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMicgaGVpZ2h0PScyJyBmaWxsPSdibGFjaycgLz4KPC9zdmc+')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);

    //smalldot
    defs.append('pattern').attr('id', 'smalldot')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1JyBoZWlnaHQ9JzUnPgo8cmVjdCB3aWR0aD0nNScgaGVpZ2h0PSc1JyBmaWxsPScjZmZmJy8+CjxyZWN0IHdpZHRoPScxJyBoZWlnaHQ9JzEnIGZpbGw9JyNjY2MnLz4KPC9zdmc+')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);


    //vertical stripe 2
    defs.append('pattern').attr('id', 'vertical-stripe-2')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMicgaGVpZ2h0PScxMCcgZmlsbD0nYmxhY2snIC8+Cjwvc3ZnPg==')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);


    //vertical stripe
    defs.append("pattern").attr('id', 'verticalstripe')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc2JyBoZWlnaHQ9JzQ5Jz4KICA8cmVjdCB3aWR0aD0nMycgaGVpZ2h0PSc1MCcgZmlsbD0nI2ZmZicvPgogIDxyZWN0IHg9JzMnIHdpZHRoPScxJyBoZWlnaHQ9JzUwJyBmaWxsPScjY2NjJy8+Cjwvc3ZnPgo=')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);

    //houndstooth
    defs.append('pattern').attr('id', 'houndstooth')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAnIGhlaWdodD0nMTAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+CiAgPHBhdGggZD0nTTAgMEw0IDQnIHN0cm9rZT0nI2FhYScgZmlsbD0nI2FhYScgc3Ryb2tlLXdpZHRoPScxJy8+CiAgPHBhdGggZD0nTTIuNSAwTDUgMi41TDUgNUw5IDlMNSA1TDEwIDVMMTAgMCcgc3Ryb2tlPScjYWFhJyBmaWxsPScjYWFhJyBzdHJva2Utd2lkdGg9JzEnLz4KICA8cGF0aCBkPSdNNSAxMEw1IDcuNUw3LjUgMTAnIHN0cm9rZT0nI2FhYScgZmlsbD0nI2FhYScgc3Ryb2tlLXdpZHRoPScxJy8+Cjwvc3ZnPgo=')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);

    //lightstripe
    defs.append('pattern').attr('id', 'lightstripe')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1JyBoZWlnaHQ9JzUnPgogIDxyZWN0IHdpZHRoPSc1JyBoZWlnaHQ9JzUnIGZpbGw9J3doaXRlJy8+CiAgPHBhdGggZD0nTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVonIHN0cm9rZT0nIzg4OCcgc3Ryb2tlLXdpZHRoPScxJy8+Cjwvc3ZnPg==')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);


    //crosshatch
    defs.append('pattern').attr('id', 'crosshatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzgnPgogIDxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzgnIGZpbGw9JyNmZmYnLz4KICA8cGF0aCBkPSdNMCAwTDggOFpNOCAwTDAgOFonIHN0cm9rZS13aWR0aD0nMC41JyBzdHJva2U9JyNhYWEnLz4KPC9zdmc+Cg==')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);

    //horizontal stripe 1
    defs.append('pattern').attr('id', 'horizontal-stripe-1')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMTAnIGhlaWdodD0nMScgZmlsbD0nYmxhY2snIC8+Cjwvc3ZnPg==')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);

    //whitecarbon
    defs.append('pattern').attr('id', 'whitecarbon')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)
      .attr('height', 10)
      .append('image')
      .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jz4KICA8cmVjdCB3aWR0aD0nNicgaGVpZ2h0PSc2JyBmaWxsPScjZWVlZWVlJy8+CiAgPGcgaWQ9J2MnPgogICAgPHJlY3Qgd2lkdGg9JzMnIGhlaWdodD0nMycgZmlsbD0nI2U2ZTZlNicvPgogICAgPHJlY3QgeT0nMScgd2lkdGg9JzMnIGhlaWdodD0nMicgZmlsbD0nI2Q4ZDhkOCcvPgogIDwvZz4KICA8dXNlIHhsaW5rOmhyZWY9JyNjJyB4PSczJyB5PSczJy8+Cjwvc3ZnPg==')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (!changes.results.firstChange) {
      this.getData(this.results, this.resultCats);
      this.updateChart();
    }
  }


  initChart() {

    if (this.printView) {
      this.ngChart.nativeElement.className = 'print-pie-chart';
    }

    // let colorScheme = this.graphColors;

    //debug
    this.chart = c3.generate({
      bindto: this.ngChart.nativeElement,
      data: {
        //debug
        columns: [],

        //real version
        // columns: this.pieChartData,
        type: 'pie',
        labels: true,
        order: null
      },
      legend: {
        padding: 25,
        item: {
          event: {
            height: 15
          },
          tile: {
            width: this.legendTileWidth,
            height: this.legendTileHeight
          }
        },
        position: 'right'
      },
      color: {
        pattern: this.graphColors
      },
      size: {
        width: this.chartContainerWidth,
        height: this.chartContainerHeight
      },
      tooltip: {
        contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
          let styling = "background-color: rgba(0, 0, 0, 0.7); border-radius: 5px; color: #fff; padding: 3px; font-size: 13px;";
          let html = "<div style='" + styling + "'>" + d[0].name + "</div>";
          return html;
        }
      }
    });


    //debug
    for (let i = 0; i < this.pieChartData.length; i++) {
      this.chart.load({
        columns: [
          [this.pieChartData[i][0], this.pieChartData[i][1]]
        ]
      })
    }

    // console.log(this.chart);

    if (!this.printView) {
      // setTimeout(() => {
      this.chart.load({
        names: {
          wall: "Wall " + this.totalWallLoss + "%",
          atmosphere: "Atmosphere " + this.totalAtmosphereLoss + "%",
          other: "Other Loss " + this.totalOtherLoss + "%",
          cooling: "Cooling " + this.totalCoolingLoss + "%",
          opening: "Opening " + this.totalOpeningLoss + "%",
          fixture: "Fixture " + this.totalFixtureLoss + "%",
          leakage: "Leakage " + this.totalLeakageLoss + "%",
          extSurface: "Extended Surface " + this.totalExtSurfaceLoss + "%",
          charge: "Charge Materials " + this.totalChargeMaterialLoss + "%",
          flue: "Flue Gas " + this.totalFlueGas + "%",
          aux: "Auxillary Power " + this.totalAuxPower + "%",
          slag: "Slag " + this.totalSlag + "%",
          exGasEAF: "Exhaust Gas (EAF) " + this.totalExhaustGasEAF + "%",
          exGas: "Exhaust Gas " + this.totalExhaustGas + "%",
          sys: "System " + this.totalSystemLosses + "%"
        },
      });

      // d3.selectAll(".c3-chart-arcs").attr("width", this.chartContainerWidth).attr("height", this.chartContainerHeight);
      d3.selectAll(".pie-chart .c3-legend-item text").style("font-size", "13px");
      d3.selectAll(".pie-chart .c3-chart-arc path").attr('stroke', '#666');
      // d3.selectAll(".c3-legend-item rect").attr("height", "18");
      // d3.selectAll(".pie-chart .c3-legend-item rect").attr("height", "18");
      // d3.selectAll(".pie-chart .c3-legend-item")
      // }, 500);
    }
    else {
      this.chart.load({
        names: {
          wall: "Wall " + this.totalWallLoss + "%",
          atmosphere: "Atmosphere " + this.totalAtmosphereLoss + "%",
          other: "Other " + this.totalOtherLoss + "%",
          cooling: "Cooling " + this.totalCoolingLoss + "%",
          opening: "Opening " + this.totalOpeningLoss + "%",
          fixture: "Fixture " + this.totalFixtureLoss + "%",
          leakage: "Leakage " + this.totalLeakageLoss + "%",
          extSurface: "Extended Surface " + this.totalExtSurfaceLoss + "%",
          charge: "Charge Materials " + this.totalChargeMaterialLoss + "%",
          flue: "Flue Gas " + this.totalFlueGas + "%",
          aux: "Auxillary Power " + this.totalAuxPower + "%",
          slag: "Slag " + this.totalSlag + "%",
          exGasEAF: "Exhaust Gas (EAF) " + this.totalExhaustGasEAF + "%",
          exGas: "Exhaust Gas " + this.totalExhaustGas + "%",
          sys: "System " + this.totalSystemLosses + "%"
        },
      });

      d3.selectAll(".print-pie-chart .c3-legend-item text").style("font-size", "1.2rem");
      d3.selectAll(".print-pie-chart g.c3-chart-arc text").style("font-size", "1rem");
      // d3.selectAll(".c3-chart-arcs").attr("width", this.chartContainerWidth).attr("height", this.chartContainerHeight);
      // d3.selectAll(".pie-chart .c3-legend-item text").style("font-size", "14px");
      // d3.selectAll(".pie-chart .c3-legend-item rect").attr("height", "18");
      d3.selectAll(".print-pie-chart .c3-chart-arc path").attr('stroke', '#666');
    }

    // setTimeout(() => {
    //   d3.selectAll('.c3-arc-charge').style('fill', 'url(#diagonal-stripe-1)');
    //   d3.selectAll('.c3-arc-flue').style('fill', 'url(#verticalstripe)');
    // }, 500);

  }

  updateChart() {

    if (this.chart) {

      this.chart.load({
        columns: this.pieChartData,
        names: {
          wall: "Wall Losses " + this.totalWallLoss + "%",
          atmosphere: "Atmosphere Losses " + this.totalAtmosphereLoss + "%",
          other: "Other Losses " + this.totalOtherLoss + "%",
          cooling: "Cooling Losses " + this.totalCoolingLoss + "%",
          opening: "Opening Losses " + this.totalOpeningLoss + "%",
          fixture: "Fixture Losses " + this.totalFixtureLoss + "%",
          leakage: "Leakage Losses " + this.totalLeakageLoss + "%",
          extSurface: "Extended Surface Losses " + this.totalExtSurfaceLoss + "%",
          charge: "Charge Materials " + this.totalChargeMaterialLoss + "%",
          flue: "Flue Gas Losses " + this.totalFlueGas + "%",
          aux: "Auxillary Power " + this.totalAuxPower + "%",
          slag: "Slag " + this.totalSlag + "%",
          exGasEAF: "Exhaust Gas (EAF) Losses " + this.totalExhaustGasEAF + "%",
          exGas: "Exhaust Gas Losses " + this.totalExhaustGas + "%",
          sys: "System Losses " + this.totalSystemLosses + "%"
        },
        order: null
      });

      setTimeout(() => {
        this.chart.load({
          names: {
            wall: "Wall Losses " + this.totalWallLoss + "%",
            atmosphere: "Atmosphere Losses " + this.totalAtmosphereLoss + "%",
            other: "Other Losses " + this.totalOtherLoss + "%",
            cooling: "Cooling Losses " + this.totalCoolingLoss + "%",
            opening: "Opening Losses " + this.totalOpeningLoss + "%",
            fixture: "Fixture Losses " + this.totalFixtureLoss + "%",
            leakage: "Leakage Losses " + this.totalLeakageLoss + "%",
            extSurface: "Extended Surface Losses " + this.totalExtSurfaceLoss + "%",
            charge: "Charge Materials " + this.totalChargeMaterialLoss + "%",
            flue: "Flue Gas Losses " + this.totalFlueGas + "%",
            aux: "Auxillary Power " + this.totalAuxPower + "%",
            slag: "Slag " + this.totalSlag + "%",
            exGasEAF: "Exhaust Gas (EAF) Losses " + this.totalExhaustGasEAF + "%",
            exGas: "Exhaust Gas Losses " + this.totalExhaustGas + "%",
            sys: "System Losses " + this.totalSystemLosses + "%"
          },
        });
      }, 300)

      // if (!this.printView) {
      //   setTimeout(() => {
      //     d3.selectAll(".c3-chart-arcs").attr("width", this.chartContainerWidth).attr("height", this.chartContainerHeight);
      //     d3.selectAll(".pie-chart .c3-legend-item text").style("font-size", "13px");
      //     d3.selectAll(".pie-chart .c3-legend-item rect").attr("height", "18");
      //   }, 500);
      // }
      // else {
      //   setTimeout(() => {
      //     d3.selectAll(".print-pie-chart .c3-legend-item").style("font-size", "1.2rem");
      //     d3.selectAll(".print-pie-chart g.c3-chart-arc text").style("font-size", "1.2rem");
      //   }, 800);
      // }
    }
  }


  getData(phastResults: PhastResults, resultCats: ShowResultsCategories) {
    this.totalWallLoss = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalWallLoss);
    this.totalAtmosphereLoss = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalAtmosphereLoss);
    this.totalOtherLoss = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalOtherLoss);
    this.totalCoolingLoss = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalCoolingLoss);
    this.totalOpeningLoss = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalOpeningLoss);
    this.totalFixtureLoss = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalFixtureLoss);
    this.totalLeakageLoss = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalLeakageLoss);
    this.totalExtSurfaceLoss = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalExtSurfaceLoss);
    this.totalChargeMaterialLoss = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalChargeMaterialLoss);
    this.totalFlueGas = 0;
    this.totalSlag = 0;
    this.totalAuxPower = 0;
    this.totalExhaustGas = 0;
    this.totalExhaustGasEAF = 0;
    this.totalSystemLosses = 0;

    if (resultCats.showFlueGas) {
      this.totalFlueGas = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalFlueGas);
    }
    if (resultCats.showAuxPower) {
      this.totalAuxPower = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalAuxPower);
    }
    if (resultCats.showSlag) {
      this.totalSlag = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalSlag);
    }
    if (resultCats.showExGas) {
      this.totalExhaustGasEAF = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalExhaustGasEAF);
    }
    if (resultCats.showEnInput2) {
      this.totalExhaustGas = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalExhaustGas);
    }
    if (resultCats.showSystemEff) {
      this.totalSystemLosses = this.getLossPercent(phastResults.grossHeatInput, phastResults.totalSystemLosses);
    }
    if (this.isBaseline) {
      this.phastReportService.baselineChartLabels.next(this.chartData.pieChartLabels);
    } else {
      this.phastReportService.modificationChartLabels.next(this.chartData.pieChartLabels);
    }

    this.pieChartData = new Array<Array<any>>();
    let tmpArray = new Array<any>();

    tmpArray = new Array<any>();
    tmpArray.push("flue");
    tmpArray.push(this.totalFlueGas);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("charge");
    tmpArray.push(this.totalChargeMaterialLoss);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("opening");
    tmpArray.push(this.totalOpeningLoss);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("wall");
    tmpArray.push(this.totalWallLoss);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("atmosphere");
    tmpArray.push(this.totalAtmosphereLoss);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("cooling");
    tmpArray.push(this.totalCoolingLoss);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("fixture");
    tmpArray.push(this.totalFixtureLoss);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("leakage");
    tmpArray.push(this.totalLeakageLoss);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("extSurface");
    tmpArray.push(this.totalExtSurfaceLoss);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("exGasEAF");
    tmpArray.push(this.totalExhaustGasEAF);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("exGas");
    tmpArray.push(this.totalExhaustGas);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("sys");
    tmpArray.push(this.totalSystemLosses);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("slag");
    tmpArray.push(this.totalSlag);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("aux");
    tmpArray.push(this.totalAuxPower);
    this.pieChartData.push(tmpArray);

    tmpArray = new Array<any>();
    tmpArray.push("other");
    tmpArray.push(this.totalOtherLoss);
    this.pieChartData.push(tmpArray);
  }

  //insertion sort
  sortPieChartData() {
    let k = this.pieChartData.length;
    for (let i = 0; i < k; i++) {
      let j = i;
      while (j > 0 && this.pieChartData[j - 1][1] < this.pieChartData[j][1]) {
        let tmpA = this.pieChartData[j][0];
        let tmpB = this.pieChartData[j][1];
        this.pieChartData[j][0] = this.pieChartData[j - 1][0];
        this.pieChartData[j][1] = this.pieChartData[j - 1][1];
        this.pieChartData[j - 1][0] = tmpA;
        this.pieChartData[j - 1][1] = tmpB;
        j = j - 1;
      }
    }
  }

  getLossPercent(totalLosses: number, loss: number): number {
    let num = (loss / totalLosses) * 100;
    let percent = this.roundVal(num, 0);
    return percent;
  }
  roundVal(val: number, digits: number) {
    return Number((Math.round(val * 100) / 100).toFixed(digits))
  }

  downloadChart() {
    if (!this.exportName) {
      this.exportName = "phast-report-pie-graph-" + this.chartIndex;
    }
    this.svgToPngService.exportPNG(this.ngChart, this.exportName);
  }
}