import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectPrefixComponent } from './project-prefix/project-prefix.component';
import { ProjectClosingComponent } from './project-closing/project-closing.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectComponent
    },
    {
      path: 'project-prefix',
      component: ProjectPrefixComponent
    },
    {
        path: 'project-closing',
        component: ProjectClosingComponent
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class projectSettingRoutingModule {}
