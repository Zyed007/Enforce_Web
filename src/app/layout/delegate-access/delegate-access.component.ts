import { Component } from "@angular/core";
import { UserService } from "../../services/user.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-delegate",
  templateUrl: "./delegate-access.component.html",
  styleUrls: ["./delegate-access.component.scss"],
  providers: [],
})
export class DelegateAccessComponent {
  delegateDetails = [];
  constructor(
    public userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public router: Router
  ) {}
  ngOnInit() {
    this.checkUserAccess();
  }
  checkUserAccess() {
    let delegateAccess = JSON.parse(localStorage.getItem("delegateDetails"));
    console.log(delegateAccess);
    if (delegateAccess.length > 0) {
      this.delegateDetails = delegateAccess;
    } else {
      this.toastr.error("No Delegate Access Details Found");
    }
  }
  public toDashboard(id) {
    localStorage.setItem("org_id", id);
    this.router.navigate(["/dashboard"]);
  }
}
