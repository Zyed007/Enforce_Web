import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../services/user.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-delegate-user",
  templateUrl: "./delegate-user.component.html",
  styleUrls: ["./delegate-user.component.scss"],
})
export class DelegateUserComponent implements OnInit {
  delegateDetails = [];
  user_id = localStorage.getItem("user_id");
  accessToPage=false;
  constructor(
    public toastr: ToastrService,
    public router: Router,
    public userService: UserService,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.checkUserAccess();
  }
  checkUserAccess() {
    this.delegateDetails=[]
    let delegateAccess = JSON.parse(localStorage.getItem("delegateDetails"));
    console.log(delegateAccess);
    if (delegateAccess.length > 0) {
      this.accessToPage=true
      delegateAccess.forEach((element) => {
      if(element.primary_org_name){
        this.delegateDetails.push({
          delegate_org_id: element.primary_org_id,
          delegate_org_name: element.primary_org_name,
          isPrimary: true
        });
      }else{
        this.delegateDetails.push({
         ...element,
          isPrimary: false
        });
      }
      })
      console.log(this.delegateDetails,"this.delegateDetails");
    } else {
      this.toastr.error("No Delegate Access Details Found");
    }
  }
  public getUsersInfo(org_id) {
    let userId = {
      ID: this.user_id,
      OrgID: org_id,
    };
    this.userService.getByUserID(userId).subscribe(
      (data) => {
        if (data["subscription"]) {
          localStorage.setItem(
            "planType",
            data["subscription"].current_plan_id
          );
          localStorage.setItem(
            "planName",
            data["subscription"].current_plan_id
          );
          localStorage.setItem(
            "subscription",
            JSON.stringify(data["subscription"])
          );
        } else {
          localStorage.setItem("planName", "winter");
        }

        localStorage.setItem("userRights", JSON.stringify(data["userRights"]));

        localStorage.setItem("user_info", JSON.stringify(data["employee"]));

        if (
          data["employee"].is_admin == true ||
          data["employee"].is_superadmin == false
        ) {
          localStorage.setItem("org_id", data["employee"].org_id);
          localStorage.setItem("planType", null);
          this.router.navigate(["/dashboard-user"]);
        } else {
          localStorage.setItem("org_id", data["employee"].org_id);
          localStorage.setItem("planType", null);

          this.router.navigate(["/dashboard-user"]);
        }
        //this.OrgList(data['employee'].id);
      },
      (error) => {
       console.log(error);
      }
    );
  }
  public toDashboard(org_id) {
    localStorage.setItem("org_id", org_id);
   this.getUsersInfo(org_id);
  }
}
