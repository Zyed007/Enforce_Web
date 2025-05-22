import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsNewComponent } from './settings-new.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { TeamsComponent } from './teams/teams.component';
import { LeaveManagementComponent } from './leave-management/leave-management.component';
import { CaseTypeComponent } from './case-type/case-type.component';
import { OpenBalanceComponent } from './open-balance/open-balance.component';



const routes: Routes = [
    {
        path: '',
        component: SettingsNewComponent
    },
    {
        path: 'team-members',
        component: TeamMembersComponent
    },
    // {
    //     path: 'payroll',
    //     component: PayrollComponent
    // },
    {
        path: 'teams',
        component: TeamsComponent
    },
    {
        path: 'leave-mgt',
        component: LeaveManagementComponent
    },
    {
        path: 'case-type',
        component: CaseTypeComponent
    },
    {
        path: 'open-bal',
        component: OpenBalanceComponent
    },
    {
        path: 'payment',
        // component: PaymentSettingComponent
        loadChildren: () => import('./payment/payment.module').then(m => m.paymentModule)
    },
    {
        path: 'estimation',
        loadChildren: () => import('./estimation/estimation.module').then(m => m.estimationSettingModule)
    },
    {
        path: 'commission',
        loadChildren: () => import('./commission/commission.module').then(m => m.commissionSettingModule)
    },
    {
        path: 'vendor',
        loadChildren: () => import('./vendors/vendor.module').then(m => m.vendorModule)
    },
    {
        path: 'project',
        loadChildren: () => import('./project/project.module').then(m => m.projectSettingModule)
    },
    {
        path: 'payroll',
        loadChildren: () => import('./payroll/payroll.module').then(m => m.payrollSettingModule)
    },
    {
        path: 'finance',
        loadChildren: () => import('./finance/finance.module').then(m => m.financeSettingModule)
    },
    {
        path: 'payment-mode',
        loadChildren: () => import('./payment-mode/payment-mode.module').then(m => m.paymentModeModule)
    },
    {
        path: 'hr-setting',
        loadChildren: () => import('./hr-setting/hr-setting.module').then(m => m.hrSettingModule)
    },
    {
        path: 'asset-setting',
        loadChildren: () => import('./asset-setting/asset-setting.module').then(m => m.AssetSettingModule)
    },
  {
    path: '',
    component: SettingsNewComponent
  },
  {
    path: 'team-members',
    component: TeamMembersComponent
  },
  // {
  //     path: 'payroll',
  //     component: PayrollComponent
  // },
  {
    path: 'teams',
    component: TeamsComponent
  },
  {
    path: 'leave-mgt',
    component: LeaveManagementComponent
  },
  {
    path: 'case-type',
    component: CaseTypeComponent
  },
  {
    path: 'open-bal',
    component: OpenBalanceComponent
  },
  {
    path: 'payment',
    // component: PaymentSettingComponent
    loadChildren: () => import('./payment/payment.module').then(m => m.paymentModule)
  },
  {
    path: 'estimation',
    loadChildren: () => import('./estimation/estimation.module').then(m => m.estimationSettingModule)
  },
  {
    path: 'commission',
    loadChildren: () => import('./commission/commission.module').then(m => m.commissionSettingModule)
  },
  {
    path: 'vendor',
    loadChildren: () => import('./vendors/vendor.module').then(m => m.vendorModule)
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then(m => m.projectSettingModule)
  },
  {
    path: 'payroll',
    loadChildren: () => import('./payroll/payroll.module').then(m => m.payrollSettingModule)
  },
  {
    path: 'finance',
    loadChildren: () => import('./finance/finance.module').then(m => m.financeSettingModule)
  },
  {
    path: 'travel',
    loadChildren: () => import('./travel/travel.module').then(m => m.travelModule)
  },
  {
    path: 'payment-mode',
    loadChildren: () => import('./payment-mode/payment-mode.module').then(m => m.paymentModeModule)
  },
  {
    path: 'hr-setting',
    loadChildren: () => import('./hr-setting/hr-setting.module').then(m => m.hrSettingModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsNewRoutingModule { }
