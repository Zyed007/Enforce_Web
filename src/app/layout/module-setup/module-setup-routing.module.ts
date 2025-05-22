import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleSetupComponent } from './module-setup.component';

const routes: Routes = [
    {
        path: '',
        component: ModuleSetupComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModuleSetupRoutingModule {}
