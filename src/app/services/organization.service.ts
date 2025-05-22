import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
let orgId;
let user_info:object;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));


}
@Injectable(
{ providedIn: 'root'}
)
export class OrganizationService {

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



  AddOrgProfile(postData)  {
    let profileUrl=this.clientService.addOrgProfile();

    return this.http.post(profileUrl, postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveOrganization(postData)  {
    let profileUrl=this.clientService.RemoveOrganization();

    return this.http.post(profileUrl, postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getAllOrg(){
    let orgUrl=this.clientService.getAllOrg();

    return this.http.post(orgUrl,'')
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getOrgById(org_id){
    let postData={
      id:org_id
    }
    let orgUrl=this.clientService.getOrgById();

    return this.http.post(orgUrl,postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  getOrgByUserId(id){
    let postData={
      id:id
    }
    let orgUrl=this.clientService.getOrgByUserId();

    return this.http.post(orgUrl,postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  setOrgID(id){
    orgId=id;
  }
  getOrgID(){
    return orgId;
  }
  FindByOrgId(id){
    let postData={
      id:id
    }
    let orgUrl=this.clientService.FindByOrgId();

    return this.http.post(orgUrl,postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


 FindAllOrgByHeadOrgID(){
    let postData={
      "ID":localStorage.getItem('org_id')
    }
    let orgUrl=this.clientService.FindAllOrgByHeadOrgID();

    return this.http.post(orgUrl,postData)
    .pipe(
      retry(1),
       )
  }



  FindCurrencyByOrgId(){
    let user_info=JSON.parse(localStorage.getItem('user_info'));
    let postData={
      "ID":localStorage.getItem('org_id')?localStorage.getItem('org_id'):user_info.org_id
    }
    let orgUrl=this.clientService.FindCurrencyByOrgId();

    return this.http.post(orgUrl,postData)
    .pipe(
      retry(1),
       )
  }
  updateOrg(postData){
    let user_info=JSON.parse(localStorage.getItem('user_info'));
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    // postData['createdby']=user_info['full_name'];
    postData['modifiedby']=user['full_name'];

    // postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.updateOrg();

    return this.http.patch(empUrl, postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }


  getWorkingHrsbyOrgId(postData){
    let postUrl=this.clientService.getWorkingHrsbyOrgId();
    return this.http.post(postUrl,postData).pipe( retry(1), catchError(this.handleError) )
  }

  UpdateWorkingHrs(postData){
    let postUrl=this.clientService.UpdateWorkingHrs();
    return this.http.post(postUrl,postData).pipe( retry(1), catchError(this.handleError) )
  }

  AddWorkingHrs(postData){
    let postUrl=this.clientService.AddWorkingHrs();
    return this.http.post(postUrl,postData).pipe( retry(1), catchError(this.handleError) )
  }
  getEmployeesByOrgIdForDelegate(orgId: string) {
    const orgData = { id: orgId };
    const empUrl = this.clientService.getEmployeeByOrgId();

    return this.http
      .post(empUrl, orgData, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
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
