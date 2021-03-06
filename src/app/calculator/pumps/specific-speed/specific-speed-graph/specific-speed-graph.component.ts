import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef, HostListener } from '@angular/core';
import { PsatService } from '../../../../psat/psat.service';
import { graphColors } from '../../../../phast/phast-report/report-graphs/graphColors';
import * as d3 from 'd3';
import { FormGroup } from '@angular/forms';
import { SvgToPngService } from '../../../../shared/svg-to-png/svg-to-png.service';

var tableEfficiencyCorrection: number;
var tableSpecificSpeed: number;

@Component({
  selector: 'app-specific-speed-graph',
  templateUrl: './specific-speed-graph.component.html',
  styleUrls: ['./specific-speed-graph.component.css']
})
export class SpecificSpeedGraphComponent implements OnInit {
  @Input()
  speedForm: FormGroup;

  @ViewChild("ngChartContainer") ngChartContainer: ElementRef;
  @ViewChild("ngChart") ngChart: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeGraph();
  }
  exportName: string;

  svg: any;
  xAxis: any;
  yAxis: any;
  x: any;
  y: any;
  width: any;
  height: any;
  margin: any;
  line: any;
  filter: any;
  detailBox: any;
  tooltipPointer: any;
  // pointer: any;
  calcPoint: any;
  focus: any;
  isGridToggled: boolean;

  //dynamic table variables
  d: any;
  focusD: Array<any>;
  // x: any;
  // y: any;
  curveChanged: boolean = false;
  graphColors: Array<string>;
  tableData: Array<{ borderColor: string, fillColor: string, specificSpeed: string, efficiencyCorrection: string }>;
  tablePoints: Array<any>;
  deleteCount: number;


  firstChange: boolean = true;

  canvasWidth: number;
  canvasHeight: number;

  //booleans for tooltip
  hoverBtnExport: boolean = false;
  displayExportTooltip: boolean = false;
  hoverBtnGridLines: boolean = false;
  displayGridLinesTooltip: boolean = false;
  hoverBtnExpand: boolean = false;
  displayExpandTooltip: boolean = false;
  hoverBtnCollapse: boolean = false;
  displayCollapseTooltip: boolean = false;

  //add this boolean to keep track if graph has been expanded
  expanded: boolean = false;

  @Input()
  toggleCalculate: boolean;
  // specificSpeed: number = 0;
  // efficiencyCorrection: number = 0;
  constructor(private psatService: PsatService, private svgToPngService: SvgToPngService) { }

  ngOnInit() {
    this.deleteCount = 0;
    this.graphColors = graphColors;
    this.tableData = new Array<{ borderColor: string, fillColor: string, specificSpeed: string, efficiencyCorrection: string }>();
    this.tablePoints = new Array<any>();
    this.focusD = new Array<any>();
    this.curveChanged = false;

    this.isGridToggled = false;

    d3.select('app-specific-speed').selectAll('#gridToggleBtn')
      .on("click", () => {
        this.toggleGrid();
      });
  }

  ngAfterViewInit() {
    this.resizeGraph();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.firstChange) {
      if (changes.toggleCalculate) {
        if (this.checkForm()) {
          this.makeGraph();
          this.svg.style("display", null);
        }
      }
    } else {
      this.firstChange = false;
    }
  }

  // ========== export/gridline tooltip functions ==========
  // if you get a large angular error, make sure to add SimpleTooltipComponent to the imports of the calculator's module
  // for example, check motor-performance-graph.module.ts
  initTooltip(btnType: string) {

    if (btnType == 'btnExportChart') {
      this.hoverBtnExport = true;
    }
    else if (btnType == 'btnGridLines') {
      this.hoverBtnGridLines = true;
    }
    else if (btnType == 'btnExpandChart') {
      this.hoverBtnExpand = true;
    }
    else if (btnType == 'btnCollapseChart') {
      this.hoverBtnCollapse = true;
    }
    setTimeout(() => {
      this.checkHover(btnType);
    }, 700);
  }

  hideTooltip(btnType: string) {

    if (btnType == 'btnExportChart') {
      this.hoverBtnExport = false;
      this.displayExportTooltip = false;
    }
    else if (btnType == 'btnGridLines') {
      this.hoverBtnGridLines = false;
      this.displayGridLinesTooltip = false;
    }
    else if (btnType == 'btnExpandChart') {
      this.hoverBtnExpand = false;
      this.displayExpandTooltip = false;
    }
    else if (btnType == 'btnCollapseChart') {
      this.hoverBtnCollapse = false;
      this.displayCollapseTooltip = false;
    }
  }

  checkHover(btnType: string) {
    if (btnType == 'btnExportChart') {
      if (this.hoverBtnExport) {
        this.displayExportTooltip = true;
      }
      else {
        this.displayExportTooltip = false;
      }
    }
    else if (btnType == 'btnGridLines') {
      if (this.hoverBtnGridLines) {
        this.displayGridLinesTooltip = true;
      }
      else {
        this.displayGridLinesTooltip = false;
      }
    }
    else if (btnType == 'btnExpandChart') {
      if (this.hoverBtnExpand) {
        this.displayExpandTooltip = true;
      }
      else {
        this.displayExpandTooltip = false;
      }
    }
    else if (btnType == 'btnCollapseChart') {
      if (this.hoverBtnCollapse) {
        this.displayCollapseTooltip = true;
      }
      else {
        this.displayCollapseTooltip = false;
      }
    }
  }
  // ========== end tooltip functions ==========

  resizeGraph() {
    //need to update curveGraph to grab a new containing element 'panelChartContainer'
    //make sure to update html container in the graph component as well
    let curveGraph = this.ngChartContainer.nativeElement;

    if (curveGraph) {
      //conditional sizing if graph is expanded/compressed
      if (!this.expanded) {
        this.canvasWidth = curveGraph.clientWidth;
        this.canvasHeight = this.canvasWidth * (3 / 5);
      }
      else {
        this.canvasWidth = curveGraph.clientWidth;
        this.canvasHeight = curveGraph.clientHeight * 0.9;
      }

      if (this.canvasWidth < 400) {
        this.margin = { top: 10, right: 35, bottom: 50, left: 50 };
      } else {
        this.margin = { top: 20, right: 45, bottom: 75, left: 95 };
      }
      this.width = this.canvasWidth - this.margin.left - this.margin.right;
      this.height = this.canvasHeight - this.margin.top - this.margin.bottom;
      d3.select("app-specific-speed").select("#gridToggle").style("top", (this.height + 100) + "px");

      if (this.checkForm()) {
        this.makeGraph();
      }
    }
  }

  getEfficiencyCorrection() {
    if (this.checkForm()) {
      return this.psatService.achievableEfficiency(this.speedForm.controls.pumpType.value, this.getSpecificSpeed());
    } else {
      return 0;
    }
  }

  getSpecificSpeed(): number {
    if (this.checkForm()) {
      return this.speedForm.controls.pumpRPM.value * Math.pow(this.speedForm.controls.flowRate.value, 0.5) / Math.pow(this.speedForm.controls.head.value, .75);
    } else {
      return 0;
    }
  }

  checkForm() {
    if (
      this.speedForm.controls.pumpType.status == 'VALID' &&
      this.speedForm.controls.flowRate.status == 'VALID' &&
      this.speedForm.controls.head.status == 'VALID' &&
      this.speedForm.controls.pumpRPM.status == 'VALID' &&
      this.speedForm.controls.pumpType.value != 'Specified Optimal Efficiency'
    ) {
      return true;
    } else {
      return false;
    }
  }

  makeGraph() {
    if (this.height > 0 && this.width > 0) {
      //Remove  all previous graphs
      d3.select(this.ngChart.nativeElement).selectAll('svg').remove();

      this.svg = d3.select(this.ngChart.nativeElement).append('svg')
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

      // filters go in defs element
      var defs = this.svg.append("defs");

      // create filter with id #drop-shadow
      // height=130% so that the shadow is not clipped
      this.filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "130%");

      // SourceAlpha refers to opacity of graphic that this filter will be applied to
      // convolve that with a Gaussian with standard deviation 3 and store result
      // in blur
      this.filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 3)
        .attr("result", "blur");

      // translate output of Gaussian blur to the right and downwards with 2px
      // store result in offsetBlur
      this.filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("result", "offsetBlur");

      // overlay original SourceGraphic over translated blurred opacity by using
      // feMerge filter. Order of specifying inputs is important!
      var feMerge = this.filter.append("feMerge");

      feMerge.append("feMergeNode")
        .attr("in", "offsetBlur");
      feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

      this.svg.append('rect')
        .attr("id", "graph")
        .attr("width", this.width)
        .attr("height", this.height)
        .style("fill", "#F8F9F9")
        .style("filter", "url(#drop-shadow)");

      this.x = d3.scaleLog()
        .range([0, this.width])
        .domain([100, 100000]);

      this.y = d3.scaleLinear()
        .range([this.height, 0])
        .domain([0, 6]);

      if (this.isGridToggled) {
        this.xAxis = d3.axisBottom()
          .scale(this.x)
          .ticks(3)
          .tickFormat(d3.format("d"))
          .tickSize(-this.height);

        this.yAxis = d3.axisLeft()
          .scale(this.y)
          .tickSizeInner(0)
          .tickSizeOuter(0)
          .tickPadding(15)
          .ticks(6)
          .tickSize(-this.width);
      }
      else {
        this.xAxis = d3.axisBottom()
          .scale(this.x)
          .ticks(3)
          .tickFormat(d3.format("d"))
          .tickSize(0);

        this.yAxis = d3.axisLeft()
          .scale(this.y)
          .tickSizeInner(0)
          .tickSizeOuter(0)
          .tickPadding(15)
          .ticks(6)
          .tickSize(0);
      }

      this.xAxis = this.svg.append('g')
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis)
        .style("stroke-width", ".5px")
        .selectAll('text')
        .style("text-anchor", "end")
        .style("font-size", "13px")
        .attr("transform", "rotate(-65) translate(-15, 0)")
        .attr("dy", "12px");


      this.yAxis = this.svg.append('g')
        .attr("class", "y axis")
        .call(this.yAxis)
        .style("stroke-width", ".5px")
        .selectAll('text')
        .style("font-size", "13px");

      var data = [];

      if (this.speedForm.controls.pumpType.value === "Vertical Turbine") {

        for (var i = 1720; i < 16350; i = i + 25) {
          var efficiencyCorrection = this.psatService.achievableEfficiency(this.speedForm.controls.pumpType.value, i);
          if (efficiencyCorrection <= 5.5) {
            data.push({
              x: i,
              y: efficiencyCorrection
            });
          }
        }
      } else {
        for (var i = 680; i < 7300; i = i + 25) {
          var efficiencyCorrection = this.psatService.achievableEfficiency(this.speedForm.controls.pumpType.value, i);
          if (efficiencyCorrection <= 5.5) {
            data.push({
              x: i,
              y: efficiencyCorrection
            });
          }
        }
      }

      this.makeCurve(data);

      this.svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (-60) + "," + (this.height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Efficiency Correction (%)");

      this.svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (this.width / 2) + "," + (this.height - (-70)) + ")")  // centre below axis
        .text("Specific Speed (U.S.)");

      this.calcPoint = this.svg.append("g")
        .attr("class", "focus")
        .style("display", "none")
        .style('pointer-events', 'none');

      this.calcPoint.append("circle")
        .attr("r", 6)
        .style("fill", "none")
        .style("stroke", "#000000")
        .style("stroke-width", "3px");

      // Define the div for the tooltip
      this.detailBox = d3.select(this.ngChart.nativeElement).append("div")
        .attr("id", "detailBox")
        .attr("class", "d3-tip")
        .style("opacity", 0)
        .style('pointer-events', 'none');

      //debug
      this.tooltipPointer = d3.select(this.ngChart.nativeElement).append("div")
        .attr("id", "tooltipPointer")
        .attr("class", "tooltip-pointer")
        .style("opacity", 0)
        .style('pointer-events', 'none');

      const detailBoxWidth = 160;
      const detailBoxHeight = 90;

      // this.pointer = this.svg.append("polygon")
      //   .attr("id", "pointer")
      //   //.attr("points", "0,13, 14,13, 7,-2");
      //   .attr("points", "0,0, 0," + (detailBoxHeight - 2) + "," + detailBoxWidth + "," + (detailBoxHeight - 2) + "," + detailBoxWidth + ", 0," + ((detailBoxWidth / 2) + 12) + ",0," + (detailBoxWidth / 2) + ", -12, " + ((detailBoxWidth / 2) - 12) + ",0")
      //   .style("display", "none")
      //   .style('pointer-events', 'none');

      this.focus = this.svg.append("g")
        .attr("class", "focus")
        .style("display", "none")
        .style('pointer-events', 'none');

      this.focus.append("circle")
        .attr("r", 8)
        .style("fill", "none")
        .style("stroke", "#000000")
        .style("stroke-width", "3px");

      this.focus.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

      var format = d3.format(",.2f");
      var bisectDate = d3.bisector(function (d) { return d.x; }).left;
      this.svg.select('#graph')
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("class", "overlay")
        .attr("fill", "#ffffff")
        .style("filter", "url(#drop-shadow)")
        .on("mouseover", () => {

          this.focus
            .style("display", null)
            .style("opacity", 1)
            .style('pointer-events', 'none');
          // this.pointer
          //   .style("display", null)
          //   .style('pointer-events', 'none');
          this.detailBox
            .style("display", null)
            .style('pointer-events', 'none');

          //debug
          this.tooltipPointer
            .style("display", null)
            .style('pointer-events', 'none');

        })
        .on("mousemove", () => {

          this.focus
            .style("display", null)
            .style("opacity", 1)
            .style('pointer-events', 'none');
          // this.pointer
          //   .style("display", null)
          //   .style('pointer-events', 'none');
          this.detailBox
            .style("display", null)
            .style('pointer-events', 'none');
          this.tooltipPointer
            .style("display", null)
            .style('pointer-events', 'none');

          let x0 = this.x.invert(d3.mouse(d3.event.currentTarget)[0]);
          let i = bisectDate(data, x0, 1);
          if (i >= data.length) {
            i = data.length - 1
          }
          let d0 = data[i - 1];
          let d1 = data[i];

          this.d = x0 - d0.x > d1.x - x0 ? d1 : d0;

          this.focus.attr("transform", "translate(" + this.x(this.d.x) + "," + this.y(this.d.y) + ")");

          // this.pointer.transition()
          //   .style("opacity", 1);

          this.detailBox.transition()
            .style("opacity", 1);

          this.tooltipPointer.transition()
            .style("opacity", 1);

          var detailBoxWidth = 160;
          var detailBoxHeight = 90;

          // this.pointer
          //   .attr("transform", 'translate(' + (this.x(d.x) - (detailBoxWidth / 2)) + ',' + (this.y(d.y) + 27) + ')')
          //   .style("fill", "#ffffff")
          //   .style("filter", "url(#drop-shadow)");

          tableSpecificSpeed = format(this.d.x);
          tableEfficiencyCorrection = format(this.d.y);

          this.detailBox
            .style("padding-right", "10px")
            .style("padding-left", "10px")
            .html(
              "<p><strong><div>Specific Speed: </div></strong><div>" + format(this.d.x) + " " + "</div>" +

              "<strong><div>Efficiency Correction: </div></strong><div>" + format(this.d.y) + " %</div></p>")

            // "<div style='float:left;'>Fluid Power: </div><div style='float: right;'>" + format(d.fluidPower) + " </div></strong></p>")

            .style("left", (this.margin.left + this.x(this.d.x) - (detailBoxWidth / 2 - 17)) - 2 + "px")
            .style("top", (this.margin.top + this.y(this.d.y) + 26) + "px")
            .style("position", "absolute")
            .style("width", detailBoxWidth + "px")
            .style("height", detailBoxHeight + "px")
            .style("padding-left", "10px")
            .style("padding-right", "10px")
            .style("font", "12px sans-serif")
            .style("background", "#ffffff")
            .style("border", "0px")
            .style("box-shadow", "0px 0px 10px 2px grey")
            .style("pointer-events", "none");

          this.tooltipPointer
            .attr("class", "tooltip-pointer")
            .html("<div></div>")
            .style("left", (this.margin.left + this.x(this.d.x)) + 5 + "px")
            .style("top", (this.margin.top + this.y(this.d.y) + 16) + "px")
            .style("position", "absolute")
            .style("width", "0px")
            .style("height", "0px")
            .style("border-left", "10px solid transparent")
            .style("border-right", "10px solid transparent")
            .style("border-bottom", "10px solid white")
            .style('pointer-events', 'none');
        })
        .on("mouseout", () => {
          // this.pointer
          //   .transition()
          //   .delay(100)
          //   .duration(600)
          //   .style("opacity", 0);

          this.detailBox
            .transition()
            .delay(100)
            .duration(600)
            .style("opacity", 0);
          //debug
          // .remove();

          this.tooltipPointer
            .transition()
            .delay(100)
            .duration(600)
            .style("opacity", 0);
          //debug
          // .remove();

          this.focus
            .transition()
            .delay(100)
            .duration(600)
            .style("opacity", 0);
        });

      //dynamic table
      if (!this.curveChanged) {
        this.replaceFocusPoints();
      }
      else {
        this.resetTableData();
      }
      this.curveChanged = false;

      this.drawPoint();

      d3.selectAll("line").style("pointer-events", "none");
    }
  }

  //dynamic table
  buildTable() {
    let i = this.tableData.length + this.deleteCount;
    let borderColorIndex = Math.floor(i / this.graphColors.length);

    let tableFocus = this.svg.append("g")
      .attr("class", "tablePoint")
      .style("display", null)
      .style("opacity", 1)
      .style('pointer-events', 'none');

    tableFocus.append("circle")
      .attr("r", 6)
      .attr("id", "tablePoint-" + this.tablePoints.length)
      .style("fill", this.graphColors[i % this.graphColors.length])
      .style("stroke", this.graphColors[borderColorIndex % this.graphColors.length])
      .style("stroke-width", "3px")
      .style('pointer-events', 'none');

    this.focusD.push(this.d);
    tableFocus.attr("transform", "translate(" + this.x(this.d.x) + "," + this.y(this.d.y) + ")");

    this.tablePoints.push(tableFocus);

    let dataPiece = {
      borderColor: this.graphColors[borderColorIndex % this.graphColors.length],
      fillColor: this.graphColors[i % this.graphColors.length],
      specificSpeed: tableSpecificSpeed.toString(),
      efficiencyCorrection: tableEfficiencyCorrection.toString()
    }
    this.tableData.push(dataPiece);
  }

  //dynamic table
  resetTableData() {
    this.tableData = new Array<{ borderColor: string, fillColor: string, specificSpeed: string, efficiencyCorrection: string }>();
    this.tablePoints = new Array<any>();
    this.focusD = new Array<any>();
    this.deleteCount = 0;

  }

  //dynamic table
  replaceFocusPoints() {

    this.svg.selectAll('.tablePoint').remove();

    for (let i = 0; i < this.tablePoints.length; i++) {

      let tableFocus = this.svg.append("g")
        .attr("class", "tablePoint")
        .style("display", null)
        .style("opacity", 1)
        .style('pointer-events', 'none');

      tableFocus.append("circle")
        .attr("r", 6)
        .attr("id", "tablePoint-" + i)
        .style("fill", this.tableData[i].fillColor)
        .style("stroke", this.tableData[i].borderColor)
        .style("stroke-width", "3px")
        .style('pointer-events', 'none');

      tableFocus.attr("transform", "translate(" + this.x(this.focusD[i].x) + "," + this.y(this.focusD[i].y) + ")");
    }
  }

  deleteFromTable(i: number) {

    for (let j = i; j < this.tableData.length - 1; j++) {
      this.tableData[j] = this.tableData[j + 1];
      this.tablePoints[j] = this.tablePoints[j + 1];
      this.focusD[j] = this.focusD[j + 1];
    }

    if (i != this.tableData.length - 1) {
      this.deleteCount += 1;
    }

    this.tableData.pop();
    this.tablePoints.pop();
    this.focusD.pop();
    this.replaceFocusPoints();
  }

  highlightPoint(i: number) {
    let x = this.x;
    let y = this.y;
    var highlightedPoint = this.svg.select('#tablePoint-' + i)
      .attr('r', 8);

    repeat();

    function repeat() {
      let tempXPos = (Math.random() * (2 - (0)) + (0)) - 1;
      let tempYPos = (Math.random() * (2 - (0)) + (0)) - 1;

      highlightedPoint.transition()
        .ease(d3.easeBounce)
        .duration(50)
        .attr("transform", "translate(" + tempXPos + "," + tempYPos + ")")
        .on('end', repeat);
    }
  }

  unhighlightPoint(i: number) {
    this.svg.select('#tablePoint-' + i).interrupt().attr('r', 6);
    this.replaceFocusPoints();
  }

  drawPoint() {
    var specificSpeed = this.psatService.roundVal(this.getSpecificSpeed(), 3);
    var efficiencyCorrection = this.psatService.achievableEfficiency(this.speedForm.controls.pumpType.value, specificSpeed);

    this.calcPoint
      .attr("transform", () => {

        if (this.y(efficiencyCorrection) >= 0) {
          return "translate(" + this.x(specificSpeed) + "," + this.y(efficiencyCorrection) + ")";
        }

      })
      .style("display", () => {

        if (this.speedForm.controls.pumpType.value === "Vertical Turbine") {
          if (specificSpeed >= 1720 && specificSpeed <= 16350) {
            return null;
          } else {
            return "none";
          }
        } else {
          if (specificSpeed >= 680 && specificSpeed <= 7300) {
            return null;
          } else {
            return "none";
          }
        }

      });

    this.svg.append("text")
      .attr("x", "20")
      .attr("y", "20")
      .text("Specific Speed: " + specificSpeed)
      .style("font-size", "13px")
      .style("font-weight", "bold");

    this.svg.append("text")
      .attr("x", this.width - 200)
      .attr("y", "20")
      .text("Efficiency Correction: " + efficiencyCorrection + ' %')
      .style("font-size", "13px")
      .style("font-weight", "bold");

  }

  toggleGrid() {
    if (this.isGridToggled) {
      this.isGridToggled = false;
      this.makeGraph();
    }
    else {
      this.isGridToggled = true;
      this.makeGraph();
    }
  }

  makeCurve(data) {

    var guideLine = d3.line()
      .x((d) => { return this.x(d.x); })
      .y((d) => { return this.y(d.y); })
      .curve(d3.curveNatural);

    this.svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", guideLine)
      .style("stroke-width", 10)
      .style("stroke-width", "2px")
      .style("fill", "none")
      .style("stroke", "#145A32")
      .style('pointer-events', 'none');
  }

  downloadChart() {
    if (!this.exportName) {
      this.exportName = "specific-speed-graph";
    }
    this.svgToPngService.exportPNG(this.ngChart, this.exportName);
  }

  //========= chart resize functions ==========
  expandChart() {
    this.expanded = true;
    this.hideTooltip('btnExpandChart');
    this.hideTooltip('btnCollapseChart');
    setTimeout(() => {
      this.resizeGraph();
    }, 200);
  }

  contractChart() {
    this.expanded = false;
    this.hideTooltip('btnExpandChart');
    this.hideTooltip('btnCollapseChart');
    setTimeout(() => {
      this.resizeGraph();
    }, 200);
  }
  //========== end chart resize functions ==========

}
