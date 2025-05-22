import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


let user_info:object;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));
}

@Injectable({ providedIn: 'root'})

export class AdministrativeService {

  orgID = localStorage.getItem('org_id');

  constructor(private http: HttpClient, private clientService: ClientService) {

   }

    // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':'*/*',
      'Access-Control-Allow-Origin':'*'
    })
  }


  GetAllAdministrative(){
    let empUrl=this.clientService.GetAllAdministrative();
    return this.http.get(empUrl).pipe(retry(1),catchError(this.handleError))
  }

  AddAdministrative(postData){
    let empUrl=this.clientService.AddAdministrative();
    postData['createdby']=user_info['full_name'];
    postData['org_id']=localStorage.getItem('org_id');
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  FindByAdministrativeID(postData)  {
    let empUrl=this.clientService.FindByAdministrativeID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateAdministrative(postData){
    postData['createdby']=user_info['full_name'];
    postData['modifiedby']=user_info['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.UpdateAdministrative();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemoveAdministrative(postData){
    postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.RemoveAdministrative();
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  addAccessRightsforAdmin(postData){
   // postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.addAccessRightsforAdmin();
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAdministrativeByOrgID(){
    let postData={
      'ID':localStorage.getItem('org_id')

    }

    let empUrl=this.clientService.GetAdministrativeByOrgID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  GetAdministrativeTaskByOrgID(){
    let postData={
      'ID':localStorage.getItem('org_id')

    }

    let empUrl=this.clientService.GetAdministrativeTaskByOrgID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }

  AddLeaveProfileSetup(postData){
    let empUrl=this.clientService.AddLeaveProfileSetup();
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  UpdateProfileByOrgIDandProfileNameOrProfileID(postData){
    let empUrl=this.clientService.UpdateProfileByOrgIDandProfileNameOrProfileID();
    return this.http.patch(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  GetAllLeaveProfileSetupByOrgID(postData){
    let empUrl=this.clientService.GetAllLeaveProfileSetupByOrgID();
    return this.http.patch(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  GetLeaveProfileSetupByOrgIDandEmpId(){
    let postData = {
      "orgID": this.orgID,
      "empID": user_info['id']
    }
    let empUrl=this.clientService.GetAllLeaveProfileSetupByOrgID();
    return this.http.patch(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  RemoveLeaveProfileByOrgIDAndProfileName(postData){
    let empUrl=this.clientService.RemoveLeaveProfileByOrgIDAndProfileName();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  FindByEmpID(postData){
    let empUrl=this.clientService.FindByEmpID();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  FindByOrgId(postData){
    let empUrl=this.clientService.FindByOrgId();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  SearchLeavePofileName(postData){
    let empUrl=this.clientService.SearchLeavePofileName();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  //case
  AddCaseType(postData){
    let empUrl=this.clientService.AddCaseType();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  UpdateCaseTypeById(postData){
    let empUrl=this.clientService.UpdateCaseTypeById();
    return this.http.patch(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  //case history
  GetCaseHistoryByCreatedByEmpID(postData){
    let empUrl=this.clientService.GetCaseHistoryByCreatedByEmpID();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  GetAllCaseTypeByOrgId(){
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let orgID = user_info.org_id !== null ? user_info.org_id : localStorage.getItem('org_id');
    let postData = {
      orgID
    }
    let empUrl=this.clientService.GetAllCaseTypeByOrgId();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  GetCaseTypeByID(postData){
    let empUrl=this.clientService.GetCaseTypeByID();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  GetCaseTicketNumber(postData){
    let empUrl=this.clientService.GetCaseTicketNumber();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  //owner
  GetEventTotalByOrgId(postData){
    let empUrl=this.clientService.GetEventTotalByOrgId();
    return this.http.patch(empUrl, postData, this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  GetEventCountsByOrgId(postData){
    let empUrl=this.clientService.GetEventCountsByOrgId();
    return this.http.patch(empUrl, postData, this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }
  GetMonthlyEventCountsByOrgId(postData){
    let empUrl=this.clientService.GetMonthlyEventCountsByOrgId();
    return this.http.patch(empUrl, postData, this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }
  GetYearlyEventCountsByOrgId(postData){
    let empUrl=this.clientService.GetYearlyEventCountsByOrgId();
    return this.http.patch(empUrl, postData, this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }


   // Error handling
   handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Internal Server Error`;
    }
    return throwError(errorMessage);
 }
}
