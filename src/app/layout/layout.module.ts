import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import {NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProjectStatusComponent } from './project-status/project-status.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MenuModule } from '@syncfusion/ej2-angular-navigations';
import { SidebarModule,TreeViewModule  } from '@syncfusion/ej2-angular-navigations';
import { GratuityComponent } from './gratuity/gratuity.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';
import { CheckBoxModule, RadioButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { PaymentComponent } from './payment/payment.component';
import { TabModule } from "@syncfusion/ej2-angular-navigations";
import {
    GridAllModule,
    SearchService,
    ToolbarService,
  } from "@syncfusion/ej2-angular-grids";
  import { MatTabsModule } from "@angular/material/tabs";
import { PaymentVoucherModule } from './payment-voucher/payment-voucher.module';
// import { PaymentVoucherComponent } from './payment-voucher/payment-voucher.component';
@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbModule,
        NgbDropdownModule,
        FormsModule,
        ReactiveFormsModule,
        TreeViewModule,
        FormsModule, ReactiveFormsModule,DatePickerModule,MenuModule,SidebarModule,DropDownListModule,UploaderModule,SwitchModule,RadioButtonModule,CheckBoxModule,GridAllModule,MatTabsModule,TabModule,
        PaymentVoucherModule
    ],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent,FooterComponent, ProjectStatusComponent,GratuityComponent,PaymentComponent],
    exports: [GratuityComponent],
      providers: [DatePipe, SearchService, ToolbarService],
})
export class LayoutModule {}


