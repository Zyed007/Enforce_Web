import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard, AuthTokenGuard } from './shared';
import { ClientService } from './services/clientUtilService';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//import { HotTableModule } from '@handsontable/angular';
import { NgxSpinnerModule } from "ngx-spinner";
//import { MomentModule } from 'ngx-moment';
import { NgxTimerModule } from 'ngx-timer';
import { ToastrModule } from 'ngx-toastr';
// import { NgSelect2Module } from 'ng-select2';
import { Select2Module } from 'ng2-select2';
//import { GridModule } from '@syncfusion/ej2-angular-grids';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import {
    MatToolbarModule,
    MatTableModule,
} from '@angular/material';
//import { NgClockPickerLibModule } from 'ng-clock-picker-lib';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AdminHeaderModule } from './admin-organization/adminHeader/adminHeader.module';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { AppPasswordDirective } from '../app/directives/app-pwd.directive';
// import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppPasswordModule } from '../app/directives/app-pwd.module';
import { AuthInterceptor } from './shared/interceptor/auth-interceptor';
// import { TokenInterceptor } from './shared/interceptor/auth-interceptor';

@NgModule({
    imports: [
        CommonModule,
        // BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        LanguageTranslationModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        AppPasswordModule,
        // HotTableModule,
        MatTableModule,
        MatToolbarModule,
        //MomentModule,
        NgxTimerModule,
        // NgSelect2Module,
        Select2Module,
        //GridModule,
        NgxMaterialTimepickerModule,
        //NgClockPickerLibModule,
        // NgbModule,
        AdminHeaderModule,

        // MDBBootstrapModule,
        ToastrModule.forRoot(),
        // MatGoogleMapsAutocompleteModule.forRoot()



    ],

    declarations: [AppComponent],
    providers: [AuthGuard, AuthTokenGuard, ClientService,
            {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor, 
            multi: true, 
        },
  
    ],
    bootstrap: [AppComponent]

})
export class AppModule { }