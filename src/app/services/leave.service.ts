import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

let orgId={
    id: localStorage.getItem('org_id')
}
let user_info:object;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));


}

@Injectable(
{ providedIn: 'root'}
)
export class LeaveService {

  constructor(private http: HttpClient, private clientService: ClientService) {

   }
    // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':'*/*',
      'Access-Control-Allow-Origin':'*',


    })
  }

  getEmpLeavePendingByOrgId(emp_id) {
    let req =  {
       "orgID": localStorage.getItem('org_id'),
       "empID": emp_id
     }
     let empUrl=this.clientService.getEmpLeavePendingByOrgId();

     return this.http.patch(empUrl, req)
     .pipe(
       retry(1),
       catchError(this.handleError)
     )

   }

   RemoveHolidayByID(postData){
    let empUrl=this.clientService.RemoveHolidayByID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


  FindMilestoneTemplatesByOrgID()  {
            let orgId={
                OrgID: localStorage.getItem('org_id')
            }
            let empUrl=this.clientService.FindMilestoneTemplatesByOrgID();

            return this.http.post(empUrl, orgId)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          UpdateLeaveSetup(postData)  {
            let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
            let empUrl=this.clientService.UpdateLeaveSetup();
            postData['org_id']=localStorage.getItem('org_id');

     postData['modifedby']=user['full_name'];

            return this.http.patch(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          AddLeaveSetup(postData)  {
            let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
            postData['org_id']=localStorage.getItem('org_id');
          postData['createdby']=user['full_name'];

            let empUrl=this.clientService.AddLeaveSetup();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          FetchLeaveSetupOrgID()  {
            let orgId={
                id: localStorage.getItem('org_id')
            }
            let empUrl=this.clientService.FetchLeaveSetupOrgID();

            return this.http.post(empUrl, orgId)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FindByLeaveSetupID(postData)  {
            let empUrl=this.clientService.FindByLeaveSetupID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          AddEmployeeLeaveAdjustment(postData)  {
            let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
            postData['org_id']=localStorage.getItem('org_id');
          postData['createdby']=user['full_name'];

            let empUrl=this.clientService.AddEmployeeLeaveAdjustment();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          FetchEmployeeLeaveAdjustmentOrgID()  {
            let orgId={
                id: localStorage.getItem('org_id')
            }
            let empUrl=this.clientService.FetchEmployeeLeaveAdjustmentOrgID();

            return this.http.post(empUrl, orgId)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FetchReasonsOrgID(){
            let orgId={
                id: localStorage.getItem('org_id')
            }
            let empUrl=this.clientService.FetchReasonsOrgID();

            return this.http.post(empUrl, orgId)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          AddReasons(postData){
            let user={};
            if(localStorage.getItem('user_info')){
              user= JSON.parse(localStorage.getItem('user_info'));


            }
            postData['org_id']=localStorage.getItem('org_id');
            postData['createdby']=user['full_name'];
            let empUrl=this.clientService.AddReasons();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          UpdateReasons(postData){
            let user={};
            if(localStorage.getItem('user_info')){
              user= JSON.parse(localStorage.getItem('user_info'));


            }
            postData['org_id']=localStorage.getItem('org_id');
            postData['createdby']=user['full_name'];
            let empUrl=this.clientService.UpdateReasons();

            return this.http.patch(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          RemoveReasons(postData){
            let empUrl=this.clientService.RemoveReasons();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          ApprovalByTimesheetIDAndApproverID(postData){
            let empUrl=this.clientService.ApprovalByTimesheetIDAndApproverID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          ApproveByCheckinOverwriteIDAndApproverID(postData){
            let empUrl=this.clientService.ApproveByCheckinOverwriteIDAndApproverID();
            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          UpdateCarryForwardRequestByID(postData){
            let empUrl=this.clientService.UpdateCarryForwardRequestByID();
            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          DeclineByCheckinOverwriteIDAndApproverID(postData){
            let empUrl=this.clientService.DeclineByCheckinOverwriteIDAndApproverID();
            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          FindByReasonsID(postData){
            let empUrl=this.clientService.FindByReasonsID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          UpdateEmployeeLeaveAdjustment(postData)  {
            let user={};
            if(localStorage.getItem('user_info')){
              user= JSON.parse(localStorage.getItem('user_info'));


            }
                    postData['org_id']=localStorage.getItem('org_id');
                  postData['modifiedby']=user['full_name'];
            let empUrl=this.clientService.UpdateEmployeeLeaveAdjustment();

            return this.http.patch(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          RemoveEmployeeLeaveAdjustment(postData)  {
            let empUrl=this.clientService.RemoveEmployeeLeaveAdjustment();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FindEmployeeLeaveAdjustmentByID(postData)  {
            let empUrl=this.clientService.FindEmployeeLeaveAdjustmentByID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
           FetchEmployeeLeaveAdjustmentEmpID(postData)  {
            let empUrl=this.clientService.FetchEmployeeLeaveAdjustmentEmpID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          RemoveLeaveSetup(postData)  {
            let empUrl=this.clientService.RemoveLeaveSetup();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          UpdateLeaveType(postData)  {
            let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
            let empUrl=this.clientService.UpdateLeaveType();
            postData['org_id']=localStorage.getItem('org_id');

     postData['modifedby']=user['full_name'];

            return this.http.patch(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          AddLeaveType(postData)  {
            let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
            postData['org_id']=localStorage.getItem('org_id');
          postData['createdby']=user['full_name'];

            let empUrl=this.clientService.AddLeaveType();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          FetchLeaveTypeOrgID()  {
            let orgId={
                id: localStorage.getItem('org_id')
            }
            let empUrl=this.clientService.FetchLeaveTypeOrgID();

            return this.http.post(empUrl, orgId)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FindByLeaveTypeID(postData)  {
            let empUrl=this.clientService.FindByLeaveTypeID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          RemoveLeaveType(postData)  {
            let empUrl=this.clientService.RemoveLeaveType();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          UpdateTimeOffSetup(postData)  {
            let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
            let empUrl=this.clientService.UpdateTimeOffSetup();
            postData['org_id']=localStorage.getItem('org_id');

     postData['modifedby']=user['full_name'];

            return this.http.patch(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          AddTimeOffSetup(postData)  {
            let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
            postData['org_id']=localStorage.getItem('org_id');
          postData['createdby']=user['full_name'];

            let empUrl=this.clientService.AddTimeOffSetup();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

          FetchTimeOffSetupOrgID()  {
            let orgId={
                id: localStorage.getItem('org_id')
            }
            let empUrl=this.clientService.FetchTimeOffSetupOrgID();

            return this.http.post(empUrl, orgId)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FindByTimeOffSetupID(postData)  {
            let empUrl=this.clientService.FindByTimeOffSetupID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          RemoveTimeOffSetup(postData)  {
            let empUrl=this.clientService.RemoveTimeOffSetup();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          AddEmployeeLeave(postData)  {
            let empUrl=this.clientService.AddEmployeeLeave();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          UpdateEmployeeLeave(postData)  {
            let empUrl=this.clientService.UpdateEmployeeLeave();

            return this.http.patch(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          RemoveEmployeeLeave(postData)  {
            let empUrl=this.clientService.RemoveEmployeeLeave();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FetchEmployeeLeaveHistoryEmpID(postData){
            let empUrl=this.clientService.FetchEmployeeLeaveHistoryEmpID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FetchEmployeeLeaveLogEmpID(postData){
            let empUrl=this.clientService.FetchEmployeeLeaveLogEmpID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FetchEmployeeLeaveHistoryOrgID(postData){
            let empUrl=this.clientService.FetchEmployeeLeaveHistoryOrgID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )

          }
          FindEmployeeLeaveByID(postData)  {
            let empUrl=this.clientService.FindEmployeeLeaveByID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FetchEmployeeLeaveEmpID(postData)  {
            let empUrl=this.clientService.FetchEmployeeLeaveEmpID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FetchEmployeeLeaveOrgID()  {
            let empUrl=this.clientService.FetchEmployeeLeaveOrgID();
            let orgId={
                id: localStorage.getItem('org_id')
            }
            return this.http.post(empUrl, orgId)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          UpdateApprovedByID(postData)  {
            let empUrl=this.clientService.UpdateApprovedByID();
          //   postData['org_id']=localStorage.getItem('org_id');
          //  let user= JSON.parse(localStorage.getItem('user_info'));
          //   postData['modifiedby']=user['full_name'];

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FetchEmployeeLeaveHistoryApproverID()  {
            let user= JSON.parse(localStorage.getItem('user_info'));
            let postData={
id:user['id']
            }
            let empUrl=this.clientService.FetchEmployeeLeaveHistoryApproverID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          UpdateLeaveStatus(postData)  {
            let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
            let empUrl=this.clientService.UpdateLeaveStatus();
            postData['org_id']=localStorage.getItem('org_id');

     postData['modifedby']=user['full_name'];

            return this.http.patch(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          AddLeaveStatus(postData)  {
            let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
            postData['org_id']=localStorage.getItem('org_id');
          postData['createdby']=user['full_name'];

            let empUrl=this.clientService.AddLeaveStatus();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          DeclineByLeaveIDAndApproverID(postData){
            let empUrl=this.clientService.DeclineByLeaveIDAndApproverID();

              return this.http.post(empUrl, postData)
              .pipe(
                retry(1),
                catchError(this.handleError)
              )
          }
          DeclineByTimesheetIDAndApproverID(postData){
            let empUrl=this.clientService.DeclineByTimesheetIDAndApproverID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }


    getEmpLeaveAvailableByOrgId(emp_id) {
     let req =  {
        "orgID": localStorage.getItem('org_id'),
        "empID": emp_id
      }
      let empUrl=this.clientService.getEmpLeaveAvailableByOrgId();

      return this.http.patch(empUrl, req)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

    }

    

    GetLeaveRequestedHistoryByOrgIDandEmpID(emp_id){
      let req =  {
        "orgID": localStorage.getItem('org_id'),
        "empID": emp_id
      }
      let empUrl=this.clientService.GetLeaveRequestedHistoryByOrgIDandEmpID();
      return this.http.patch(empUrl, req).pipe(retry(1),catchError(this.handleError))
    }

    GetLeaveRequestedHistoryByOrgIDandOnbehalfEmpID(emp_id){
      let req =  {
        "orgID": localStorage.getItem('org_id'),
        "empID": emp_id
      }
      let empUrl=this.clientService.GetLeaveRequestedHistoryByOrgIDandOnbehalfEmpID();
      return this.http.patch(empUrl, req).pipe(retry(1),catchError(this.handleError))
    }

    GetLeaveAccessByOrgIDandChkInChkOutOverWrite(postData){
      let empUrl=this.clientService.GetLeaveAccessByOrgIDandChkInChkOutOverWrite();
      return this.http.patch(empUrl, postData).pipe(retry(1),catchError(this.handleError))
    }

    getLeaveProfileSetupByOrgIDandId(leave_profile_id) {
      let req =  {
        "org_id": localStorage.getItem('org_id'),
        "id": leave_profile_id
      }
      let empUrl=this.clientService.getLeaveProfileSetupByOrgIDandId();
      return this.http.patch(empUrl, req)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    GetEmpListWithRolesByOrgID(req){
      let empUrl=this.clientService.GetEmpListWithRolesByOrgID();
      return this.http.post(empUrl, req).pipe(retry(1),catchError(this.handleError))
    }

    GetDefaultLeaveProfileSetupByOrgID(req){
      let empUrl=this.clientService.GetDefaultLeaveProfileSetupByOrgID();
      return this.http.patch(empUrl, req).pipe(retry(1),catchError(this.handleError))
    }

    DefaultToCommonProfileByOrgIDandProfileId(req){
      let empUrl=this.clientService.DefaultToCommonProfileByOrgIDandProfileId();
      return this.http.post(empUrl, req).pipe(retry(1),catchError(this.handleError))
    }

    UpdateAvailableLeaves(req){
      let empUrl=this.clientService.UpdateAvailableLeaves();
      return this.http.post(empUrl, req).pipe(retry(1),catchError(this.handleError))
    }


    empAddLeaveRequest(postData) {
      let empUrl=this.clientService.addEmpAddLeaveRequestedHistory();
      return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

          FetchLeaveStatusOrgID()  {
            let orgId={
                id: localStorage.getItem('org_id')
            }
            let empUrl=this.clientService.FetchLeaveStatusOrgID();

            return this.http.post(empUrl, orgId)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FindByLeaveStatusID(postData)  {
            let empUrl=this.clientService.FindByLeaveStatusID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          RemoveLeaveStatus(postData)  {
            let empUrl=this.clientService.RemoveLeaveStatus();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          RemoveTaskTemplateByID(postData)  {
            let empUrl=this.clientService.RemoveTaskTemplateByID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }
          FetchEmployeeLeaveCalcEmpID(postData)  {
            let empUrl=this.clientService.FetchEmployeeLeaveCalcEmpID();

            return this.http.post(empUrl, postData)
            .pipe(
              retry(1),
              catchError(this.handleError)
            )
          }

    GetEmployeeByOrgIDAndProfileID(postData){
      let empUrl=this.clientService.GetEmployeeByOrgIDAndProfileID();
      return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    GetCarryForwardHistorybyOrgId(postData){
      let empUrl=this.clientService.GetCarryForwardHistorybyOrgId();
      return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    GetCarryForwardToApprovebyOrgId(postData){
      let empUrl=this.clientService.GetCarryForwardToApprovebyOrgId();
      return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    UpdateLeaveAvailableCarryForward(postData){
      let empUrl=this.clientService.UpdateLeaveAvailableCarryForward();
      return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    AddCarryForwardRequest(postData){
      let empUrl=this.clientService.AddCarryForwardRequest();
      return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    GetCryFrwdRqstbyEmpId(postData){
      let empUrl=this.clientService.GetCryFrwdRqstbyEmpId();
      return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    GetPublicHolidaysCreatedbyOrgId(postData){
      let empUrl=this.clientService.GetPublicHolidaysCreatedbyOrgId();
      return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    GetPublicHolidaysCreatedbyApproverId(postData){
      let empUrl=this.clientService.GetPublicHolidaysCreatedbyApproverId();
      return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    AddPublicHolidays(postData){
      let empUrl=this.clientService.AddPublicHolidays();
      return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    GetLeaveRqstbyEmpId(postData){
      let empUrl=this.clientService.GetLeaveRqstbyEmpId();
      return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    UpdatePublicHolidaysByID(postData){
      let empUrl=this.clientService.UpdatePublicHolidaysByID();
      return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    FetchEmployeeOvrwriteApproverId(postData){
      let empUrl=this.clientService.FetchEmployeeOvrwriteApproverId();
      return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

  RemoveLeaveRequestedHistoryByID(postData){
    let empUrl=this.clientService.RemoveLeaveRequestedHistoryByID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


   // Error handling
   handleError(error) {
    let errorMessage = '';
    if(error.status === 0){
      errorMessage = 'Internal Server Error';
    } else {
      errorMessage = 'Something went wrong. please try again';
    }
    return throwError(errorMessage);
 }
}
