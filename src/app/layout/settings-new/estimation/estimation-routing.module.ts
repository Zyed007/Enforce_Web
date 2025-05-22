import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstimationComponent } from './estimation.component';
import { AddServiceComponent } from './add-Service/add-service.component';
import { AddPaymentTermComponent } from './add-payment-term/add-payment-term.component';

import { BuildingTypeComponent } from './add-building-type/building-type.component';
import { IntfutNewServiceComponent } from './intfut-new-service/intfut-new-service.component';
import { UnitTypeComponent } from './add-unit-type/unit-type.component';
import {IntfutServiceTemplates} from './intfut-service-templates/intfut-service-templates';
import { IntfutServiceRules } from './intfut-rules/intfut-rules.component';


const routes: Routes = [
  {
    path: '',
    component: EstimationComponent
  },
  {
    path: 'Add-Service',
    component: AddServiceComponent
  },
  {
    path: 'Add-Payment-terms',
    component: AddPaymentTermComponent
  },
  {
    path: 'add-building-type',
    component: BuildingTypeComponent
  },
  {
    path: 'intfut-create-service',
    component: IntfutNewServiceComponent
  },
  {
    path: 'add-unit-type',
    component: UnitTypeComponent
  },
  {
    path:'intfut-service-templates',
    component:IntfutServiceTemplates
  },
  {
    path:'intfut-service-rules',
    component:IntfutServiceRules
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class estimationSettingRoutingModule { }
