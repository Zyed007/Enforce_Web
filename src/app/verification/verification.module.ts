import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerificationRoutingModule } from './verification-routing.module';
import { VerificationComponent } from './verification.component';


import { HttpClientModule, HttpClient } from '@angular/common/http';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
    VerificationRoutingModule,
    FormsModule, ReactiveFormsModule 
   
  ],
    declarations: [VerificationComponent]
})
export class VerificationModule {}
