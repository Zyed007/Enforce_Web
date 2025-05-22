import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadContactRoleRoutingModule } from './lead-contact-role-routing.module';
import { LeadContactRoleComponent } from './lead-contact-role.component';
import { PageHeaderModule } from './../../shared';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridAllModule, PagerModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
    imports: [CommonModule,MatTableModule,PagerModule,GridAllModule,MatSortModule,MatToolbarModule,MatFormFieldModule,MatInputModule, LeadContactRoleRoutingModule,PageHeaderModule,Select2Module, FormsModule, ReactiveFormsModule ],
    declarations: [LeadContactRoleComponent]
})
export class LeadContactRoleModule {}
