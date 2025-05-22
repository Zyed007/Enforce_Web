import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommissionRoutingModule } from './commission-routing.module';
import { CommissionComponent } from './commission.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule,MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSortModule, MatButtonToggleModule } from '@angular/material';
import { MatTableExporterModule } from 'mat-table-exporter';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePickerModule,DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { NotFoundModule } from '../components/not-found/not-found.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';

@NgModule({
    imports: [CommonModule,GridAllModule,NotFoundModule,DateRangePickerModule,NgbModule,DropDownListModule,MultiSelectModule,MatTableExporterModule,MatButtonToggleModule,NgxPaginationModule,DatePickerModule, CommissionRoutingModule,MatPaginatorModule,MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule,FormsModule, ReactiveFormsModule, TabModule,
      MatProgressBarModule,
      RadioButtonModule,
      MatProgressSpinnerModule,
      MatIconModule,
      CheckBoxModule,
      MatDialogModule,
      NgxIntlTelInputModule,
      SwitchModule,
      UploaderModule
    ],
    declarations: [
      CommissionComponent
    ]
})
export class CommissionModule {}
