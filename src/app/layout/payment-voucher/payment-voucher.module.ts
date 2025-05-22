import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentVoucherComponent } from './payment-voucher.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import {NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MenuModule } from '@syncfusion/ej2-angular-navigations';
import { SidebarModule,TreeViewModule  } from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';
import { CheckBoxModule, RadioButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { TabModule } from "@syncfusion/ej2-angular-navigations";
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { MatTabsModule } from '@angular/material';
@NgModule({
  declarations: [PaymentVoucherComponent], 
  exports: [PaymentVoucherComponent], 
  imports: [CommonModule,ReactiveFormsModule,DatePickerModule,MenuModule,SidebarModule,DropDownListModule,UploaderModule,SwitchModule,RadioButtonModule,CheckBoxModule,GridAllModule,MatTabsModule,TabModule], 
})
export class PaymentVoucherModule {}
