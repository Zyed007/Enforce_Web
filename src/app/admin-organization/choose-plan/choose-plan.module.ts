import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChoosePlanRoutingModule } from './choose-plan-routing.module';
import { ChoosePlanComponent } from './choose-plan.component';


import { HttpClientModule, HttpClient } from '@angular/common/http';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
    ChoosePlanRoutingModule,
    FormsModule, ReactiveFormsModule 
   
  ],
    declarations: [ChoosePlanComponent]
})
export class ChoosePlanModule {}
