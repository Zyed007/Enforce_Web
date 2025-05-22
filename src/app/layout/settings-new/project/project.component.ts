import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  term;
  settingNames = [
    {
      name: 'Project Prefix'
    },
    {
      name: 'Project Closing Template'
    }
  ]

  constructor(
    public Router :Router
  ) { }

  ngOnInit() {
  }

  cardClick(value){
    switch(value){

      case 'Project Prefix': this.Router.navigate(['settings-new/project/project-prefix']);
      break;

      case 'Project Closing Template': 
      this.Router.navigate(['settings-new/project/project-closing']);
      break;

      default: this.Router.navigate(['settings-new']);
    }
  }

}
