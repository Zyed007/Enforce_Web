import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assets',
  templateUrl: './asset-setting.component.html',
  styleUrls: ['./asset-setting.component.scss']
})
export class AssetSettingComponent implements OnInit {

  term;
  settingNames = [
    {
      name: 'Asset Status'
    },
    {
      name: 'Asset Type'
    },
    {
      name: 'Asset Category'
    },
    {
      name: 'Asset Prefix'
    }
  ]

  constructor(
    public Router: Router
  ) { }

  ngOnInit() {
  }

  cardClick(value) {
    switch (value) {
      case 'Asset Status':
        this.Router.navigate(['settings-new/asset-setting/asset-status']);
        break;  
      case 'Asset Type':  
        this.Router.navigate(['settings-new/asset-setting/asset-type']);
        console.log('Asset Type');
        break;
      case 'Asset Category':   
        this.Router.navigate(['settings-new/asset-setting/asset-category']);
        break;
      case 'Asset Prefix':
        this.Router.navigate(['settings-new/asset-setting/asset-prefix'])
        break;
      default:
        this.Router.navigate(['settings-new']);
    }
  }

}
