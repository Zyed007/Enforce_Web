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

export class TeamService {

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

  FetchAllTeamMembersByTeamName(postData){
    let empUrl = this.clientService.FetchAllTeamMembersByTeamName();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }



        getAllTeam(){
            let empUrl=this.clientService.getAllTeam();


            return this.http.get(empUrl)
            .pipe(
              retry(1),

              catchError(this.handleError)
            )
        }

        AddTeam(postData)  {
    let empUrl=this.clientService.addTeam();
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getByTeamID(postData)  {
    let empUrl=this.clientService.getByTeamID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  updateTeam(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.updateTeam();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  teamDelete(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.teamDelete();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  FindTeamsByOrgID(){
    let postData={
      'orgID':localStorage.getItem('org_id')

    }

    let empUrl=this.clientService.FindTeamsByOrgID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }

  FindByTeamID(postData){
    let empUrl=this.clientService.FindByTeamID();
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateFieldSettings(postData){
    let empUrl=this.clientService.UpdateFieldSettings();
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddFieldSettings(postData) {
    let empUrl = this.clientService.AddFieldSettings();
    return this.http.post(empUrl,postData, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateFieldSettingsBasedonWorkLocation(postData){
    let empUrl = this.clientService.UpdateFieldSettingsBasedonWorkLocation();
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllFieldSettingByOrgId(postData){
    let empUrl=this.clientService.GetAllFieldSettingByOrgId();
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  FindByTeamIDnew(postData){
    let empUrl=this.clientService.FindByTeamIDnew();
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


  fetchByAllTeamMembersTeamID(){
    let postData={
      'orgID':localStorage.getItem('org_id')

    }

    let empUrl=this.clientService.fetchByAllTeamMembersTeamID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  FetchAllTeamMembersByTeamID(postData){

    let empUrl=this.clientService.FetchAllTeamMembersByTeamID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }

  TeamResetSettings(postData){
    let empUrl=this.clientService.TeamResetSettings();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
  }

  EmployeeResetSettings(postData){
    let empUrl=this.clientService.EmployeeResetSettings();
    return this.http.post(empUrl,postData,this.httpOptions).pipe(retry(1),catchError(this.handleError))
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
