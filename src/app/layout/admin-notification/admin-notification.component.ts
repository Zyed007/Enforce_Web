import { Component, OnInit } from "@angular/core";
//services
import { AdminSettingService } from "./../../services/admin-setting.service";
//packages
import { Router } from "@angular/router";
import { ProjectService } from "../../services/project.service";
import Swal from "sweetalert2";
import moment = require("moment");
import { ToastrService } from "ngx-toastr";
declare var $: any;

@Component({
  selector: "app-admin-notification",
  templateUrl: "./admin-notification.component.html",
  styleUrls: ["./admin-notification.component.scss"],
})
export class AdminNotificationComponent implements OnInit {
  orgID = localStorage.getItem("org_id");
  userInfo: any = JSON.parse(localStorage.getItem("user_info"));
  NewNotificationDiv = true;
  ReadNotificationDiv = false;
  newNotificationData = [];
  readNotificationData = [];
  isLoading = false;
  adjustmentData;
  badDebtData;
  notData;

  constructor(
    public AdminSettingService: AdminSettingService,
    public router: Router,
    private projectService: ProjectService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.getUnReadNotificationForOrg();
  }

  async getAllNotificationForOrg() {
    const postData = {
      orgID: this.orgID,
      empID: this.userInfo.id,
    };

    try {
      const data = await this.AdminSettingService.GetLeaveRelatedNotificationsByOrgIDandEmpID(postData).toPromise();

      if (data && Array.isArray(data)) {
        this.readNotificationData = data.filter(i => i.read_status);
        this.AdminSettingService.communicateWithHeaderComp("run-Notification");
      } else {
        console.error("Invalid data format");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }

  async getUnReadNotificationForOrg() {
    const postData = {
      orgID: this.orgID,
      empID: this.userInfo.id,
    };

    try {
      const unReadData = await this.AdminSettingService.GetUnreadLeaveRelatedNotificationsByOrgIDandEmpID(postData).toPromise();

      if (unReadData && Array.isArray(unReadData)) {
        this.newNotificationData = unReadData;
        this.AdminSettingService.communicateWithHeaderComp("run-Notification");
      } else {
        console.error("Invalid data format");
      }
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
    }
  }

  async refreshNotifications() {
    this.isLoading = true;

    try {
      await this.getUnReadNotificationForOrg();
      await this.getAllNotificationForOrg();
    } catch (error) {
      console.error('Error while refreshing notifications:', error);
    } finally {
      this.isLoading = false;
    }
  }



  tabevent(value: string) {
    this.isLoading = true;

    setTimeout(async () => {
      if (value === "newNot") {
        this.NewNotificationDiv = true;
        this.ReadNotificationDiv = false;
      } else {
        this.NewNotificationDiv = false;
        this.ReadNotificationDiv = true;
        if (this.readNotificationData.length === 0) {
          await this.getAllNotificationForOrg();
        }
      }
      this.isLoading = false;
    }, 500);
  }

  goToProject(id) {
    localStorage.setItem("project_id", id);

    //Update NotificationRead Status
    let notRead = {
      id: this.notData.id,
      org_id: this.notData.org_id,
      from_id: this.notData.from_id,
      to_id: this.notData.to_id,
      reference_id: this.notData.reference_id,
      read_status: true,
      created_date: this.notData.created_date,
      created_by_empId: this.notData.created_by_empId,
      created_by_name: this.notData.created_by_name,
      modified_by_empId: this.notData.modified_by_empId,
      message: this.notData.message,
    };
    this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
      notRead
    ).subscribe((data: any) => {
      if (data != null) {
        console.log("Notification Read Status Updated");
        this.getAllNotificationForOrg();
      }
    });

    //Redirect to Project
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["/project-layout-new"])
    );
    window.open(url, "_blank");
  }

  viewEditNotification(notData, message) {
    localStorage.setItem("notData", JSON.stringify(notData));
    localStorage.setItem("message", message);
    console.log(notData, "///////")

    if (
      notData.message === "Requested Approval for Updating Employee Details" ||
      notData.message === "Requested Approval for Creating new Employee" ||
      notData.message === "Requested Approval for Deleting Employee Details"
    ) {
      this.router.navigate(["/settings-new/team-members"]);
    } else if (notData.message === "Requested Approval for Project Discount") {
      this.router.navigate(["/invoice"]);
    } else if (notData.message === "Requested Approval for Bad Debt") {
      $("#adjustment_modul").modal("show");
      localStorage.removeItem("notData");
      localStorage.removeItem("message");
      this.notData = notData;
      this.callAdjustment(notData);
    } else if (
      notData.message.indexOf("Project Closing") > -1 ||
      notData.message.indexOf("Project Force Closure") > -1 ||
      notData.message.indexOf("Project Closure tasks") > -1
    ) {
      //Requested Approval for Project Closing taskMiFi In Five Deal
      if (
        notData.message.indexOf("Requested Approval for Project Closing") > -1
      ) {
        localStorage.setItem("notAprvData", JSON.stringify("Approval Modal"));
        this.notData = notData;
        this.goToProject(notData.reference_id);
      } else if (
        notData.message.indexOf("Project Force Closure Requested for") > -1
      ) {
        localStorage.setItem(
          "notFrcAprvData",
          JSON.stringify("Project Closure Approval")
        );
        this.notData = notData;
        this.goToProject(notData.reference_id);
      } else if (
        notData.message.indexOf("Reopen Project Closure tasks for") > -1
      ) {
        console.log("HERE--->");
        localStorage.setItem(
          "notRvClsAprvData",
          JSON.stringify("Project Closure Approval")
        );
        this.notData = notData;
        this.goToProject(notData.reference_id);
      } else {
        this.notData = notData;
        this.goToProject(notData.reference_id);
      }
    } else if (
      notData.message.indexOf("Force checkin") > -1 ||
      notData.message.indexOf("Force checkout") > -1
    ) {
      console.log("notData--->", notData);
      //Update the Notification Read Status && Store timesheet Id in the R
      localStorage.setItem("notFrcCheckin", JSON.stringify(notData));
      this.notData = notData;
      this.readNotifications();
      this.router.navigate(["/leave-details"]);
    } else if (
      notData.message == "Requested Approval for Adding Attendence Exception"
    ) {
      console.log("notData--->", notData);
      //Update the Notification Read Status && Store timesheet Id in the R
      localStorage.setItem("notAttExp", JSON.stringify(notData));
      this.notData = notData;
     this.readNotifications();
      this.router.navigate(["/attexp"]);
    }
    else {
      console.log(" error side notData--->", notData);
      this.router.navigate(["/leave-details"]);
    }
  }

  readNotifications() {
    let notRead = {
      id: this.notData.id,
      org_id: this.notData.org_id,
      from_id: this.notData.from_id,
      to_id: this.notData.to_id,
      reference_id: this.notData.reference_id,
      read_status: true,
      created_date: this.notData.created_date,
      created_by_empId: this.notData.created_by_empId,
      created_by_name: this.notData.created_by_name,
      modified_by_empId: this.notData.modified_by_empId,
      message: this.notData.message,
    };
    console.log("Data", notRead);
    this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
      notRead
    ).subscribe((data: any) => {
      if (data.status === "200") {
        console.log("Notifications Updated");
      }
    });
  }

  callAdjustment(data) {
    this.projectService
      .GetBadDebtRequestById({ id: data.reference_id })
      .subscribe((bDData: any) => {
        bDData[0].approver2_roleId =
          bDData[0].approver2_roleId === "" ? null : bDData[0].approver2_roleId;
        this.badDebtData = bDData[0];
        this.projectService
          .GetInvoiceDebtsById({ id: this.badDebtData.entityId })
          .subscribe((invData: any) => {
            this.adjustmentData = invData[0];
          });
      });
  }

  closeApproverAdjustmentModul() {
    $("#adjustment_modul").modal("hide");
  }

  submitAdjustment(type) {
    let text = type === "Approve" ? "approved" : "declined";
    Swal.fire({
      title: type + " this Request ?",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: " Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value === true) {
        let notRead = {
          id: this.notData.id,
          org_id: this.notData.org_id,
          from_id: this.notData.from_id,
          to_id: this.notData.to_id,
          reference_id: this.notData.reference_id,
          read_status: true,
          created_date: this.notData.created_date,
          created_by_empId: this.notData.created_by_empId,
          created_by_name: this.notData.created_by_name,
          modified_by_empId: this.notData.modified_by_empId,
          message: this.notData.message,
        };

        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(
          notRead
        ).subscribe((data: any) => {
          if (data.status === "200") {
            let postData = {
              id: this.badDebtData.id,
              entityId: this.badDebtData.entityId,
              org_id: this.badDebtData.org_id,
              approver1_roleId: this.badDebtData.approver1_roleId,
              approver2_roleId: this.badDebtData.approver2_roleId,
              approval_status: text,
              created_date: this.badDebtData.created_date,
              created_by_empId: this.badDebtData.created_by_empId,
              modified_date: moment().format("L"),
            };

            if (this.badDebtData.approver2_roleId === null) {
              //single approver
              postData["is_approved_empId1"] =
                text === "approved" ? true : false;
              postData["ondate_approved1"] = moment().format("L");
            } else {
              //dual approver
              if (this.badDebtData.is_approved_empId1) {
                postData["is_approved_empId1"] =
                  this.badDebtData.is_approved_empId1;
                postData["ondate_approved1"] =
                  this.badDebtData.ondate_approved1;
                postData["is_approved_empId2"] =
                  text === "approved" ? true : false;
                postData["ondate_approved2"] = moment().format("L");
              } else {
                postData["is_approved_empId1"] =
                  text === "approved" ? true : false;
                postData["ondate_approved1"] = moment().format("L");
              }
            }

            this.projectService
              .UpdatebadDebtRequestById(postData)
              .subscribe((bdRequestData: any) => {
                if (bdRequestData.status === "200") {
                  this.toast.success("request " + postData.approval_status);
                } else {
                  this.toast.error("Something went wrong");
                }
                this.closeApproverAdjustmentModul();
              });
          }
        });
      }
    });
  }
}
