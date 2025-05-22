import { Component, OnInit } from '@angular/core';
// import * as $ from 'jQuery';
@Component({
  selector: 'app-organize-profile',
  templateUrl: './organize-profile.component.html',
  styleUrls: ['./organize-profile.component.scss']
})
export class OrganizeProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  
    $.getScript("assets/js/pages/custom/user/edit-user.js")
  }

}
