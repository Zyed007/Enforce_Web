import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadPrefixComponent } from './lead-prefix.component';

const routes: Routes = [
    {
        path: '',
        component: LeadPrefixComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeadPrefixRoutingModule {}
