import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanRoutingModule } from './plan-routing.module';
import { PlanComponent } from './plan.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';


@NgModule({
    imports: [CommonModule, PlanRoutingModule,NgbModule,Select2Module,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule,Select2Module,FormsModule, ReactiveFormsModule],
    declarations: [PlanComponent]
})
export class PlanComponentModule {}
