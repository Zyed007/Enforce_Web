import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordSetupRoutingModule } from './password-setup-routing.module';
import { PasswordSetupComponent } from './password-setup.component';
import {AppPasswordModule} from '../directives/app-pwd.module';


@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
    PasswordSetupRoutingModule,
    FormsModule, ReactiveFormsModule,AppPasswordModule
   
  ],
    declarations: [PasswordSetupComponent]
})
export class PasswordSetupModule {}
