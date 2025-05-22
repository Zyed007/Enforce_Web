import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminOrganizationComponent } from './admin-organization.component';
import { AuthGuard } from '../shared';

const routes: Routes = [
    {
      path: '',
      component: AdminOrganizationComponent,
      canActivate: [AuthGuard],
      children:[
        {path:'',loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsComponentModule),canActivate: [AuthGuard] },
        { path: 'organizations', loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsComponentModule),canActivate: [AuthGuard]  },
        { path: 'organization-profile', loadChildren: () => import('./organization-profile/organization-profile.module').then(m => m.OrganizationProfileModule),canActivate: [AuthGuard]  },
        { path: 'organization-profile/:id', loadChildren: () => import('./organization-form/organization-form.module').then(m => m.OrganizationFormModule),canActivate: [AuthGuard]  },
        { path: 'plan', loadChildren: () => import('./plan/plan.module').then(m => m.PlanComponentModule),canActivate: [AuthGuard]  },
        { path: 'feature', loadChildren: () => import('./feature/feature.module').then(m => m.FeatureComponentModule),canActivate: [AuthGuard]  },
        { path: 'price', loadChildren: () => import('./price/price.module').then(m => m.PriceComponentModule),canActivate: [AuthGuard]  },
        { path: 'choose-plan', loadChildren: () => import('./choose-plan/choose-plan.module').then(m => m.ChoosePlanModule),canActivate: [AuthGuard]  },

        //new Setup routes
        { path: 'organization-overview', loadChildren: () => import('./app-organization-overview/app-organization-overview.module').then(m => m.AppOrganizationOverviewModule),canActivate: [AuthGuard] },
        { path: 'organization-notification', loadChildren: () => import('./app-sup-admin-notification/app-sup-admin-notification.module').then(m => m.AppSupAdminNotificationModule),canActivate: [AuthGuard] },
        {
          path: 'delegate-User',
          loadChildren: () => import('./delegate-user/delegate-user.module').then(m => m.DelegateUserModule),canActivate: [AuthGuard] 
        }
      ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminOrganizationRoutingModule {}



