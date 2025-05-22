import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnerSettingsComponent } from './owner-settings.component';
import { AppPlanComponent } from './app-plan/app-plan.component';

const routes: Routes = [
  {
    path: '',
    component: OwnerSettingsComponent
  },
  {
    path: 'plan-settings',
    component: AppPlanComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OwnerSettingsRoutingModule {}
