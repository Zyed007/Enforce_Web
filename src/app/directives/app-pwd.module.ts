import { NgModule } from '@angular/core';


 import {AppPasswordDirective} from './app-pwd.directive';

@NgModule({
   
    declarations: [AppPasswordDirective],
    exports:[AppPasswordDirective]

})
export class AppPasswordModule {}
