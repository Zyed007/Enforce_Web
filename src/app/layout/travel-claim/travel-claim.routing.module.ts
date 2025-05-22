import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TravelClaimComponent } from './travel-claim.component';

const routes: Routes = [
    {
      path: '',
      component: TravelClaimComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TravelClaimRoutingModule {
}
