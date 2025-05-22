import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { privicyPolicyRoutingModule } from './privicy-policy-routing.module';
import { PrivicyPolicyComponent } from './privicy-policy.component';


@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    privicyPolicyRoutingModule
  ],
  declarations: [
    PrivicyPolicyComponent
  ]
})
export class privicyPolicyModule {}
