import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivicyPolicyComponent } from './privicy-policy.component';

const routes: Routes = [
  {
    path: '',
    component: PrivicyPolicyComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class privicyPolicyRoutingModule {}



