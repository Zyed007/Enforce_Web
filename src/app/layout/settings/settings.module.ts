import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { PageHeaderModule } from './../../shared';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { TabModule } from '@syncfusion/ej2-angular-navigations';

import { NotFoundModule } from '../components/not-found/not-found.module';


@NgModule({
    imports: [CommonModule,GridAllModule,TabModule,PagerModule,MatTableModule,MatSortModule,MatToolbarModule,MatFormFieldModule,MatInputModule, SettingsRoutingModule,PageHeaderModule,Select2Module, FormsModule, ReactiveFormsModule,
      NotFoundModule
    ],
    declarations: [SettingsComponent]
})
export class SettingsModule {}
