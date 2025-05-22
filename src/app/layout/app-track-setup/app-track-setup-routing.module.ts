import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppTrackSetupComponent } from './app-track-setup.component';

const routes: Routes = [
    {
        path: '', component:AppTrackSetupComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppTrackSetupRoutingModule {
}
