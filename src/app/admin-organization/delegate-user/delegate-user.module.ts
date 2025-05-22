import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelegateUserRoutingModule } from './delegate-user-routing.module';
import { DelegateUserComponent } from './delegate-user.component';

@NgModule({
    imports: [CommonModule,
      DelegateUserRoutingModule
    ],
    declarations: [
      DelegateUserComponent
    ]
})
export class DelegateUserModule {}
