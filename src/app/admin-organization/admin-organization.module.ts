import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminOrganizationRoutingModule } from './admin-organization-routing.module';
import { AdminOrganizationComponent } from './admin-organization.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AdminHeaderComponent } from './adminHeader/adminHeader.component';
import { AdminFooterComponent } from './adminFooter/adminFooter.component';
import { MatSidenavModule, MatListModule } from '@angular/material';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MenuModule } from '@syncfusion/ej2-angular-navigations';
import { SidebarModule,TreeViewModule  } from '@syncfusion/ej2-angular-navigations';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AdminOrganizationRoutingModule,
    TreeViewModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatListModule,
    DatePickerModule,
    MenuModule,
    SidebarModule
  ],
  declarations: [
    AdminOrganizationComponent,
    AdminHeaderComponent,
    AdminFooterComponent
  ]
})
export class AdminOrganizationModule {}
