import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RadiusSetupComponent } from './radius-setup.component';

const routes: Routes = [
    {
        path: '',
        component: RadiusSetupComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RadiusSetupRoutingModule {}
