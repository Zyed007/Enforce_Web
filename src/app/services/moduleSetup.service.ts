import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable(
{ providedIn: 'root'}
)
export class ModuleSetupService {

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

  AddModules(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
    let empUrl=this.clientService.AddModules();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByModulesID(postData)  {
    let empUrl=this.clientService.FindByModulesID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateModules(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateModules();
 postData['modifiedby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveModules(postData)  {
    let empUrl=this.clientService.RemoveModules();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchEntityNotesOrgID(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.FetchEntityNotesOrgID();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchModulesOrgID()  {
    let postData={
        'id':localStorage.getItem('org_id')
    };

    let empUrl=this.clientService.FetchModulesOrgID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  AddRoleModules(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
    let empUrl=this.clientService.AddRoleModules();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByRoleModulesID(postData)  {
    let empUrl=this.clientService.FindByRoleModulesID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


  findApproversByRoleid(role_id,module_id) {
    let empUrl=this.clientService.getLeaveRoleModuleApproverByRoleIDandModuleID();
    let postData= {};
    postData['roleID']=role_id;
    postData['moduleID']=module_id;
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  UpdateRoleModules(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateRoleModules();
 postData['modifiedby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveRoleModules(postData)  {
    let empUrl=this.clientService.RemoveRoleModules();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }



  getApproverDetailsByRoledId(postData)  {
    let empUrl=this.clientService.GetApproverDetailsbyRoleId();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  updateApproverDetailsByRoledId(postData)  {
    let empUrl=this.clientService.UpdateModuleSectionApprv();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


  FindByRoleName(postData)  {
    let empUrl=this.clientService.FindByRoleName();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  FindByRoleNameandOrg(postData)  {
    postData['orgID'] = localStorage.getItem('org_id');
    let newUrl=this.clientService.FindByRoleNameandOrg();
    return this.http.post(newUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


  //old
  GetAllRoleModulesByOrgID(){
    let postData={
        'id':localStorage.getItem('org_id')
    };

    let empUrl=this.clientService.GetAllRoleModulesByOrgID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  GetAllSectionApproversByOrgID(){
    let postData={
        'orgID':localStorage.getItem('org_id')
    };

    let empUrl=this.clientService.GetAllSectionApproversByOrgID()
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  //new
  GetLeaveRoleModuleApproverByRoleIDandModuleID(postData){
    let empUrl=this.clientService.getLeaveRoleModuleApproverByRoleIDandModuleID();
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  FindByModuleSectionsID(postData){

    let empUrl=this.clientService.FindByModuleSectionsID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllModules(){

    let empUrl=this.clientService.GetAllModules();
    return this.http.get(empUrl)
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
