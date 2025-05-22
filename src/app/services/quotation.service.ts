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

export class QuotationService {

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


//  GetAllProject(){
//             let empUrl=this.clientService.GetAllProject();
//
//
//             return this.http.post(empUrl,orgId,this.httpOptions)
//             .pipe(
//               retry(1),

//               catchError(this.handleError)
//             )
//         }
        GetAllProject(){
            let empUrl=this.clientService.GetAllProject();


            return this.http.get(empUrl)
            .pipe(
              retry(1),

              catchError(this.handleError)
            )
        }

        GetAllQuotationByOrgID(){
          let Id={
            orgID: localStorage.getItem('org_id')
        }
          let empUrl=this.clientService.GetAllQuotationByOrgID();


          return this.http.post(empUrl,Id)
          .pipe(
            retry(1),

            catchError(this.handleError)
          )
      }
      UpdateEntityContact(postData)  {
        let empUrl=this.clientService.UpdateEntityContact();

        return this.http.patch(empUrl, postData)
        .pipe(
          retry(1),
          catchError(this.handleError)
        )
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

        AddQuotation(postData)  {
          let user:object;
if(localStorage.getItem('user_info')){
  user= JSON.parse(localStorage.getItem('user_info'));


}
    let empUrl=this.clientService.AddQuotation();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  GetExtensionsLead(postData){
    let empUrl = this.clientService.GetExtensionsLead();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  FindByQuotationId(postData)  {
    let empUrl=this.clientService.FindByQuotationId();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateIsQuotationByCostProjectID(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateIsQuotationByCostProjectID();
    postData['createdby']=user['full_name'];

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetLastAddedQuotationPrefixByOrgID(){
    let Id={
      id: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.GetLastAddedQuotationPrefixByOrgID();


    return this.http.post(empUrl,Id)
    .pipe(
      retry(1),

      catchError(this.handleError)
    )
  }

  UpdateQuotationStageByQuotationID(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateQuotationStageByQuotationID();
    postData['createdby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RevisedQuotation(postData)  {
    let empUrl=this.clientService.RevisedQuotation();
    // postData['modifiedby']=user_info['full_name'];

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveQuotation(postData)  {
    let empUrl=this.clientService.RemoveQuotation();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateQuotation(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateQuotation();
 postData['modifiedby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddEntityMeeting(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddEntityMeeting();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');
 postData['emp_id']=user['id'];


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateEntityMeeting(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateEntityMeeting();
 postData['modifiedby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');
 postData['emp_id']=user['id'];


    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveEntityMeeting(postData)  {
    let empUrl=this.clientService.RemoveEntityMeeting();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchEntityMeetingOrgID(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.FetchEntityMeetingOrgID();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchEntityMeetingEntityID(postData)  {
    let empUrl=this.clientService.FetchEntityMeetingEntityID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByEntityMeetingID(postData)  {
    let empUrl=this.clientService.FindByEntityMeetingID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddEntityNotes(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddEntityNotes();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByEntityNotesID(postData)  {
    let empUrl=this.clientService.FindByEntityNotesID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateEntityNotes(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateEntityNotes();
 postData['modifiedby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveEntityNotes(postData)  {
    let empUrl=this.clientService.RemoveEntityNotes();
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
  GetAllOpenActivitiesEntityID(postData)  {
    let empUrl=this.clientService.GetAllOpenActivitiesEntityID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllCloseActivitiesEntityID(postData)  {
    let empUrl=this.clientService.GetAllCloseActivitiesEntityID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetLocalActivitieEntityID(postData)  {
    let empUrl=this.clientService.GetLocalActivitieEntityID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddEntityCall(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddEntityCall();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');
 postData['emp_id']=user['id'];
 postData['host']=user['id'];
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByEntityCallID(postData)  {
    let empUrl=this.clientService.FindByEntityCallID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByEntityContactOrgID()  {
    let postData={
      "id": localStorage.getItem('org_id')
    }
    let empUrl=this.clientService.FindByEntityContactOrgID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  UpdateEntityCall(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateEntityCall();
 postData['modifiedby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');
 postData['emp_id']=user['id'];
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveEntityCall(postData)  {
    let empUrl=this.clientService.RemoveEntityCall();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchEntityCallOrgID(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.FetchEntityCallOrgID();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindEntityContactByEntityID(postData)  {
    let empUrl=this.clientService.FindEntityContactByEntityID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddEntityContact(postData)  {
    let empUrl=this.clientService.AddEntityContact();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllEntityContactByEntityIDAndCstID(postData)  {
    let empUrl=this.clientService.GetAllEntityContactByEntityIDAndCstID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddLocalActivity(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddLocalActivity();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByLocalActivityID(postData)  {
    let empUrl=this.clientService.FindByLocalActivityID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateLocalActivity(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateLocalActivity();
 postData['modifiedby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveLocalActivity(postData)  {
    let empUrl=this.clientService.RemoveLocalActivity();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchLocalActivityOrgID()  {
    let postData={
      "id": localStorage.getItem('org_id')
    }
    let empUrl=this.clientService.GetAllLocalActivityByOrgID();
;

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchEntityNotesEntityID(postData)  {
    let empUrl=this.clientService.FetchEntityNotesEntityID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddEntityLocation(postData)  {

    let empUrl=this.clientService.AddEntityLocation();
 postData['createdby']=user_info['full_name'];

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateEntityLocation(postData)  {
    let empUrl=this.clientService.UpdateEntityLocation();
    postData['createdby']=user_info['full_name'];

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddCustomer(postData)  {
    let empUrl=this.clientService.AddCustomer();
 postData['createdby']=user_info['full_name'];
 postData['org_id']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindCustomProjectPrefixByOrgIDAndPrefix(postData)  {
    let empUrl=this.clientService.FindCustomProjectPrefixByOrgIDAndPrefix();
 postData['OrgID']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  ProjectTaskCountByProjectID(postData)  {
    let empUrl=this.clientService.ProjectTaskCountByProjectID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  GetAllTaskByProjectID(postData)  {
    let empUrl=this.clientService.GetAllTaskByProjectID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllTaskForAssignByProjectID(postData)  {
    let empUrl=this.clientService.GetAllTaskForAssignByProjectID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AssignEmpployeeToTask(postData)  {
    let empUrl=this.clientService.AssignEmpployeeToTask();
    // postData['createdby']=user_info["full_name"];
    postData['createdby']=user_info['full_name'];

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllCustomer()  {
    let empUrl=this.clientService.GetAllCustomer();

    return this.http.get(empUrl)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllCustomerByOrgID()  {
    let Id={
      OrgID: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.GetAllCustomerByOrgID();

    return this.http.post(empUrl,Id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


  FindByCustomerId(postData)  {
    let empUrl=this.clientService.FindByCustomerId();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateCustomer(postData){
    postData['createdby']=user_info['full_name'];
    postData['modifiedby']=user_info['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.UpdateCustomer();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }

  RemoveCustomer(postData){
    postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.RemoveCustomer();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  AddProjectCustomer(postData){
    postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.AddProjectCustomer();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  FindAutoProjectPrefixByOrgID()  {
    let empUrl=this.clientService.FindAutoProjectPrefixByOrgID();
    let Id={
      OrgID: localStorage.getItem('org_id')
  }

    return this.http.post(empUrl, Id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByProjectID(postData)  {
    let empUrl=this.clientService.FindByProjectID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByProjectTypeID(postData)  {
    let empUrl=this.clientService.FindByProjectTypeID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateProject(postData){
    postData['modifiedby']=user_info['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.UpdateProject();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )


  }
  UpdateProjectType(postData){
    postData['modifiedby']=user_info['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.UpdateProjectType();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )


  }
  RemoveProjectType(postData){
    postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.RemoveProjectType();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemoveProjectByID(postData){
    postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.RemoveProjectByID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  AddProjectStatus(postData)  {
    let empUrl=this.clientService.AddProjectStatus();
 postData['createdby']=user_info['full_name'];
 postData['org_id']=localStorage.getItem('org_id');
 postData['user_id']=localStorage.getItem('user_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateProjectStatus(postData){
    postData['createdby']=user_info['full_name'];
    postData['modifiedby']=user_info['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.UpdateProjectStatus();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }

  GetAllTaskByActivityID(postData){

    let empUrl=this.clientService.GetAllTaskByActivityID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  FindAllProjectActivityByProjectID(postData){
    let empUrl=this.clientService.FindAllProjectActivityByProjectID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  FindByProjectTasksId(postData){
    let empUrl=this.clientService.FindByProjectTasksId();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  UpdateTask(postData){
    let user={};
if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));


}
    postData['modifiedby']=user['full_name'];
    postData['empid']=user['id'];
        let empUrl=this.clientService.UpdateTask();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  GetProjectActivityTaskRatioByProjectID(postData){
    let empUrl=this.clientService.GetProjectActivityTaskRatioByProjectID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  GetProjectActivityRatioByProjectID(postData){
    let empUrl=this.clientService.GetProjectActivityRatioByProjectID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  UpdateProjectActivity(postData){
    let empUrl=this.clientService.UpdateProjectActivity();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }

  RemoveProjectActivity(postData){
    postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.RemoveProjectActivity();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  AllProjectRatioByOrgID(){
    let postData={
      'ID':localStorage.getItem('org_id')

    }

    let empUrl=this.clientService.AllProjectRatioByOrgID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemoveTask(postData){
    postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.RemoveTask();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemoveProjectStatus(postData){
    postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.RemoveProjectStatus();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  GetAllProjectStatus(){
    let empUrl=this.clientService.GetAllProjectStatus();


    return this.http.get(empUrl)
    .pipe(
      retry(1),

      catchError(this.handleError)
    )
}
  FetchAllProjectByOrgID(){
    let postData={
      'ID':localStorage.getItem('org_id')

    }

    let empUrl=this.clientService.FetchAllProjectByOrgID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  AddProjectActivity(postData)  {
    let empUrl=this.clientService.AddProjectActivity();
 postData['createdby']=user_info['full_name'];

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddMilestoneTemplate(postData)  {
    let empUrl=this.clientService.AddMilestoneTemplate();
 postData['createdby']=user_info['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddProjTask(postData)  {
    let empUrl=this.clientService.AddProjTask();
 postData['createdby']=user_info['full_name'];
 postData['empid']=user_info['id'];

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddMultipleTask(postData)  {
    let empUrl=this.clientService.AddMultipleTask();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateProjectStatusByID(postData)  {
    let empUrl=this.clientService.UpdateProjectStatusByID();

  postData['modifiedby']=user_info['full_name'];

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetProjectActivityByProjectID(postData)  {
    let empUrl=this.clientService.GetProjectActivityByProjectID();
//  postData['createdby']=user_info['full_name'];

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
