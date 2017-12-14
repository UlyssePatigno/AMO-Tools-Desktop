import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { StandaloneService } from '../standalone.service';


@Component({
  selector: 'app-pumps',
  templateUrl: './pumps.component.html',
  styleUrls: ['./pumps.component.css']
})
export class PumpsComponent implements OnInit {

  selectedTool: string;

  firstChange: boolean = true;
  constructor(private standaloneService: StandaloneService) { }

  ngOnInit() {
    // if (!this.selectedTool) {
    //   this.selectedTool = 'none';
    // }
    this.standaloneService.pumpTab.subscribe(val => {
      this.selectedTool = val;
    })
  }

  changeCalcTab(str: string){
    this.standaloneService.pumpTab.next(str);
  }

  showTool(str: string) {
    this.selectedTool = str;
  }

  hideTool() {
    this.selectedTool = 'none'
  }


  getSelectedTool() {
    if (this.selectedTool != undefined) {
      return this.selectedTool;
    }
  }
}
