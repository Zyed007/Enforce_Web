import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizeProfileRoutingModule } from './organize-profile-routing.module';
import { OrganizeProfileComponent } from './organize-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, OrganizeProfileRoutingModule,FormsModule, ReactiveFormsModule],
    declarations: [OrganizeProfileComponent]
})
export class OrganizeProfileModule {}
