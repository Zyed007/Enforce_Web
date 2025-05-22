import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatSidenavModule, MatListModule } from '@angular/material';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';



@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
    FormsModule, ReactiveFormsModule,MatSidenavModule,MatListModule,DatePickerModule
   
  ],
    declarations: []
})
export class AdminHeaderModule {}
