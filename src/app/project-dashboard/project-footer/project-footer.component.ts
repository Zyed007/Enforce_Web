import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'project-footer',
  templateUrl: './project-footer.component.html',
  styleUrls: ['./project-footer.component.scss']
})
export class ProjectFooterComponent implements OnInit {

  getCurrentYear = new Date().getFullYear();

  constructor() { }

  ngOnInit() {
  }

}
