import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabComponent, SelectEventArgs, EJ2Instance } from '@syncfusion/ej2-angular-navigations';
import { UserService } from '../../services/user.service';
import * as _ from "lodash";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  headerText=[];

  //userRights
  commonModuleName;
  noAccessTosettingsPage = false;

  constructor(private router:Router,
    private userService:UserService) {
    this.headerText= [
      {
         "text":"Common"
      },
      {
         "text":"Delegation"
      },
      {
         "text":"Productivity"
      },
      {
         "text":"Leave"
      },
      {
         "text":"Lead"
      },
      {
         "text":"Estimation"
      },
      {
         "text":"Quotation"
      },
      {
         "text":"Project"
      },
      {
         "text":"Notification"
      },
      {
         "text":"Task"
      },
      {
         "text":"Employee"
      },
      {
         "text":"Team"
      },
      {
         "text":"User Rights"
      }
   ]

   }
public empStatus(){
  this.router.navigate(['/employee-status']);
}
public tabSelected(args: SelectEventArgs): void {
  console.log('tabSelected',args)

this.scroll(args.selectedItem.innerText)


}
scroll(el) {
  // el.scrollIntoView();
  document.getElementById(el).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
 // el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}
appTracker(){
  this.router.navigate(['/app-track-setup']);
}
public empType(){
  this.router.navigate(['/employee-type']);
}
public deptType(){
  this.router.navigate(['/departments']);
}
public desgnType(){
  this.router.navigate(['/designation']);
}
public milestTemp(){
  this.router.navigate(['/milestone-template']);
}
public moduleSetup(){
  this.router.navigate(['/module-setup']);
}
public roleMgt(){
  this.router.navigate(['/role-mgt']);
}
public taskTemp(){
  this.router.navigate(['/task-template']);
}

public taskStatus(){
  this.router.navigate(['/task-status']);
}
public taskPriority(){
  this.router.navigate(['/task-priority']);
}
public leaveStatus(){
  this.router.navigate(['/leave-status']);
}
public leaveType(){
  this.router.navigate(['/leave-type']);
}
public leaveSetup(){
  this.router.navigate(['/leave-setup']);
}
public timeOfftype(){
  this.router.navigate(['/timeoff-type']);
}
public leaveOpenBalance(){
  this.router.navigate(['/leave-open-balance']);
}

public leadStatus(){
  this.router.navigate(['/lead-status']);
}
public leadCompany(){
  this.router.navigate(['/lead-company']);
}
public leadSource(){
  this.router.navigate(['/lead-source']);
}
public leadRating(){
  this.router.navigate(['/lead-rating']);
}
industryType(){
  this.router.navigate(['/industry-type']);
}
workLocation(){

  console.log("this is clicked")
  this.router.navigate(['/work-location']);
}
delegation(){
  this.router.navigate(['/delegation']);
}
public designType(){
  this.router.navigate(['/cost-type-design']);
}
public unitDesc(){
  this.router.navigate(['/cost-unit']);
}
public costTaskHrs(){
  this.router.navigate(['/cost-task-hrs']);
}
public perUnitHrs(){
  this.router.navigate(['/cost-hrs']);
}
public profitMargin(){
  this.router.navigate(['/profit-margin']);
}
public projType(){
  this.router.navigate(['/project-type']);
}
public pkgType(){
  this.router.navigate(['/package-setup']);
}
public taskHrs(){
  this.router.navigate(['/cost-task-hrs']);
}
public leadStage(){
  this.router.navigate(['/lead-stage']);
}
public leadDealType(){
  this.router.navigate(['/deal-type']);
}
public leadContactRole(){
  this.router.navigate(['/contact-role']);
}
public projPrefix(){
  this.router.navigate(['/prefix']);
}
public qtnPrefix(){
  this.router.navigate(['/qtn-prefix']);
}
public leadPrefix(){
  this.router.navigate(['/lead-prefix']);
}
public estPrefix(){
  this.router.navigate(['/estimate-prefix']);
}
public localActivity(){
  this.router.navigate(['/activity']);
}
public notifyType(){
  this.router.navigate(['/notification-type']);
}
public notifySetup(){
  this.router.navigate(['/notification-setup']);
}
workdaysSetup(){
  this.router.navigate(['/workdays-setup']);
}
empTeamSetup(){
  this.router.navigate(['/emp-team-setup']);
}
  ngOnInit() {
    this.checkUserRights();
  }

  checkUserRights(){
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let postData = { id : user_info.role_id }

  //  this.noAccessTosettingsPage = true;
    if(user_info.is_superadmin == true){
      this.noAccessTosettingsPage = true;
    }else{
      this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
        data.map((item) => {
          item.module_name = item.module_name.replace(/\s+/g, '');;
          return item;
        });
        this.commonModuleName = _.groupBy(data, 'module_name');
        console.log(this.commonModuleName)
        //settings
        if(this.commonModuleName.Settings){
          this.commonModuleName.Settings.map((elm) => {
            if(elm.section_name === 'View Settings'){
              if(elm.is_allow){
                this.noAccessTosettingsPage = elm.is_allow;
              }else{
                this.noAccessTosettingsPage = elm.is_allow;
              }
            }
          });
          console.log(this.noAccessTosettingsPage)
        }
      });
    }

  }

}
