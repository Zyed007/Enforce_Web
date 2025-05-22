import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import * as $ from 'jquery';
import * as moment from 'moment';

import Swal from 'sweetalert2';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
    selector: 'admin-footer',
    templateUrl: './adminFooter.component.html',
    styleUrls: ['./adminFooter.component.scss'],providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class AdminFooterComponent implements OnInit {

    getCurrentYear = new Date().getFullYear();
    public pushRightClass: string;
    public time;
    public superAdmin=false;
    public user_info:object;
    public user_name:string;
    public org_name:string;
    public admin_dashboard=false;
    public emp_dashboard=false;
    public superAdmin_dashboard=false;
    constructor(private translate: TranslateService, public router: Router) {



        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }





    ngOnInit():void {

      //  $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js')


      //   $.getScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js')
      //  $.getScript('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js')

      if(localStorage.getItem('user_info')){
        this.user_info= JSON.parse(localStorage.getItem('user_info'));

        this.user_name=this.user_info['full_name'];


        if(this.user_info['is_admin']==false){
          this.admin_dashboard=false;
          this.superAdmin_dashboard=false;
          this.emp_dashboard=true;
        }
        if(this.user_info['is_superadmin']==true){
          this.admin_dashboard=true;
          this.superAdmin_dashboard=true;
          this.emp_dashboard=false;
        }
        if(this.user_info['is_admin']==true){
          this.admin_dashboard=true;
          this.superAdmin_dashboard=false;
          this.emp_dashboard=true;
        }



    }
      setInterval(() => {
      //  this.time=moment().format('MM/DD/YYYY hh:mm:ss A');
       this.time=moment().format('hh:mm a');
        //
        // return (moment().format('hh:mm a'));
        localStorage.setItem( 'currentTime', this.time );
      }, 2000);

        var api = "";
        var lat, lon;
        var tempUnit = 'C';
        var currentTempInCelsius;

      $( document ).ready(function(){

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var lat = "lat=" + position.coords.latitude;
          var lon = "lon=" + position.coords.longitude;
          getWeather(lat, lon);

        });
      } else {

      }

      $("#tempunit").click(function () {
        var currentTempUnit = $("#tempunit").text();
        var newTempUnit = currentTempUnit == "C" ? "F" : "C";
        $("#tempunit").text(newTempUnit);
        if (newTempUnit == "F") {
          var fahTemp = Math.round(parseInt($("#temp").text()) * 9 / 5 + 32);
          $("#temp").text(fahTemp + " " + String.fromCharCode(176));
        } else {
          $("#temp").text(currentTempInCelsius + " " + String.fromCharCode(176));
        }
      });

    })

    function getWeather(lat, lon) {
      var urlString = api + lat + "&" + lon;
      $.ajax({
        url: urlString, success: function (result) {
          $("#city").text(result.name + ", ");
          $("#country").text(result.sys.country);


          currentTempInCelsius = Math.round(result.main.temp * 10) / 10;
          $("#temp").text(currentTempInCelsius + " " + String.fromCharCode(176));
          $("#tempunit").text(tempUnit);
          $("#desc").text(result.weather[0].main);
          IconGen(result.weather[0].main);
        }
      });
    }

    function IconGen(desc) {
      var desc = desc.toLowerCase()
      switch (desc) {
        case 'drizzle':
          addIcon(desc)
          break;
        case 'clouds':
          addIcon(desc)
          break;
        case 'rain':
          addIcon(desc)
          break;
        case 'snow':
          addIcon(desc)
          break;
        case 'clear':
          addIcon(desc)
          break;
        case 'thunderstom':
          addIcon(desc)
          break;
        default:
          $('div.clouds').removeClass('hide');
      }
    }

    function addIcon(desc) {
      $('div.' + desc).removeClass('hide');
    }


        this.pushRightClass = 'push-right';
$.getScript("assets/plugins/global/plugins.bundle.js")
$.getScript("assets/js/scripts.bundle.js")
$.getScript('assets/js/pages/dashboard.js')

    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }
    public onLoggedout(){

      localStorage.clear();
      this.router.navigate(["/login"]);


    }


    changeLang(language: string) {
        this.translate.use(language);
    }


}








