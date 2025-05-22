import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MatSidenavModule, MatListModule } from '@angular/material';
import { ProjectHeaderComponent } from './project-header/project-header.component';
import { ProjectFooterComponent } from './project-footer/project-footer.component';
import { ProjectDashboardRoutingModule } from './project-dashboard-routing.module';
import { ProjectDashboardComponent } from './project-dashboard.component';
import { MenuModule } from '@syncfusion/ej2-angular-navigations';
import { SidebarModule,TreeViewModule  } from '@syncfusion/ej2-angular-navigations';

import { GridAllModule } from '@syncfusion/ej2-angular-grids';


@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ProjectDashboardRoutingModule,
    FormsModule, ReactiveFormsModule,MatSidenavModule,MatListModule
,SidebarModule,TreeViewModule,MenuModule,GridAllModule
  ],
    declarations: [ProjectDashboardComponent,ProjectHeaderComponent, ProjectFooterComponent]
})
export class ProjectDashboardModule {}
