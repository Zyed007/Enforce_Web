import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationProfileRoutingModule } from './organization-profile-routing.module';
import { OrganizationProfileComponent } from './organization-profile.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule, MatExpansionModule } from '@angular/material';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import{ GlobalConstants } from '../../global-constants/constants';
@NgModule({
    imports: [CommonModule, 
        OrganizationProfileRoutingModule,
        Select2Module, MaskedTextBoxModule,
        FormsModule, NgbModule,
        ReactiveFormsModule,GridAllModule, ListViewModule,NgxMaterialTimepickerModule,
        MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule,MatExpansionModule,
        AgmCoreModule.forRoot({
            apiKey: GlobalConstants.apiKey,
            libraries: ['places']
          })],
    declarations: [OrganizationProfileComponent]
})
export class OrganizationProfileModule {}
