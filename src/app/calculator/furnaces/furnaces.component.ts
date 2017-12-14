import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { StandaloneService } from '../standalone.service';

@Component({
  selector: 'app-furnaces',
  templateUrl: './furnaces.component.html',
  styleUrls: ['./furnaces.component.css']
})
export class FurnacesComponent implements OnInit {
  selectedTool: string;

  firstChange: boolean = true;
  constructor(private standaloneService: StandaloneService) { }

  ngOnInit() {
    // if (!this.selectedTool) {
    //   this.selectedTool = 'none';
    // }
    this.standaloneService.furnaceTab.subscribe(val => {
      this.selectedTool = val;
    })
  }

  changeCalcTab(str: string){
    this.standaloneService.furnaceTab.next(str);
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
