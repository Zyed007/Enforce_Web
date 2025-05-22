import { Injectable, EventEmitter } from '@angular/core';
import { ClientService } from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class AdminSettingService {

  orgID = localStorage.getItem('org_id');
  userInfo:any = JSON.parse(localStorage.getItem('user_info'));

  communicateWithHeaderCompFunction = new EventEmitter();
  subsVar: Subscription;

  constructor(private http: HttpClient, private clientService: ClientService) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':'*/*',
      'Access-Control-Allow-Origin':'*'
    })
  }

  communicateWithHeaderComp(notValue) {
    this.communicateWithHeaderCompFunction.emit(notValue);
  }

  GetLeaveAccessByOrgIDandEmpID(){
    let postData = {
      "orgID": this.orgID,
      "empID": this.userInfo.id
    }
    let empUrl = this.clientService.GetLeaveAccessByOrgIDandEmpID();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }


   saGetLeaveAccessByOrgIDandEmpID(org_id,emp_id){
    let postData = {
      "orgID": org_id,
      "empID": emp_id
    }
    let empUrl = this.clientService.GetLeaveAccessByOrgIDandEmpID();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }


  saUpdateLeaveAccessByOrgIDandEmpID(postData){
    let empUrl = this.clientService.saUpdateAccessRightsByOrgIDandEmpID()
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetLeaveRelatedNotificationsByOrgID(){
    let postData = {"orgID": this.orgID}
    let empUrl = this.clientService.GetLeaveRelatedNotificationsByOrgID()
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetLeaveRelatedNotificationsByOrgIDandEmpID(postData){
    let empUrl = this.clientService.GetLeaveRelatedNotificationsByOrgIDandEmpID()
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }
  GetUnreadLeaveRelatedNotificationsByOrgIDandEmpID(postData){
    let empUrl = this.clientService.GetUnreadLeaveRelatedNotificationsByOrgIDandEmpID()
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetLeaveProfileSetupByOrgIDandProfileID(postData){
    postData["org_id"] = this.orgID;
    let empUrl = this.clientService.GetLeaveProfileSetupByOrgIDandProfileID()
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateLeaveRelatedNotificationsByID(postData){
    let empUrl = this.clientService.UpdateLeaveRelatedNotificationsByID()
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateAttendanceRelatedNotificationsByID(postData){
    let empUrl = this.clientService.UpdateAttendanceRelatedNotificationsByID()
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  //get user leave request data
  GetLeaveRequestedHistoryByID(postData){
    let empUrl = this.clientService.GetLeaveRequestedHistoryByID()
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  FindEmpByRoleId(postData){
    let empUrl = this.clientService.FindEmpByRoleId()
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  //Approver or decline a leave request
  UpdateLeaveRequestedHistoryByID(postData){
    let empUrl = this.clientService.UpdateLeaveRequestedHistoryByID()
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateForceCheckInRequest(postData){
    let empUrl = this.clientService.UpdateForceCheckInRequest()
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetLeaveRelatedNotificationByReffId(postData){
    let empUrl = this.clientService.GetLeaveRelatedNotificationByReffId()
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

   // Error handling
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent){
      errorMessage = error.error.message;
    }else{
      errorMessage = `Internal Server Error`;
    }
    return throwError(errorMessage);
  }

}
