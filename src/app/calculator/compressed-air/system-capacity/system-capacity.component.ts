import { Component, OnInit } from '@angular/core';
import {StandaloneService} from "../../standalone.service";
import {AirSystemCapacityInput, AirSystemCapacityOutput} from "../../../shared/models/standalone";

@Component({
  selector: 'app-system-capacity',
  templateUrl: './system-capacity.component.html',
  styleUrls: ['./system-capacity.component.css']
})
export class SystemCapacityComponent implements OnInit {

  inputs: AirSystemCapacityInput;
  outputs: AirSystemCapacityOutput;

  constructor() { }

  ngOnInit() {
    this.inputs = {
      receiverCapacities: new Array<number>(),
      oneHalf: 0,
      threeFourths: 0,
      one: 0,
      oneAndOneFourth: 0,
      oneAndOneHalf: 0,
      two: 0,
      twoAndOneHalf: 0,
      three: 0,
      threeAndOneHalf: 0,
      four: 0,
      five: 0,
      six: 0,
    };
    this.inputs.receiverCapacities.push(0);
    this.outputs = {
      receiverCapacities: new Array<number>(),
      oneHalf: 0,
      threeFourths: 0,
      one: 0,
      oneAndOneFourth: 0,
      oneAndOneHalf: 0,
      two: 0,
      twoAndOneHalf: 0,
      three: 0,
      threeAndOneHalf: 0,
      four: 0,
      five: 0,
      six: 0,
      totalPipeVolume: 0,
      totalReceiverVolume: 0,
      totalCapacityOfCompressedAirSystem: 0
    };
  }

  getTotalPipeVolume() {
    this.outputs = StandaloneService.airSystemCapacity(this.inputs);
    console.log(this.outputs);
    return this.outputs.totalPipeVolume;
  }
}
