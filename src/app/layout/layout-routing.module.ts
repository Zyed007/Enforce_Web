import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../shared';
import { PaymentComponent } from './payment/payment.component';


const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
            { path: 'activities', loadChildren: () => import('./activities-view/activities-view.module').then(m => m.ActivitiesViewModule), canActivate: [AuthGuard] },
            { path: 'activities-dashboard', loadChildren: () => import('./activities-dashboard/activities-dashboard.module').then(m => m.ActivitiesDashboardModule), canActivate: [AuthGuard] },
            { path: 'activities-emp', loadChildren: () => import('./activities-emp/activities-emp.module').then(m => m.ActivitiesEmpModule), canActivate: [AuthGuard] },
            { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule), canActivate: [AuthGuard] },
            { path: 'activities-admin', loadChildren: () => import('./activities-admin/activities-admin.module').then(m => m.ActivitiesAdminModule), canActivate: [AuthGuard] },
            { path: 'organize-profile', loadChildren: () => import('./organize-profile/organize-profile.module').then(m => m.OrganizeProfileModule), canActivate: [AuthGuard] },
            { path: 'lead-company', loadChildren: () => import('./lead-company/lead-company.module').then(m => m.LeadCompanyModule) , canActivate: [AuthGuard]},
            { path: 'lead-source', loadChildren: () => import('./lead-source/lead-source.module').then(m => m.LeadSourceModule), canActivate: [AuthGuard] },
            { path: 'lead-rating', loadChildren: () => import('./lead-rating/lead-rating.module').then(m => m.LeadRatingModule), canActivate: [AuthGuard] },
            { path: 'lead-status', loadChildren: () => import('./lead-status/lead-status.module').then(m => m.LeadStatusModule) , canActivate: [AuthGuard]},
            { path: 'task-list', loadChildren: () => import('./task-list/task-list.module').then(m => m. TaskListModule) , canActivate: [AuthGuard]},
            { path: 'package-setup', loadChildren: () => import('./package-setup/package-setup.module').then(m => m. PackageSetupModule), canActivate: [AuthGuard] },
            { path: 'module-setup', loadChildren: () => import('./module-setup/module-setup.module').then(m => m. ModuleSetupModule), canActivate: [AuthGuard] },
            { path: 'workforce', loadChildren: () => import('./workforce/workforce.module').then(m => m. WorkforceModule), canActivate: [AuthGuard] },
            { path: 'emp-team-setup', loadChildren: () => import('./emp-team-setup/emp-team-setup.module').then(m => m.EmpTeamSetupModule), canActivate: [AuthGuard] },
            { path: 'app-track-setup', loadChildren: () => import('./app-track-setup/app-track-setup.module').then(m => m.AppTrackSetupModule), canActivate: [AuthGuard] },
            { path: 'notification-setup', loadChildren: () => import('./notification-setup/notification-setup.module').then(m => m.NotificationSetupModule), canActivate: [AuthGuard] },
            { path: 'notification-type', loadChildren: () => import('./notification-type/notification-type.module').then(m => m.NotificationTypeModule), canActivate: [AuthGuard] },
            { path: 'travels', loadChildren: () => import('./travels/travels.module').then(m => m. TravelsModule), canActivate: [AuthGuard] },
            { path: 'reason-type', loadChildren: () => import('./reason-type/reason-type.module').then(m => m. ReasonTypeModule), canActivate: [AuthGuard] },
            //{ path: 'emp-notification1', loadChildren: () => import('./emp-notification/emp-notification.module').then(m => m.EmpNotificationModule)},
            { path: 'leave-details', loadChildren: () => import('./leave-mgt/leave-mgt.module').then(m => m. LeaveMgtModule), canActivate: [AuthGuard] },
            //{ path: 'team', loadChildren: () => import('./timesheet-mgt/timesheet-mgt.module').then(m => m. TimesheetMgtModule) },
            { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m. SettingsModule), canActivate: [AuthGuard] },
            { path: 'settings-new', loadChildren: () => import('./settings-new/settings-new.module').then(m => m. SettingsNewModule), canActivate: [AuthGuard] },
            { path: 'dashboard-user-old', loadChildren: () => import('./dashboard-user/dashboard-user.module').then(m => m.DashboardUserModule), canActivate: [AuthGuard] },
            { path: 'dashboard-details', loadChildren: () => import('./dashboard-details/dashboard-details.module').then(m => m.DashboardDetailsModule), canActivate: [AuthGuard] },
          //{ path: 'user-controls', loadChildren: () => import('./user-controls/user-controls.module').then(m => m.UserControlsModule) },

        //   { path: 'manage-organization', loadChildren: () => import('./organization-profile/organization-profile.module').then(m => m.OrganizationProfileModule) },
        { path: 'delegation', loadChildren: () => import('./delegation/delegation.module').then(m => m.DelegationModule), canActivate: [AuthGuard] },
        { path: 'departments', loadChildren: () => import('./departments/departments.module').then(m => m.DepartmentsModule), canActivate: [AuthGuard] },
          { path: 'designation', loadChildren: () => import('./designation/designation.module').then(m => m.DesignationModule), canActivate: [AuthGuard] },
          { path: 'task-priority', loadChildren: () => import('./task-priority/task-priority.module').then(m => m.TaskPriorityModule), canActivate: [AuthGuard] },
          { path: 'task-status', loadChildren: () => import('./task-status/task-status.module').then(m => m.TaskStatusModule), canActivate: [AuthGuard] },
          { path: 'employee-status', loadChildren: () => import('./employee-status/employee-status.module').then(m => m.EmployeeStatusModule), canActivate: [AuthGuard] },
          { path: 'employee-type', loadChildren: () => import('./employee-type/employee-type.module').then(m => m.EmployeeTypeModule), canActivate: [AuthGuard] },
          { path: 'industry-type', loadChildren: () => import('./industry-type/industry-type.module').then(m => m.IndustryTypeModule), canActivate: [AuthGuard] },
          { path: 'work-location', loadChildren: () => import('./work-location/work-location.module').then(m => m.WorkLocationModule), canActivate: [AuthGuard] },
          { path: 'leave-type', loadChildren: () => import('./leave-type/leave-type.module').then(m => m.LeaveTypeModule) },
          { path: 'leave-approve', loadChildren: () => import('./approve-empleave/approve-empleave.module').then(m => m.ApproveEmpLeaveModule), canActivate: [AuthGuard] },
          { path: 'timeoff-type', loadChildren: () => import('./timeoff-type/timeoff-type.module').then(m => m.TimeoffTypeModule), canActivate: [AuthGuard] },
          { path: 'leave-setup', loadChildren: () => import('./leave-setup/leave-setup.module').then(m => m.LeaveSetupModule), canActivate: [AuthGuard] },
          { path: 'leave-status', loadChildren: () => import('./leave-status/leave-status.module').then(m => m.LeaveStatusModule), canActivate: [AuthGuard] },
          { path: 'project-type', loadChildren: () => import('./project-type/project-type.module').then(m => m.ProjectTypeModule), canActivate: [AuthGuard] },
          { path: 'administrative', loadChildren: () => import('./administrative/administrative.module').then(m => m.AdministrativeModule), canActivate: [AuthGuard] },
          { path: 'project-old', loadChildren: () => import('./project-mgt/project-mgt.module').then(m => m.ProjectMgtModule), canActivate: [AuthGuard] },
          { path: 'setup', loadChildren: () => import('./setup-dept/setup-dept.module').then(m => m.SetupDeptModule), canActivate: [AuthGuard] },
          { path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule), canActivate: [AuthGuard] },
          { path: 'customer-contact', loadChildren: () => import('./customer-contact/customer-contact.module').then(m => m.CustomerContactModule), canActivate: [AuthGuard] },
          { path: 'contacts', loadChildren: () => import('./contact-list/contact-list.module').then(m => m.ContactListModule), canActivate: [AuthGuard] },
          { path: 'customer-dashboard', loadChildren: () => import('./customer-dashboard/customer-dashboard.module').then(m => m.CustomerDashboardModule), canActivate: [AuthGuard] },
          { path: 'milestone-template', loadChildren: () => import('./milestone-template/milestone-template.module').then(m => m.MilestoneTemplateModule), canActivate: [AuthGuard] },
          { path: 'task-template', loadChildren: () => import('./task-template/task-template.module').then(m => m.TaskTemplateModule), canActivate: [AuthGuard] },
          { path: 'cost-estimate', loadChildren: () => import('./cost-estimate/cost-estimate.module').then(m => m.CostEstimateModule), canActivate: [AuthGuard] },
          { path: 'cost-type-design', loadChildren: () => import('./cost-type-design/cost-type-design.module').then(m => m.CostTypeDesignModule), canActivate: [AuthGuard] },
          { path: 'cost-unit', loadChildren: () => import('./cost-unit/cost-unit.module').then(m => m.CostUnitModule), canActivate: [AuthGuard] },
          { path: 'cost-task-hrs', loadChildren: () => import('./cost-specification/cost-specification.module').then(m => m.CostSpecificationModule), canActivate: [AuthGuard] },
          { path: 'cost-hrs', loadChildren: () => import('./cost-hrs/cost-hrs.module').then(m => m.CostHrsModule), canActivate: [AuthGuard] },
          { path: 'profit-margin', loadChildren: () => import('./profit-margin/profit-margin.module').then(m => m.ProfitMarginModule), canActivate: [AuthGuard] },
          { path: 'deal-type', loadChildren: () => import('./deal-type/deal-type.module').then(m => m.DealTypeModule), canActivate: [AuthGuard] },
          { path: 'contact-role', loadChildren: () => import('./lead-contact-role/lead-contact-role.module').then(m => m.LeadContactRoleModule), canActivate: [AuthGuard] },
          { path: 'role-mgt', loadChildren: () => import('./role-mgt/role-mgt.module').then(m => m.RoleMgtModule), canActivate: [AuthGuard] },
          { path: 'lead-stage', loadChildren: () => import('./lead-stage/lead-stage.module').then(m => m.LeadStageModule), canActivate: [AuthGuard] },
          { path: 'quotation', loadChildren: () => import('./quotation/quotation.module').then(m => m.QuotationModule), canActivate: [AuthGuard] },
          { path: 'quotation-layout', loadChildren: () => import('./quotation-layout/quotation-layout.module').then(m => m.QuotationLayoutModule), canActivate: [AuthGuard] },
          { path: 'prefix', loadChildren: () => import('./prefix/prefix.module').then(m => m.PrefixModule), canActivate: [AuthGuard] },
          { path: 'estimate-prefix', loadChildren: () => import('./estimate-prefix/estimate-prefix.module').then(m => m.EstimatePrefixModule), canActivate: [AuthGuard] },
          { path: 'lead-prefix', loadChildren: () => import('./lead-prefix/lead-prefix.module').then(m => m.LeadPrefixModule), canActivate: [AuthGuard] },
          { path: 'qtn-prefix', loadChildren: () => import('./qtn-prefix/qtn-prefix.module').then(m => m.QtnPrefixModule), canActivate: [AuthGuard] },
          { path: 'activity', loadChildren: () => import('./local-activity/local-activity.module').then(m => m.LocalActivityModule), canActivate: [AuthGuard] },
          { path: 'radius-setup', loadChildren: () => import('./radius-setup/radius-setup.module').then(m => m.RadiusSetupModule), canActivate: [AuthGuard] },
          { path: 'productivity-emp', loadChildren: () => import('./productivity-emp/productivity-emp.module').then(m => m.ProductivityEmpModule), canActivate: [AuthGuard]},
          { path: 'contract-status', loadChildren: () => import('./contract-status/contract-status.module').then(m => m.ContractStatusModule), canActivate: [AuthGuard] },
          { path: 'intfut-estimate', loadChildren: () => import('./intfut-estimate/intfut-estimate.module').then(m => m.IntfutEstimateModule), canActivate: [AuthGuard] },
          { path: 'checkin-approve', loadChildren: () => import('./approve-checkin/approve-checkin.module').then(m => m.ApproveCheckinModule), canActivate: [AuthGuard] },
          { path: 'attendance-approve', loadChildren: () => import('./approve-attendance/approve-attendance.module').then(m => m.ApproveAttendanceModule), canActivate: [AuthGuard] },
          //newpagesRoute
          {path: 'delegate-access', loadChildren: () => import('./delegate-access/delegate-access.module').then(m => m.DelegateAccessModule), canActivate: [AuthGuard]},
          {path: 'dashboard-user', loadChildren: () => import('./dashboard-user-new/dashboard-user-new.module').then(m => m.DashboardUserNewModule), canActivate: [AuthGuard]},
          {path: 'dev-dashboard', loadChildren: () => import('./dev-dashboard/dev-dashboard.module').then(m => m.DevDashboardModule), canActivate: [AuthGuard]},
          {path: 'project-invoice', loadChildren: () => import('./project-invoice-new/project-invoice-new.module').then(m => m. ProjectInvoiceNewModule), canActivate: [AuthGuard]},
          {path: 'projects', loadChildren: () => import('./project-mgt-new/project-mgt-new.module').then(m => m.ProjectMgtNewModule), canActivate: [AuthGuard] },
          {path: 'admin-Notification', loadChildren: () => import('./admin-notification/admin-notification.module').then(m => m.AdminNotificationModule), canActivate: [AuthGuard] },
          {path: 'emp-notification', loadChildren: () => import('./admin-notification/admin-notification.module').then(m => m.AdminNotificationModule), canActivate: [AuthGuard] },
          {path: 'employee-new', loadChildren: () => import('./employee-new/employee-new.module').then(m => m.EmployeeNewModule), canActivate: [AuthGuard] },
          {path: 'case', loadChildren: () => import('./create-case/create-case.module').then(m => m.createCaseModule), canActivate: [AuthGuard] },
          {
            path: 'travel-claim',
            loadChildren: () => import('./travel-claim/travel-claim.module').then(m => m.TravelClaimModule), canActivate: [AuthGuard]
          },
          {
            path: 'human-resource',
            loadChildren: () => import('./human-resource/human-resource.module').then(m => m.HumanResourceModule), canActivate: [AuthGuard]
          },
          {
            path: 'workforce-new',
            loadChildren: () => import('./workforce-new/workforce-new.module').then(m => m.workForceNewModule), canActivate: [AuthGuard]
          },
          {
            path: 'invoice',
            loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule), canActivate: [AuthGuard]
          },
          {
            path: 'receipts',
            loadChildren: () => import('./receipts/receipts.module').then(m => m.ReceiptsModule), canActivate: [AuthGuard]
          },
          {
            path: 'commission',
            loadChildren: () => import('./commission/commission.module').then(m => m.CommissionModule), canActivate: [AuthGuard]
          },
          {
            path: 'vendors',
            loadChildren: () => import('./commission-vendors/commission-vendors.module').then(m => m.CommissionVendorsModule), canActivate: [AuthGuard]
          },
          {
            path: 'adjustments',
            loadChildren: () => import('./adjustments/adjustments.module').then(m => m.AdjustmentsModule), canActivate: [AuthGuard]
          },
          {
            path: 'HR-Employee',
            loadChildren: () => import('./hr-employee/hr-employee.module').then(m => m.hrEmployeeModule), canActivate: [AuthGuard]
          },
          {
            path: 'Payroll',
            loadChildren: () => import('./payroll/payroll.module').then(m => m.PayrollModule), canActivate: [AuthGuard]
          },
          {
            path: 'Asset',
            loadChildren: () => import('./asset/asset.module').then(m=>m.AssetModule), canActivate: [AuthGuard]
          },
          {
            path: 'Workforce-Members',
            loadChildren: () => import('./workforce-members/workforce-members.module').then(m => m.workforceMembersModule), canActivate: [AuthGuard]
          },
          {
            path: 'cost-estimation',
            loadChildren: () => import('./cost-estimation/cost-estimation.module').then(m => m.CostEstimationModule), canActivate: [AuthGuard]
          },
          {
            path: 'attexp',
            loadChildren: () => import('./attexp/attexp.module').then(m => m.AttexpModule), canActivate: [AuthGuard]
          },
          {
            path: 'dashboard-dashboardtest',
            loadChildren: () => import('./dashboard-test/dashboard-test.module').then(m  => m.DashboardTestModule), canActivate: [AuthGuard]
          }

        ]
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
