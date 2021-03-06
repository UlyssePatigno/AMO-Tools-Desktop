import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PumpCurveComponent } from './pump-curve.component';
import { PumpCurveDataFormComponent } from './pump-curve-data-form/pump-curve-data-form.component';
import { PumpCurveEquationFormComponent } from './pump-curve-equation-form/pump-curve-equation-form.component';
import { PumpCurveFormComponent } from './pump-curve-form/pump-curve-form.component';
import { PumpCurveGraphComponent } from './pump-curve-graph/pump-curve-graph.component';
import { PumpCurveHelpComponent } from './pump-curve-help/pump-curve-help.component';
import { PumpCurveService } from './pump-curve.service';
import { SharedModule } from '../../../shared/shared.module';
import { SystemCurveModule } from '../system-curve/system-curve.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SystemCurveModule
  ],
  declarations: [
    PumpCurveComponent,
    PumpCurveDataFormComponent,
    PumpCurveEquationFormComponent,
    PumpCurveFormComponent,
    PumpCurveGraphComponent,
    PumpCurveHelpComponent,
  ],
  exports: [
    PumpCurveComponent
  ],
  providers: [
    PumpCurveService
  ]
})
export class PumpCurveModule { }
