import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppOrganizationOverviewComponent } from './app-organization-overview.component';
import { AppProfileComponent } from './app-profile/app-profile.component';

const routes: Routes = [
  {
    path: '',
    component: AppOrganizationOverviewComponent,
  },
  {
    path: 'organization-profile',
    component: AppProfileComponent,
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppOrganizationOverviewRoutingModule {}



