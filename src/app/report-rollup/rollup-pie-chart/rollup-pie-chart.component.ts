import { Component, OnInit, Input, ViewChild, SimpleChanges, ElementRef } from '@angular/core';
import { ReportRollupService, PhastResultsData } from '../report-rollup.service';
import { ConvertUnitsService } from '../../shared/convert-units/convert-units.service';
import { Settings } from 'electron';
import { graphColors, grayScaleGraphColors } from '../../phast/phast-report/report-graphs/graphColors';
import { SigFigsPipe } from '../../shared/sig-figs.pipe';
import { SvgToPngService } from '../../shared/svg-to-png/svg-to-png.service';
import * as d3 from 'd3';
import * as c3 from 'c3';
@Component({
  selector: 'app-rollup-pie-chart',
  templateUrl: './rollup-pie-chart.component.html',
  styleUrls: ['./rollup-pie-chart.component.css']
})
export class RollupPieChartComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  results: Array<any>;
  @Input()
  graphColors: Array<string>;
  @Input()
  isUpdate: boolean;
  @Input()
  showLegend: boolean;
  @Input()
  labels: boolean;
  @Input()
  chartContainerWidth: number;
  @Input()
  printView: boolean;
  @Input()
  title: string;
  @Input()
  showTitle: boolean;
  @Input()
  chartIndex: number;
  @Input()
  assessmentType: string;

  chartContainerHeight: number;

  legendPadding: number;
  legendTileHeight: number;
  legendTileWidth: number;

  @ViewChild("ngChart") ngChart: ElementRef;
  @ViewChild('btnDownload') btnDownload: ElementRef;
  exportName: string;

  pieChart: any;

  constructor(private svgToPngService: SvgToPngService) { }

  ngOnInit() {
    if (this.printView) {
      this.graphColors = grayScaleGraphColors;
    }
    else {
      this.graphColors = graphColors;
    }
  }

  ngAfterViewInit() {
    if (this.printView) {
      this.chartContainerWidth = 680;
      this.chartContainerHeight = 350;
      this.legendPadding = 5;
      this.legendTileHeight = 25;
      this.legendTileWidth = 50;
    }
    else {
      this.chartContainerHeight = 280;
      this.legendPadding = 0;
      this.legendTileHeight = 13;
      this.legendTileWidth = 20;
    }

    this.initChart();
  }

  ngOnChanges() {
    if (this.isUpdate) {
      this.updateChart();
    }
  }

  initChart() {
    let currentChart;

    if (this.assessmentType == "phast") {
      if (this.printView) {
        this.ngChart.nativeElement.className = "printing-phast-rollup-pie-chart";
      }

    }
    else if (this.assessmentType == "psat") {
      if (this.printView) {
        this.ngChart.nativeElement.className = "printing-psat-rollup-pie-chart";
      }
    }

    this.pieChart = c3.generate({
      bindto: this.ngChart.nativeElement,
      data: {
        columns: [],
        type: 'pie',
        labels: this.labels,
      },
      legend: {
        show: this.showLegend,
        padding: this.legendPadding,
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
    console.log("this.pieChart = " + this.pieChart);

    for (let j = 0; j < this.results.length; j++) {
      this.pieChart.load({
        columns: [
          [this.results[j].name, this.results[j].percent]
        ],
        labels: this.labels
      });
    }

    if (this.printView) {
      //formatting printed chart
      setTimeout(() => {
        // d3.selectAll(".printing-psat-rollup-pie-chart .c3-legend-item text").style("font-size", "13px");
        // d3.selectAll(".printing-phast-rollup-pie-chart .c3-legend-item text").style("font-size", "13px");
        d3.selectAll(".printing-psat-rollup-pie-chart .c3-legend-item text").style("font-size", "1.2rem");
        d3.selectAll(".printing-phast-rollup-pie-chart .c3-legend-item text").style("font-size", "1.2rem");
      }, 500);

    }
  }

  updateChart() {
    if (this.pieChart) {
      for (let i = 0; i < this.results.length; i++) {
        this.pieChart.load({
          columns: [
            [this.results[i].name, this.results[i].percent]
          ],
          type: 'pie',
          labels: this.labels
        });
      }
    }
  }

  downloadChart() {
    if (!this.title) {
      if (this.assessmentType == "phast") {
        this.exportName = "phast-rollup-pie-graph";
      }
      else {
        this.exportName = "psat-rollup-pie-graph";
      }
    }
    else {
      this.exportName = this.title + "-graph";
    }
    this.svgToPngService.exportPNG(this.ngChart, this.exportName);
  }
}
