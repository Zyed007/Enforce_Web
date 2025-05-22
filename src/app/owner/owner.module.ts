import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ownerRoutingModule } from './owner-routing.module';
import { OwnerComponent } from './owner.component';
import { OwnerHearderComponent } from './owner-hearder/owner-hearder.component';
import { OwnerSidenavComponent } from './owner-sidenav/owner-sidenav.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';


import { SidebarModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ownerRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    SidebarModule,
    TreeViewModule
  ],
  declarations: [
    OwnerComponent,
    OwnerHearderComponent,
    OwnerSidenavComponent
  ]
})
export class ownerModule {}
