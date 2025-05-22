import { Component, OnInit, HostListener } from '@angular/core';
//services
import { AdminSettingService } from './../../services/admin-setting.service';
import { AdministrativeService } from './../../services/administrative.service';
import {ModuleSetupService} from './../../services/moduleSetup.service';
import { TimeSheetService } from './../../services/timesheet.service';
import { LeaveService } from './../../services/leave.service';
//packages
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash";
import { Console } from 'console';

@Component({
  selector: 'app-app-sup-admin-notification',
  templateUrl: './app-sup-admin-notification.component.html',
  styleUrls: ['./app-sup-admin-notification.component.scss']
})
export class AppSupAdminNotificationComponent implements OnInit {

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.escapeButtonPressed(event.code);
  }

  orgID = localStorage.getItem('org_id');
  userInfo:any = JSON.parse(localStorage.getItem('user_info'));
  applyLeaveDiv = false;
  applyOverwriteDiv = false;
  applyLeaveProfile = false;

  NewNotificationDiv = true;
  ReadNotificationDiv = false;
  newNotificationData = [];
  readNotificationData = [];
  viewEditNotificationModelData;
  originalViewEditNotificationModelData
  isApprov2View = false;
  isApproverTwo: boolean;

  constructor(
    public AdminSettingService: AdminSettingService,
    private admService: AdministrativeService,
    private TimeSheetService: TimeSheetService,
    private leaveService:LeaveService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr:ToastrService,
    public ModuleSetupService: ModuleSetupService
  ) { }

  ngOnInit() {
    this.getAllNotificationForOrg();
  }

  getAllNotificationForOrg(){
    let postData = {
      "orgID": this.orgID,
      "empID": this.userInfo.id
    }
    this.AdminSettingService.GetLeaveRelatedNotificationsByOrgIDandEmpID(postData).subscribe((data: any) =>{
      this.newNotificationData = [];
      this.readNotificationData = [];
      data.map((elm) => {
        if(elm.read_status === false){
          this.newNotificationData.push(elm)
        } else{
          this.readNotificationData.push(elm)
        }
      })
    });
  }

  tabevent(event){
    if(event.target.outerText === 'New Notification'){
      this.NewNotificationDiv = true;
      this.ReadNotificationDiv = false;
    }else{
      this.NewNotificationDiv = false;
      this.ReadNotificationDiv = true;
    }
  }

  viewEditNotification(content, notData){
    console.log(notData)
    this.originalViewEditNotificationModelData = notData;
    this.spinner.show();
    this.modalService.open(content);

    let postData = {
      "id": notData.reference_id
    }

    if(notData.message === 'Requested Approval for New Leave Request'){
      this.AdminSettingService.GetLeaveRequestedHistoryByID(postData).subscribe((data:any)=>{
        console.log(data)
        let serverData = data[0];
        serverData['message'] = this.originalViewEditNotificationModelData.message
        serverData['created_by_name'] = this.originalViewEditNotificationModelData.created_by_name
        this.viewEditNotificationModelData = serverData;
        this.spinner.hide();
        this.applyLeaveDiv = true;
      });
    }else if(notData.message === 'Requested Approval for Check In Check Out Overwrite'){
      this.TimeSheetService.GetTimesheetOverrideDetailsByTimesheetID(postData).subscribe((data:any)=>{
        console.log(data)
        let serverData = data;
        serverData['message'] = this.originalViewEditNotificationModelData.message
        this.viewEditNotificationModelData = serverData;
        this.spinner.hide();
        this.applyOverwriteDiv = true;
      });
    }else if(notData.message === 'Approval Requested for New Leave Profile'){
        //Add the condition for LEAVE Profile Here and call Get API for Leave Profile Data
       //Approval Requested for New Leave Profile
        //console.log('Approval Requested for New Leave Profile');

        let message = this.originalViewEditNotificationModelData.message
        this.AdminSettingService.GetLeaveProfileSetupByOrgIDandProfileID(postData).subscribe((data:any)=>{
          let serverData = data[0];
          let postData1 = {"id": serverData.created_by_empId}
          this.admService.FindByEmpID(postData1).subscribe((data: any) => {
            if(data.full_name){
              let createdBy = data.full_name;
              serverData["created_by_emp"] = createdBy;
              let postData2 = {"id": serverData.approver1_roleId}
                this.ModuleSetupService.FindByRoleModulesID(postData2).subscribe((data: any) => {
                  let approver1 = data[0].role_name;
                  serverData["approver1_RoleName"] = approver1;
                  serverData["message"] = message;
                    if(serverData.is_dual_approval === true){
                      let postData2 = {"id": serverData.approver2_roleId}
                      this.ModuleSetupService.FindByRoleModulesID(postData2).subscribe((data: any) => {
                        let approver2 = data[0].role_name;
                        this.isApprov2View = true;
                        serverData["approver2_RoleName"] = approver2;
                      });
                    }
                 this.viewEditNotificationModelData = serverData;
                  this.spinner.hide();
                  this.applyLeaveProfile = true;
                });
            }
          });
        });
    }


  }


  approveLeaveProfile(approveData) {
    Swal.fire({
      title: 'Approve this Profile ?',
      text: "Please Note this profile will be added for the organization",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        this.spinner.show();
        let postData={
          "id": this.originalViewEditNotificationModelData.id,
          "org_id": this.originalViewEditNotificationModelData.org_id,
          "from_id": this.originalViewEditNotificationModelData.from_id,
          "to_id": this.originalViewEditNotificationModelData.to_id,
          "reference_id": this.originalViewEditNotificationModelData.reference_id,
          // "read_status": true,
          "read_status": false,
          "created_date": this.originalViewEditNotificationModelData.created_date,
          "created_by_empId": this.originalViewEditNotificationModelData.created_by_empId,
          "created_by_name": this.originalViewEditNotificationModelData.createdEmpName,
          "modified_by_empId": this.originalViewEditNotificationModelData.modified_by_empId,
          "message": this.originalViewEditNotificationModelData.message
        }
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(postData).subscribe((data:any) => {
          console.log(data)
          let processData;
          let finalData = [];
          if(data.status === '200'){
            approveData.leaveDetails.map((elm)=> {
              processData = {
                "id": elm.id,
                "org_id": elm.org_id,
                "leave_profile_name": elm.leave_profile_name,
                "leave_name": elm.leave_name,
                "leave_type": elm.leave_type,
                "entitled_leave_days": elm.entitled_leave_days,
                "created_date": elm.created_date,
                "carry_forward_days": elm.carry_forward_days,
                "is_calendar_days": elm.is_calendar_days,
                "created_by_empId": elm.created_by_empId,
                "modified_by_empId": elm.modified_by_empId,
                "is_dual_approval": elm.is_dual_approval,
                "approver1_roleId": elm.approver1_roleId,
                "approver2_roleId": elm.approver2_roleId,
                "is_super_admin": false
              }


              //Check Single Approver  and Dual Approver and Assign Approvers
              let userData= JSON.parse(localStorage.getItem('user_info'));
              if(elm.approver1_roleId !=null &&  elm.approver2_roleId == null && elm.approver1_roleId == userData.role_id)
              {
                //Single Approver Setup
                processData['is_approved_roleId1'] =true;
                processData['is_approved'] =true;
              }
              else if(elm.approver1_roleId !=null &&  elm.approver2_roleId !=null && elm.approver1_roleId == userData.role_id ) {
                    //If Dual Approvers and the current user is the approver1
                    processData['is_approved_roleId1'] =true;
                    processData['is_approved_roleId2'] =false;
              }

              else if(elm.approver1_roleId !=null &&  elm.approver2_roleId !=null && elm.approver2_roleId == userData.role_id ) {
                //If Dual Approversand the current user is the approver2
                console.log('If Dual Approvers and the current user is the approver2')
                processData['is_approved_roleId1'] =true;
                processData['is_approved_roleId2'] =true;
                processData['is_approved'] =true;
              }


              finalData.push(processData);
            });


            let finalSendData = {
              "leaveProfileSetup": finalData
            }


            this.admService.UpdateProfileByOrgIDandProfileNameOrProfileID(finalSendData).subscribe((data:any) => {
              this.spinner.hide();
              if(data.status === '200'){
                this.successToast(data.desc)
                this.closeviewEditNotificationModel();
                this.getAllNotificationForOrg();
              }else{
                this.failerToast();
                this.closeviewEditNotificationModel();
              }
            });
          }else{
            this.failerToast();
            this.closeviewEditNotificationModel();
          }
        });
      }
    });
  }


  disapproveLeaveProfile(approveData) {
    Swal.fire({
      title: 'Disapprove this Profile ?',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        this.spinner.show();
        let postData={
          "id": this.originalViewEditNotificationModelData.id,
          "org_id": this.originalViewEditNotificationModelData.org_id,
          "from_id": this.originalViewEditNotificationModelData.from_id,
          "to_id": this.originalViewEditNotificationModelData.to_id,
          "reference_id": this.originalViewEditNotificationModelData.reference_id,
          "read_status": true,
          "created_date": this.originalViewEditNotificationModelData.created_date,
          "created_by_empId": this.originalViewEditNotificationModelData.created_by_empId,
          "created_by_name": this.originalViewEditNotificationModelData.createdEmpName,
          "modified_by_empId": this.originalViewEditNotificationModelData.modified_by_empId,
          "message": this.originalViewEditNotificationModelData.message
        }
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(postData).subscribe((data:any) => {
          this.spinner.hide();
          let processData;
          let finalData = [];
            if(data.status === '200'){
              let userData= JSON.parse(localStorage.getItem('user_info'));
              approveData.leaveDetails.map((elm)=> {
                processData = {
                  "id": elm.id,
                  "org_id": elm.org_id,
                  "leave_profile_name": elm.leave_profile_name,
                  "leave_name": elm.leave_name,
                  "leave_type": elm.leave_type,
                  "entitled_leave_days": elm.entitled_leave_days,
                  "created_date": elm.created_date,
                  "carry_forward_days": elm.carry_forward_days,
                  "is_calendar_days": elm.is_calendar_days,
                  "created_by_empId": elm.created_by_empId,
                  "modified_by_empId": userData.id ? userData.id : elm.modified_by_empId,
                  "is_dual_approval": elm.is_dual_approval,
                  "approver1_roleId": elm.approver1_roleId,
                  "approver2_roleId": elm.approver2_roleId,
                  "is_super_admin": false,
                  "is_approved": false,
                  "is_disapproved": true
                }
                finalData.push(processData);
              });
              let finalSendData = {
                "leaveProfileSetup": finalData
              }
              this.admService.UpdateProfileByOrgIDandProfileNameOrProfileID(finalSendData).subscribe((data:any) => {
                this.spinner.hide();
                if(data.status === '200'){
                  this.successToast(data.desc)
                  this.closeviewEditNotificationModel();
                  this.getAllNotificationForOrg();
                }else{
                  this.failerToast();
                  this.closeviewEditNotificationModel();
                }
              });
            }else{
              this.failerToast();
              this.closeviewEditNotificationModel();
            }
          });
        }
      });
  }



  //leave Approver function starts
  approveNotification(approveData){
    console.log(approveData)
    console.log('Current user logged in', this.userInfo.id)
    console.log(approveData.approver2_roleId)
    if(approveData.approver2_roleId !== null){
      this.getEmployeeOnRoleID(approveData.approver2_roleId);
    }
    Swal.fire({
      title: 'Approve this Leave Request ?',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        this.spinner.show();
        let notRead={
          "id": this.originalViewEditNotificationModelData.id,
          "org_id": this.originalViewEditNotificationModelData.org_id,
          "from_id": this.originalViewEditNotificationModelData.from_id,
          "to_id": this.originalViewEditNotificationModelData.to_id,
          "reference_id": this.originalViewEditNotificationModelData.reference_id,
          "read_status": true,
          "created_date": this.originalViewEditNotificationModelData.created_date,
          "created_by_empId": this.originalViewEditNotificationModelData.created_by_empId,
          "created_by_name": this.originalViewEditNotificationModelData.created_by_name,
          "modified_by_empId": this.originalViewEditNotificationModelData.modified_by_empId,
          "message": this.originalViewEditNotificationModelData.message
        }
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(notRead).subscribe((data:any) => {
          console.log(data)
          if(data.status === '200'){
            let postData={
              "id": approveData.id,
              "org_id": approveData.org_id,
              "emp_id": approveData.emp_id,
              "leave_profile_setup_id": approveData.leave_profile_setup_id,
              "leave_start_date": approveData.leave_start_date,
              "leave_end_date": approveData.leave_end_date,
              "leave_days_applied": approveData.leave_days_applied,
              "ondate_applied": approveData.ondate_applied,
              "onbehalf_applied": approveData.onbehalf_applied,
              "emp_notes": approveData.emp_notes,
              "approver1_roleId": approveData.approver1_roleId,
              "approver2_roleId": approveData.approver2_roleId,
              "approver1_empId": approveData.approver1_empId,
              "approver2_empId": approveData.approver2_empId,
              "approver1_notes": approveData.approver1_notes,
              "approver2_notes": approveData.approver2_notes,
              "is_approved_empId1": true,
              "is_approved_empId2": this.isApproverTwo,
              "leave_status": approveData.approver2_roleId === null || this.isApproverTwo === true ? "approved" : "pending",
              "created_date": approveData.created_date,
              "created_by_empId": approveData.created_by_empId,
              "modified_date": approveData.modified_date,
              "modified_by_empId": approveData.modified_by_empId,
            }
            this.AdminSettingService.UpdateLeaveRequestedHistoryByID(postData).subscribe((data:any) => {
              this.spinner.hide();
              if(data.status === '200'){
                this.successToast(data.desc)
                this.closeviewEditNotificationModel();
                this.getAllNotificationForOrg();
              }else{
                this.failerToast();
                this.closeviewEditNotificationModel();
              }
            });
          }
        });
      }
    });
  }

  getEmployeeOnRoleID(roleID){
    //console.log(roleID)
    let req = {id : this.orgID}
    let empArry = [];
    this.leaveService.GetEmpListWithRolesByOrgID(req).subscribe((data: any) => {
      //console.log(data);
      data.map((elm) => {
        if(elm.EmployeeRole.length !== 0){
          elm.EmployeeRole.map((role) => {
            if(role.id === roleID){
              empArry.push(elm.id)
            }
          })
        }
      })
      //console.log(empArry);
      let isUserPresent = _.includes(empArry, this.userInfo.id);
      this.isApproverTwo = isUserPresent;
      console.log(this.isApproverTwo);
    });
  }

  declineNotification(approveData){
    Swal.fire({
      title: 'Decline this Leave Request ',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        this.spinner.show();
        let notRead={
          "id": this.originalViewEditNotificationModelData.id,
          "org_id": this.originalViewEditNotificationModelData.org_id,
          "from_id": this.originalViewEditNotificationModelData.from_id,
          "to_id": this.originalViewEditNotificationModelData.to_id,
          "reference_id": this.originalViewEditNotificationModelData.reference_id,
          "read_status": true,
          "created_date": this.originalViewEditNotificationModelData.created_date,
          "created_by_empId": this.originalViewEditNotificationModelData.created_by_empId,
          "created_by_name": this.originalViewEditNotificationModelData.created_by_name,
          "modified_by_empId": this.originalViewEditNotificationModelData.modified_by_empId,
          "message": this.originalViewEditNotificationModelData.message
        }
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(notRead).subscribe((data:any) => {
          if(data.status === '200'){
            let postData={
              "id": approveData.id,
              "org_id": approveData.org_id,
              "emp_id": approveData.emp_id,
              "leave_profile_setup_id": approveData.leave_profile_setup_id,
              "leave_start_date": approveData.leave_start_date,
              "leave_end_date": approveData.leave_end_date,
              "leave_days_applied": approveData.leave_days_applied,
              "ondate_applied": approveData.ondate_applied,
              "onbehalf_applied": approveData.onbehalf_applied,
              "emp_notes": approveData.emp_notes,
              "approver1_roleId": approveData.approver1_roleId,
              "approver2_roleId": approveData.approver2_roleId,
              "approver1_empId": approveData.approver1_empId,
              "approver2_empId": approveData.approver2_empId,
              "approver1_notes": approveData.approver1_notes,
              "approver2_notes": approveData.approver2_notes,
              "is_approved_empId1": false,
              "is_approved_empId2": false,
              "leave_status": "declined",
              "created_date": approveData.created_date,
              "created_by_empId": approveData.created_by_empId,
              "modified_date": approveData.modified_date,
              "modified_by_empId": approveData.modified_by_empId,
            }

            this.AdminSettingService.UpdateLeaveRequestedHistoryByID(postData).subscribe((data:any) => {
              this.spinner.hide();
              if(data.status === '200'){
                this.successToast(data.desc)
                this.closeviewEditNotificationModel();
                this.getAllNotificationForOrg();
              }else{
                this.failerToast();
                this.closeviewEditNotificationModel();
              }
            });
          }
        });
      }
    });
  }

  closeviewEditNotificationModel(){
    this.modalService.dismissAll();
    this.isApprov2View = false;
    this.viewEditNotificationModelData = '';

    this.applyLeaveDiv = false;
    this.applyOverwriteDiv = false;
  }
  //leave Approver function ends


  //owerwrite function start
  approveOwerwrite(approveData){
    console.log(approveData)
    Swal.fire({
      title: 'Approve this Overwrite Request ?',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        this.spinner.show();
        let notRead={
          "id": this.originalViewEditNotificationModelData.id,
          "org_id": this.originalViewEditNotificationModelData.org_id,
          "from_id": this.originalViewEditNotificationModelData.from_id,
          "to_id": this.originalViewEditNotificationModelData.to_id,
          "reference_id": this.originalViewEditNotificationModelData.reference_id,
          "read_status": true,
          "created_date": this.originalViewEditNotificationModelData.created_date,
          "created_by_empId": this.originalViewEditNotificationModelData.created_by_empId,
          "created_by_name": this.originalViewEditNotificationModelData.created_by_name,
          "modified_by_empId": this.originalViewEditNotificationModelData.modified_by_empId,
          "message": this.originalViewEditNotificationModelData.message
        }
        console.log("Am here in app submit",this.originalViewEditNotificationModelData.reference_id)
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(notRead).subscribe((data:any) => {
          console.log(data)
          if(data.status === '200'){
            let user_info= JSON.parse(localStorage.getItem('user_info'));
            this.spinner.show();
            let postData={
              timesheetID: this.originalViewEditNotificationModelData.reference_id,
              approverID: user_info['id'],
            }
            console.log('postData',postData);
            this.leaveService.ApproveByCheckinOverwriteIDAndApproverID(postData).subscribe((data:any)  => {
              console.log(data)
              if(data.status=='200'){
                this.spinner.hide();
                this.toastr.success(data['desc'], undefined,{
                  positionClass: 'toast-top-center'
                });
                this.closeOwerWritemodel();
                this.getAllNotificationForOrg();
              }else{
                this.failerToast();
                this.closeOwerWritemodel();
              }
            },error  => {
                this.spinner.hide();
                Swal.fire(
                  'Error!',
                  error,
                  'error'
                )
            })
          }
        });
      }
    });
  }

  declineOwerwrite(approveData){
    console.log(approveData)
    Swal.fire({
      title: 'Approve this decline Request ?',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        this.spinner.show();
        let notRead={
          "id": this.originalViewEditNotificationModelData.id,
          "org_id": this.originalViewEditNotificationModelData.org_id,
          "from_id": this.originalViewEditNotificationModelData.from_id,
          "to_id": this.originalViewEditNotificationModelData.to_id,
          "reference_id": this.originalViewEditNotificationModelData.reference_id,
          "read_status": true,
          "created_date": this.originalViewEditNotificationModelData.created_date,
          "created_by_empId": this.originalViewEditNotificationModelData.created_by_empId,
          "created_by_name": this.originalViewEditNotificationModelData.created_by_name,
          "modified_by_empId": this.originalViewEditNotificationModelData.modified_by_empId,
          "message": this.originalViewEditNotificationModelData.message
        }
        this.AdminSettingService.UpdateLeaveRelatedNotificationsByID(notRead).subscribe((data:any) => {
          console.log(data)
          if(data.status === '200'){
            let user_info= JSON.parse(localStorage.getItem('user_info'));
            this.spinner.show();
            let postData={
              timesheetID: this.originalViewEditNotificationModelData.reference_id,
              approverID: user_info['id'],
            }
            console.log('postData',postData);
            this.leaveService.DeclineByTimesheetIDAndApproverID(postData).subscribe((data:any) => {
              console.log(data)
              if(data.status=='200'){
                this.spinner.hide();
                this.toastr.success(data['desc'], undefined,{
                  positionClass: 'toast-top-center'
                });
                this.closeOwerWritemodel();
                this.getAllNotificationForOrg();
              }else{
                this.failerToast();
                this.closeOwerWritemodel();
              }
            },error  => {
                this.spinner.hide();
                Swal.fire(
                  'Error!',
                  error,
                  'error'
                )
            })
          }
        });
      }
    });
  }

  closeOwerWritemodel(){
    this.modalService.dismissAll();
    this.viewEditNotificationModelData = '';

    this.applyLeaveDiv = false;
    this.applyOverwriteDiv = false;
  }
  //owerwrite function ends

  // if escape key pressed by user
  escapeButtonPressed(code){
    if(code === 'Escape'){
      this.modalService.dismissAll();
      this.isApprov2View = false;
      this.viewEditNotificationModelData = '';
    }
  }

  //Success message
  successToast(desc){
    this.toastr.success(desc);
  }

  //failure message
  failerToast(){
    let desc = 'Something went wrong';
    this.toastr.error(desc);
  }
}
