import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnerComponent } from './owner.component';
import { AuthGuard } from '../shared';

const routes: Routes = [
  {
    path: '',
    component: OwnerComponent,
    canActivate: [AuthGuard],
    children:[
      { path:'',loadChildren: () => import('./owner-dashboard/owner-dashboard.module').then(m => m.OwnerDashboardComponentModule),canActivate: [AuthGuard] },
      { path:'oDashboard',loadChildren: () => import('./owner-dashboard/owner-dashboard.module').then(m => m.OwnerDashboardComponentModule),canActivate: [AuthGuard] },
      { path: 'oOrganization', loadChildren: () => import('./owner-org/owner-org.module').then(m => m.OwnerOrgComponentModule),canActivate: [AuthGuard] },
      { path: 'oSettings', loadChildren: () => import('./owner-settings/owner-settings.module').then(m => m.OwnerSettingsComponentModule),canActivate: [AuthGuard]  }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ownerRoutingModule {}



