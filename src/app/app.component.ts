import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  ActivatedRoute
} from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  animateChild
} from '@angular/animations';
import { AutoLogoutService } from './services/autologout.service';
import { Location } from '@angular/common';
import { environment } from '../environments/environment';
import { initializeDeviceId } from './shared/services';
import { PlatformDetectionService } from './platform-detection.service';
import Swal from 'sweetalert2';
// import { AutoLogoutService } from './services/autologout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('myAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [style({ opacity: 0 })],
          { optional: true }
        ),
        query(
          ':leave',
          [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))],
          { optional: true }
        ),
        query(
          ':enter',
          [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))],
          { optional: true }
        )
      ])
    ])

  ] // register the animations

})

export class AppComponent {


 
  title = 'Ng-Teams';

  location: Location;
  constructor(private router: Router, public route: ActivatedRoute, private spinner: NgxSpinnerService, private service: AutoLogoutService,private platformDetectionService: PlatformDetectionService, location: Location) {
    this.spinner.hide();

    // if (environment.production) {
    //   if (location.protocol === 'http:') {
    //     window.location.href = location.href.replace('http', 'https');
    //   }
    // }
    //     if(this.router.url=='/' ){
    // localStorage.clear();
    // sessionStorage.clear();
    //     }else if( this.router.url=='/signin'){
    //       localStorage.clear();
    //       sessionStorage.clear();
    //     }
    //     else{
    this.service.initInterval();
    this.service.initListener();
    // }
    addEventListener("storage", (event) => {
      if (event.key === 'token') {
        // console.log(event, "TOKEN CHANGED")
        window.location.reload();
      }
    });



    this.router.events.subscribe((event: Event) => {

      switch (true) {
        case event instanceof NavigationStart: {

          this.spinner.show();

          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {

          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 1500);

          break;
        }
        default: {
          break;
        }
      }
    });

  }
  
  ngOnInit(){
    initializeDeviceId();
    this.platformDetectionService.monitorConnection();
    console.log("INITIAL!!!")
  }
 
 
}




