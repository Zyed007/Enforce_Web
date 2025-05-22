import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectMgtRoutingModule } from './project-mgt-routing.module';
import { ProjectMgtComponent } from './project-mgt.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { AgmCoreModule } from '@agm/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { jqxKanbanModule } from 'jqwidgets-ng/jqxkanban';

import { NotFoundModule } from '../components/not-found/not-found.module';
import { GlobalConstants } from '../../global-constants/constants';

@NgModule({
    imports: [CommonModule ,jqxKanbanModule,ProjectMgtRoutingModule,NgbModule,PagerModule,NotFoundModule,
        Select2Module,MatTableModule,SatPopoverModule,GridAllModule, 
        MatToolbarModule,DatePickerModule, MatFormFieldModule, MatInputModule, NgxIntlTelInputModule,
        MatSortModule,Select2Module,FormsModule, ReactiveFormsModule,  AgmCoreModule.forRoot({
            apiKey: GlobalConstants.apiKey,
            libraries: ['places']
          })],
    declarations: [ProjectMgtComponent]
})
export class ProjectMgtModule {}
