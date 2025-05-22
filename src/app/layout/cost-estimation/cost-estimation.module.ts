import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostEstimationNewRoutingModule } from './cost-estimation-routing.module';
import { CostEstimationComponent } from './cost-estimation.component';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { MatExpansionModule } from '@angular/material/expansion';
import { NotFoundModule } from '../components/not-found/not-found.module';

@NgModule({
    imports: [
      CostEstimationNewRoutingModule,
      CommonModule,
      NotFoundModule,
      GridAllModule,
      FormsModule,
      ReactiveFormsModule,
      DropDownListModule,
      RadioButtonModule,
      MatExpansionModule,
      MultiSelectModule,
      NgbModule
    ],
    declarations: [
      CostEstimationComponent
    ]
})
export class CostEstimationModule {}
