import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureRoutingModule } from './feature-routing.module';
import { FeatureComponent } from './feature.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';


@NgModule({
    imports: [CommonModule, FeatureRoutingModule,NgbModule,Select2Module,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule,Select2Module,FormsModule, ReactiveFormsModule],
    declarations: [FeatureComponent]
})
export class FeatureComponentModule {}
