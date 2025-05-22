import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HRSettingComponent } from "./hr-setting.component";
import { FieldManagementComponent } from "./field-management/field-management.component";


const routes: Routes = [
  {
    path: '',
    component: HRSettingComponent
  },
  {
    path: 'field-management',
    component: FieldManagementComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class hrSettingRoutingModule { }
