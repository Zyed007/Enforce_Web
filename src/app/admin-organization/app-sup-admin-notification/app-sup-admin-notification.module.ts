import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AppSupAdminNotificationComponent} from './app-sup-admin-notification.component';
import {AppSupAdminNotificationRoutingModule} from './app-sup-admin-notification-routing.module';

//package
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
      CommonModule,
      AppSupAdminNotificationRoutingModule,
      NgbModule
    ],
    declarations: [
      AppSupAdminNotificationComponent
    ]
})
export class AppSupAdminNotificationModule {}
