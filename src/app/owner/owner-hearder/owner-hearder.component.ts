import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'owner-hearder',
  templateUrl: './owner-hearder.component.html',
  styleUrls: ['./owner-hearder.component.scss']
})
export class OwnerHearderComponent implements OnInit {

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  userInfo = JSON.parse(localStorage.getItem('user_info'))

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

}
