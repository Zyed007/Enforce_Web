import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskListRoutingModule } from './task-list-routing.module';
import { TaskListComponent } from './task-list.component';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [CommonModule, TaskListRoutingModule,PageHeaderModule],
    declarations: [TaskListComponent]
})
export class TaskListModule {}
