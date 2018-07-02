import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-bag-method-table',
  templateUrl: './bag-method-table.component.html',
  styleUrls: ['./bag-method-table.component.css']
})
export class BagMethodTableComponent implements OnInit {

  @Input()
  settings: Settings;
  @Input()
  data: { flowRate: number };

  rowData: Array<{ flowRate: number}>;

  //constructor(private steamService: SteamService) { }

  ngOnInit() {
    this.rowData = new Array<{ flowRate: number }>();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && !changes.data.firstChange) {
      this.addRow();
    }
  }

  addRow() {
    if (this.data !== null) {
      this.rowData.push(this.data);
    }
  }

  deleteRow(index: number) {
    this.rowData.splice(index, 1);
  }

  getDisplayUnit(unit: string) {
    return "SCFM";
  }

}
