import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationsRoutingModule } from './organizations-routing.module';
import { OrganizationsComponent } from './organizations.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [CommonModule, OrganizationsRoutingModule,NgbModule, Select2Module, 
        FormsModule, 
        ReactiveFormsModule, ],
    declarations: [OrganizationsComponent]
})
export class OrganizationsComponentModule {}
