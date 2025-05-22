import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryComponent } from './inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CheckBoxModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotFoundModule } from '../components/not-found/not-found.module';
import {
    MatTableModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
} from "@angular/material";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        InventoryRoutingModule,
        GridAllModule,
        ReactiveFormsModule,
        SelectDropDownModule,
        DropDownListModule,
        DatePickerModule,
        RadioButtonModule,
        CheckBoxModule,
        MultiSelectModule,
        NgxIntlTelInputModule, NotFoundModule,    MatTableModule,
        MatSortModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        NgbModule,
        UploaderModule
    ],
    declarations: [InventoryComponent]
})
export class InventoryModule { }
