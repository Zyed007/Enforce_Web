import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadRatingComponent } from './lead-rating.component';

const routes: Routes = [
    {
        path: '',
        component: LeadRatingComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeadRatingRoutingModule {}
