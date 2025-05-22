import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../services/owner.service';

@Component({
    selector: 'app-Registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  planData;

  constructor(
    public OwnerService: OwnerService
  ) {

  }

  ngOnInit(){
    this.getAllSubscriptionPlan();
  }

  getAllSubscriptionPlan(){
    this.OwnerService.GetAllSubscriptionPlan().subscribe((data) => {
      this.planData = data;
      console.log(data)
    });
  }

  planChange(data){

  }

}
