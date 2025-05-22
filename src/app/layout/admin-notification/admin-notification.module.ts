import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminNotificationComponent} from './admin-notification.component';
import {AdminNotificationRoutingModule} from './admin-notification-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//package
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
      CommonModule,
      AdminNotificationRoutingModule,
      NgbModule,
      ReactiveFormsModule,
      FormsModule
    ],
    declarations: [
      AdminNotificationComponent
    ]
})
export class AdminNotificationModule {}
