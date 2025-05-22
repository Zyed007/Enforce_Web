import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map } from 'rxjs/operators';
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

export class DelegationService {

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


        getAllDept(){
            let empUrl=this.clientService.getAllDept();


            return this.http.post(empUrl,orgId,this.httpOptions)
            .pipe(
              retry(1),

              catchError(this.handleError)
            )
        }


        AddDelegations(postData)  {
          let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddDelegations();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllDelegateeByOrgIDAndEmpID()  {
      let postData={
        "OrgID": localStorage.getItem('org_id'),
        "EmpID": user_info['id']
      }
    let empUrl=this.clientService.GetAllDelegateeByOrgIDAndEmpID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateDelegations(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.UpdateDelegations();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemoveDelegations(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.RemoveDelegations();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemoveAdminRightByEmpID(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.RemoveAdminRightByEmpID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemoveByDelegateeID(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.RemoveAdminRightByEmpID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  FindByDelegateesID(postData){
    let empUrl=this.clientService.FindByDelegateesID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  GetEmployeeRoles(){


    let empUrl=this.clientService.GetEmployeeRoles();

    return this.http.get(empUrl,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  SetupPreDefinedDepartment(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['createdby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.SetupPreDefinedDepartment();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }

  CheckDelegateExisting(postData){
    let empUrl=this.clientService.CheckDelegateExisting();
    return this.http.post(empUrl,postData) .pipe( retry(1),catchError(this.handleError))
  }

  AddDelegateDetails(postData){
    let empUrl=this.clientService.AddDelegateDetails();
    return this.http.post(empUrl,postData) .pipe( retry(1),catchError(this.handleError))
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
