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

export class LeadService {

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







      FindAutoCostProjectPrefixByOrgID(){
        let Id={
          orgID: localStorage.getItem('org_id')
      }
        let empUrl=this.clientService.FindAutoCostProjectPrefixByOrgID();

        return this.http.post(empUrl,Id)
        .pipe(
          retry(1),

          catchError(this.handleError)
        )
    }







  GetAllLeadCompanyByOrgID(){
    let Id={
      orgID: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.GetAllLeadCompanyByOrgID();


    return this.http.post(empUrl,Id)
    .pipe(
      retry(1),

      catchError(this.handleError)
    )
}

  AddLeadCompany(postData)  {
    let empUrl=this.clientService.AddLeadCompany();
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
  FindByLeadCompanyByID(postData)  {
    let empUrl=this.clientService.FindByLeadCompanyByID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateLeadCompany(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateLeadCompany();
    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveLeadCompany(postData)  {
    let empUrl=this.clientService.RemoveLeadCompany();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllLeadSourceByOrgID(){
    let Id={
      orgID: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.GetAllLeadSourceByOrgID();


    return this.http.post(empUrl,Id)
    .pipe(
      retry(1),

      catchError(this.handleError)
    )
}

  AddLeadSource(postData)  {
    let empUrl=this.clientService.AddLeadSource();
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
  FindByLeadSourceByID(postData)  {
    let empUrl=this.clientService.FindByLeadSourceByID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateLeadSource(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateLeadSource();
    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveLeadSource(postData)  {
    let empUrl=this.clientService.RemoveLeadSource();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllLeadStatusByOrgID(){
    let Id={
      orgID: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.GetAllLeadStatusByOrgID();


    return this.http.post(empUrl,Id)
    .pipe(
      retry(1),

      catchError(this.handleError)
    )
}


AddLeadDealType(postData)  {
  let user={};
  if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));


  }
  let empUrl=this.clientService.AddLeadDealType();
postData['createdby']=user['full_name'];
postData['org_id']=localStorage.getItem('org_id');

  return this.http.post(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
FindByLeadDealTypeId(postData)  {
  let empUrl=this.clientService.FindByLeadDealTypeId();


  return this.http.post(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
UpdateLeadDealType(postData)  {
  let user={};
  if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));


  }
  let empUrl=this.clientService.UpdateLeadDealType();
  postData['modifiedby']=user['full_name'];
  postData['org_id']=localStorage.getItem('org_id');

  return this.http.patch(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
RemoveLeadDealType(postData)  {
  let empUrl=this.clientService.RemoveLeadDealType();

  return this.http.post(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
GetAllLeadDealTypeByOrgID(){
  let Id={
    orgID: localStorage.getItem('org_id')
}
  let empUrl=this.clientService.GetAllLeadDealTypeByOrgID();


  return this.http.post(empUrl,Id)
  .pipe(
    retry(1),

    catchError(this.handleError)
  )
}








AddLeadStage(postData)  {
  let user={};
  if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));


  }
  let empUrl=this.clientService.AddLeadStage();
postData['createdby']=user['full_name'];
postData['org_id']=localStorage.getItem('org_id');

  return this.http.post(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
FindByLeadStageId(postData)  {
  let empUrl=this.clientService.FindByLeadStageId();


  return this.http.post(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
UpdateLeadStage(postData)  {
  let user={};
  if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));


  }
  let empUrl=this.clientService.UpdateLeadStage();
  postData['modifiedby']=user['full_name'];
  postData['org_id']=localStorage.getItem('org_id');

  return this.http.patch(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
RemoveLeadStage(postData)  {
  let empUrl=this.clientService.RemoveLeadStage();

  return this.http.post(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
GetAllLeadStageByOrgID(){
  let Id={
    orgID: localStorage.getItem('org_id')
}
  let empUrl=this.clientService.GetAllLeadStageByOrgID();


  return this.http.post(empUrl,Id)
  .pipe(
    retry(1),

    catchError(this.handleError)
  )
}
GetLastAddedLeadPrefixByOrgID(){
  let Id={
    id: localStorage.getItem('org_id')
}
  let empUrl=this.clientService.GetLastAddedLeadPrefixByOrgID();


  return this.http.post(empUrl,Id)
  .pipe(
    retry(1),

    catchError(this.handleError)
  )
}




AddLeadContractRole(postData)  {
  let user={};
  if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));


  }
  let empUrl=this.clientService.AddLeadContractRole();
postData['createdby']=user['full_name'];
postData['org_id']=localStorage.getItem('org_id');

  return this.http.post(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
FindByLeadContractRoleId(postData)  {
  let empUrl=this.clientService.FindByLeadContractRoleId();


  return this.http.post(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
FindByCustomerByNameAndEmail(postData){
  let empUrl=this.clientService.FindByCustomerByNameAndEmail();


  return this.http.post(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
UpdateLeadContractRole(postData)  {
  let user={};
  if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));


  }
  let empUrl=this.clientService.UpdateLeadContractRole();
  postData['modifiedby']=user['full_name'];
  postData['org_id']=localStorage.getItem('org_id');

  return this.http.patch(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
RemoveLeadContractRole(postData)  {
  let empUrl=this.clientService.RemoveLeadContractRole();

  return this.http.post(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
GetAllLeadContractRoleByOrgID(){
  let Id={
    orgID: localStorage.getItem('org_id')
}
  let empUrl=this.clientService.GetAllLeadContractRoleByOrgID();


  return this.http.post(empUrl,Id)
  .pipe(
    retry(1),

    catchError(this.handleError)
  )
}
  AddLeadStatus(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddLeadStatus();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByLeadStatusByID(postData)  {
    let empUrl=this.clientService.FindByLeadStatusByID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateLeadStatus(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateLeadStatus();
    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateLeadStatusByLeadID(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateLeadStatusByLeadID();
    postData['modifiedby']=user['full_name'];

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateEstDealValueByLeadID(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateEstDealValueByLeadID();
    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveLeadStatus(postData)  {
    let empUrl=this.clientService.RemoveLeadStatus();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllLeadRatingByOrgID(){
    let Id={
      orgID: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.GetAllLeadRatingByOrgID();


    return this.http.post(empUrl,Id)
    .pipe(
      retry(1),

      catchError(this.handleError)
    )
}

  AddLeadRating(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddLeadRating();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByLeadRatingByID(postData)  {
    let empUrl=this.clientService.FindByLeadRatingByID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateLeadRating(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateLeadRating();
    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveLeadRating(postData)  {
    let empUrl=this.clientService.RemoveLeadRating();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  AddExtensionsLead(postData){
    let empUrl = this.clientService.AddExtensionsLead();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateCstProjectIdByLeadId(postData){
    let empUrl = this.clientService.UpdateCstProjectIdByLeadId();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetExtensionsLeadId(postData){
    let empUrl = this.clientService.GetExtensionsLeadId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateProjectByleadId(postData){
    let empUrl = this.clientService.UpdateProjectByleadId();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddLead(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddLead();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByLeadId(postData)  {
    let empUrl=this.clientService.FindByLeadId();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateLead(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateLead();
    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveLead(postData)  {
    let empUrl=this.clientService.RemoveLead();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllLeadByOrgID(){
    let Id={
      orgID: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.GetAllLeadByOrgID();


    return this.http.post(empUrl,Id)
    .pipe(
      retry(1),

      catchError(this.handleError)
    )
}

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
