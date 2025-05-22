import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MilestoneTemplateRoutingModule } from './milestone-template-routing.module';
import { MilestoneTemplateComponent } from './milestone-template.component';
import { PageHeaderModule } from './../../shared';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [CommonModule,GridAllModule,PagerModule,NgxIntlTelInputModule,DatePickerModule,MatTableModule,MatSortModule,MatToolbarModule,MatFormFieldModule,MatInputModule, MilestoneTemplateRoutingModule,PageHeaderModule,Select2Module, FormsModule, ReactiveFormsModule ],
    declarations: [MilestoneTemplateComponent]
})
export class MilestoneTemplateModule {}
