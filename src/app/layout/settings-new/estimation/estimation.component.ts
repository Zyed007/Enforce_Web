import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estimation',
  templateUrl: './estimation.component.html',
  styleUrls: ['./estimation.component.scss']
})
export class EstimationComponent implements OnInit {

  term;
  settingNames = [
    {
      name: 'Service'
    },
    {
      name: 'Payment Terms'
    },
    {
      name: 'Building Type'
    },

    {
      name: 'Interfuture Service'
    },

    {
      name: 'Unit Type'
    },
    {
      name: 'Interfuture Service Templates'
    },{
      name: 'Interfuture Service Rules'
    }
  ]

  constructor(
    public Router: Router
  ) { }

  ngOnInit() {
  }

  cardClick(value) {
    switch (value) {
      case 'Service':
        this.Router.navigate(['settings-new/estimation/Add-Service']);
        break;

      case 'Payment Terms':
        this.Router.navigate(['settings-new/estimation/Add-Payment-terms']);
        break;


      case 'Building Type':
        this.Router.navigate(['settings-new/estimation/add-building-type']);
        break;

      case 'Interfuture Service':
        this.Router.navigate(['settings-new/estimation/intfut-create-service']);
        break;

      case 'Unit Type':
        this.Router.navigate(['settings-new/estimation/add-unit-type']);
        break;
      case 'Interfuture Service Templates':
        this.Router.navigate(['settings-new/estimation/intfut-service-templates']);
        break;

      case 'Interfuture Service Rules':
        this.Router.navigate(['settings-new/estimation/intfut-service-rules']);
        break;

      default:
        this.Router.navigate(['settings-new']);
    }
  }

}
