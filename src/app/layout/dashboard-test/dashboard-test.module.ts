import { NgModule } from "@angular/core";
import { DashboardTestComponent } from './dashboard-test.component';
import { DashboardTestRoutingModule } from './dashboard-test-routing.module';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from '@angular/common';
import { GridAllModule, PagerModule } from "@syncfusion/ej2-angular-grids";
import { NotFoundModule } from '../components/not-found/not-found.module';
import {
    MatTableModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
  } from "@angular/material";

@NgModule({
    imports:[
        DashboardTestRoutingModule,
        NgbModule,
        CommonModule,
        GridAllModule,
        PagerModule,
        MatTableModule,
        MatSortModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        NotFoundModule
    ],
    declarations: [
        DashboardTestComponent,
      ],
})

export class DashboardTestModule { }


