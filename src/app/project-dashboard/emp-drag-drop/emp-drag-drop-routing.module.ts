import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpDragDropComponent } from './emp-drag-drop.component';

const routes: Routes = [
    {
        path: '',
        component: EmpDragDropComponent
        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmpDragDropRoutingModule {}
