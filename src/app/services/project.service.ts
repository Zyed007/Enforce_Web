import { Injectable } from '@angular/core';
import { ClientService } from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import moment = require('moment');
import { data } from 'jquery';


let orgId = {
  id: localStorage.getItem('org_id')
}
let user_info: object;
if (localStorage.getItem('user_info')) {
  user_info = JSON.parse(localStorage.getItem('user_info'));


}

@Injectable(
  { providedIn: 'root' }
)

export class ProjectService {

  userInformation = JSON.parse(localStorage.getItem('user_info'))
  orgID = this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id');

  constructor(private http: HttpClient, private clientService: ClientService) {

  }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*'




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
  GetAllProject() {
    let empUrl = this.clientService.GetAllProject();


    return this.http.get(empUrl)
      .pipe(
        retry(1),

        catchError(this.handleError)
      )
  }


  GetProjectTypeByOrgID() {
    let Id = {
      ID: localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.GetProjectTypeByOrgID();


    return this.http.post(empUrl, Id)
      .pipe(
        retry(1),

        catchError(this.handleError)
      )
  }
  FindAutoCostProjectPrefixByOrgID() {
    let Id = {
      orgID: localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.FindAutoCostProjectPrefixByOrgID();

    return this.http.post(empUrl, Id)
      .pipe(
        retry(1),

        catchError(this.handleError)
      )
  }

  AddProject(postData) {
    let empUrl = this.clientService.AddProject();
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['createdby'] = user['full_name'];
    postData['org_id'] = localStorage.getItem('org_id');
    postData['user_id'] = localStorage.getItem('user_id');

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateProjectTagByUnitIdProjectID(postData) {
    let empUrl = this.clientService.UpdateProjectTagByUnitIdProjectID();
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));
    }
    postData['modifiedby'] = user['full_name'];
    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateProjectExtraTagByUnitIdProjectID(postData) {
    let empUrl = this.clientService.UpdateProjectExtraTagByUnitIdProjectID();
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));
    }
    postData['modifiedBy'] = user['full_name'];
    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  AddProjectType(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AddProjectType();
    postData['createdby'] = user['full_name'];
    postData['org_id'] = localStorage.getItem('org_id');
    postData['user_id'] = localStorage.getItem('user_id');

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  //remove
  FetchAllProjectByEmpID() {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.FetchAllProjectByEmpID();
    let postData = {
      "id": user['id']
    }

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  FetchAllEmployeeProjectByEmpID() {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));
    }
    let empUrl = this.clientService.FetchAllEmployeeProjectByEmpID();
    let postData = {
      "id": user['id']
    }
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  FetchAllEmployeeLocalTasks() {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));
    }
    let empUrl = this.clientService.FetchAllEmployeeLocalTasks();
    let postData = {
      "id": user['id']
    }
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }


  getFetchAllProjectByEmpID() {
    if (localStorage.getItem('ActivityEmpID')) {
      let userData = localStorage.getItem('ActivityEmpID');
      let postData = {
        "id": userData
      }
      let empUrl = this.clientService.FetchAllProjectByEmpID();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    } else {
      let userData = JSON.parse(localStorage.getItem('user_info'));
      let postData = {
        "id": userData.id
      }
      let empUrl = this.clientService.FetchAllProjectByEmpID();
      return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
    }
  }
  AddEntityLocation(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AddEntityLocation();
    postData['createdby'] = user['full_name'];

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateEntityLocation(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.UpdateEntityLocation();
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateEstimationTask(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.UpdateEstimationTask();
    postData['modifiedby'] = user['full_name'];

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  AddCustomer(postData) {
    let empUrl = this.clientService.AddCustomer();
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['createdby'] = user['full_name'];
    postData['org_id'] = localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  FindByCustomerByPhone(postData) {
    let empUrl = this.clientService.FindByCustomerByPhone();
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  FindCustomProjectPrefixByOrgIDAndPrefix(postData) {
    let empUrl = this.clientService.FindCustomProjectPrefixByOrgIDAndPrefix();
    postData['OrgID'] = localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ProjectTaskCountByProjectID(postData) {
    let empUrl = this.clientService.ProjectTaskCountByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetAllAccomplishedTaskByProjectIDAndDate(postData) {
    let empUrl = this.clientService.GetAllAccomplishedTaskByProjectIDAndDate();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetAccomplishedTaskByActivityID(postData) {
    let empUrl = this.clientService.GetAccomplishedTaskByActivityID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  //old function
  GetAllSubTaskByTaskID(postData) {
    let empUrl = this.clientService.GetAllSubTaskByTaskID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  GetAllMainandLocalSubTaskListByEmployeeId(postData) {
    let empId = JSON.parse(localStorage.getItem('user_info'));
    postData["empID"] = empId.id;
    let empUrl = this.clientService.GetAllMainandLocalSubTaskListByEmployeeId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetAllSubtaskListByTaskEmpId(postData) {
    let empId = JSON.parse(localStorage.getItem('user_info'));
    postData["empID"] = empId.id;
    let empUrl = this.clientService.GetAllSubtaskListByTaskEmpId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  FindByProjectActivityID(postData) {
    let empUrl = this.clientService.FindByProjectActivityID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  FindBySubTaskssId(postData) {
    let empUrl = this.clientService.FindBySubTaskssId();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateEntityContactList(postData) {
    let empUrl = this.clientService.UpdateEntityContactList();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ProductivityProgressByProjectID(postData) {
    let empUrl = this.clientService.ProductivityProgressByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ProductivityTaskProgressByProjectID(postData) {
    let empUrl = this.clientService.ProductivityTaskProgressByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ProjectPropertyByProjectID(postData) {
    let empUrl = this.clientService.ProjectPropertyByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetAllProjectTaskListByProjectID(postData) {
    let empUrl = this.clientService.GetAllProjectTaskListByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetAllProjectLocalTaskListByProjectID(postData) {
    let empUrl = this.clientService.GetAllProjectLocalTaskListByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetProjectMilestoneWorkedRatioByProjectID(postData) {
    let empUrl = this.clientService.GetProjectMilestoneWorkedRatioByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetProjectAllMilestoneRatioByProjectID(postData) {
    let empUrl = this.clientService.GetProjectAllMilestoneRatioByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetProjectTaskRatioByProjectID(postData) {
    let empUrl = this.clientService.GetProjectTaskRatioByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  ProductivityProjectTaskTaskProgressByProjectID(postData) {
    let empUrl = this.clientService.ProductivityProjectTaskTaskProgressByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ProductivityProjectMilestoneProgressByProjectID(postData) {
    let empUrl = this.clientService.ProductivityProjectMilestoneProgressByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ProductivityProjectProgressActualBudgtedByProjectID(postData) {
    let empUrl = this.clientService.ProductivityProjectProgressActualBudgtedByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ProjectListPropertyByProjectID(postData) {
    let empUrl = this.clientService.ProjectListPropertyByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateProjectTask(postData) {
    let empUrl = this.clientService.UpdateProjectTask();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  GetLastAddedLeadPrefixByOrgID() {
    let Id = {
      id: localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.GetLastAddedLeadPrefixByOrgID();


    return this.http.post(empUrl, Id)
      .pipe(
        retry(1),

        catchError(this.handleError)
      )
  }

  GetProjectByPrefixandCstId(postData) {
    let empUrl = this.clientService.GetProjectByPrefixandCstId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetLastAddedProjectPrefixByOrgID() {
    let Id = {
      id: localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.GetLastAddedProjectPrefixByOrgID();


    return this.http.post(empUrl, Id)
      .pipe(
        retry(1),

        catchError(this.handleError)
      )
  }

  GelstPrjtPrfxNoExt() {
    let empUrl = this.clientService.GelstPrjtPrfxNoExt();
    return this.http.post(empUrl, { id: localStorage.getItem('org_id') }).pipe(retry(1), catchError(this.handleError))
  }

  AddPrefix(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AddPrefix();
    postData['createdby'] = user['full_name'];
    postData['org_id'] = localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  GetProjectPrefixActivitiesByOrgId(postData) {
    let empUrl = this.clientService.GetProjectPrefixActivitiesByOrgId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddProjectPrefixActivities(postData) {
    let empUrl = this.clientService.AddProjectPrefixActivities();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateProjectPrefixActivitiesById(postData) {
    let empUrl = this.clientService.UpdateProjectPrefixActivitiesById();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  FindByPrefixId(postData) {
    let empUrl = this.clientService.FindByPrefixId();


    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdatePrefix(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.UpdatePrefix();
    postData['modifiedby'] = user['full_name'];
    postData['org_id'] = localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  RemovePrefix(postData) {
    let empUrl = this.clientService.RemovePrefix();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetAllPrefixByOrgID() {
    let Id = {
      orgID: localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.GetAllPrefixByOrgID();


    return this.http.post(empUrl, Id)
      .pipe(
        retry(1),

        catchError(this.handleError)
      )
  }
  GetAllTaskByProjectID(postData) {
    let empUrl = this.clientService.GetAllTaskByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetAllProjectCheckInByProjectIDAndDate(postData) {
    let empUrl = this.clientService.GetAllProjectCheckInByProjectIDAndDate();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  GetAllProjectRemarksByGroupID(postData) {
    let empUrl = this.clientService.GetAllProjectRemarksByGroupID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  AddEntityHistoryLog(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AddEntityHistoryLog();
    postData['createdby'] = user['full_name'];
    postData['event_user_id'] = localStorage.getItem('user_id');
    postData['event_ondate'] = moment().format('L');
    postData['event_time'] = moment().format('hh:mm a');
    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetAllTaskForAssignByProjectID(postData) {
    let empUrl = this.clientService.GetAllTaskForAssignByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  AssignEmpployeeToTask(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AssignEmpployeeToTask();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  AssignEmployeeToTaskSubTask(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AssignEmployeeToTaskSubTask();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  AssignEmployeeTaskByProjectID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AssignEmployeeTaskByProjectID();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ReAssignEmployeeTaskByProjectID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.ReAssignEmployeeTaskByProjectID();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  AssignEmpployeeToMilestoneID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AssignEmpployeeToMilestoneID();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  FindAssigneeByProjectID(postData) {
    let empUrl = this.clientService.FindAssigneeByProjectID();
    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ReassignEmployeeToMilestoneID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.ReassignEmployeeToMilestoneID();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ReassignEmpployeeTProjectID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.ReassignEmpployeeTProjectID();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  AssignEmpployeeToProjectID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AssignEmpployeeToProjectID();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  AssignEmployeeTaskByMilestoneID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AssignEmployeeTaskByMilestoneID();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ReAssignEmployeeTaskByMilestoneID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.ReAssignEmployeeTaskByMilestoneID();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  FindAssigneeByMilestoneId(postData) {

    let empUrl = this.clientService.FindAssigneeByMilestoneId();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  FindByEntityContactID(postData) {
    let empUrl = this.clientService.FindByEntityContactID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetMilestoneWorkedRatioByProjectID(postData) {
    let empUrl = this.clientService.GetMilestoneWorkedRatioByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetAllCustomer() {
    let empUrl = this.clientService.GetAllCustomer();

    return this.http.get(empUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetAllCustomerByOrgID() {
    let Id = {
      OrgID: localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.GetAllCustomerByOrgID();

    return this.http.post(empUrl, Id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }


  FindByCustomerId(postData) {
    let empUrl = this.clientService.FindByCustomerId();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateCustomer(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }

    postData['modifiedby'] = user['full_name'];
    postData['org_id'] = localStorage.getItem('org_id');

    let empUrl = this.clientService.UpdateCustomer();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  RemoveCustomer(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    let empUrl = this.clientService.RemoveCustomer();

    return this.http.post(empUrl, postData, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  AddProjectCustomer(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    let empUrl = this.clientService.AddProjectCustomer();

    return this.http.post(empUrl, postData, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  FindAutoProjectPrefixByOrgID() {
    let empUrl = this.clientService.FindAutoProjectPrefixByOrgID();
    let Id = {
      OrgID: localStorage.getItem('org_id')
    }

    return this.http.post(empUrl, Id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  FindByProjectID(postData) {
    let empUrl = this.clientService.FindByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  GetExtensionsByProjectId(postData) {
    let empUrl = this.clientService.GetExtensionsByProjectId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  FindByProjectTypeID(postData) {
    let empUrl = this.clientService.FindByProjectTypeID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateProject(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    postData['org_id'] = localStorage.getItem('org_id');

    let empUrl = this.clientService.UpdateProject();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )


  }
  UpdateProjectType(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    postData['org_id'] = localStorage.getItem('org_id');

    let empUrl = this.clientService.UpdateProjectType();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )


  }
  RemoveProjectType(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    let empUrl = this.clientService.RemoveProjectType();

    return this.http.post(empUrl, postData, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  RemoveProjectByID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    let empUrl = this.clientService.RemoveProjectByID();

    return this.http.post(empUrl, postData, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  AddProjectStatus(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AddProjectStatus();
    postData['createdby'] = user['full_name'];
    postData['org_id'] = localStorage.getItem('org_id');
    postData['user_id'] = localStorage.getItem('user_id');

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateProjectStatus(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }

    postData['modifiedby'] = user['full_name'];
    postData['org_id'] = localStorage.getItem('org_id');

    let empUrl = this.clientService.UpdateProjectStatus();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }

  GetAllTaskByActivityID(postData) {

    let empUrl = this.clientService.GetAllTaskByActivityID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  GetAllMilestoneByProjectID(postData) {

    let empUrl = this.clientService.GetAllMilestoneByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  GetAllTaskByMilestoneID(postData) {

    let empUrl = this.clientService.GetAllTaskByMilestoneID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  GetAllSubTaskByMilestone(postData) {

    let empUrl = this.clientService.GetAllSubTaskByMilestone();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }

  GetAllSubTaskListByTaskId(postData) {
    let empUrl = this.clientService.GetAllSubTaskListByTaskId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }


  GetAllSubTaskByActivityID(postData) {

    let empUrl = this.clientService.GetAllSubTaskByActivityID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  GetAllSubTaskByMilestoneID(postData) {

    let empUrl = this.clientService.GetAllSubTaskByMilestoneID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  FindAllProjectActivityByProjectID(postData) {
    let empUrl = this.clientService.FindAllProjectActivityByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  ProductivityMilestoneProgressByProjectID(postData) {
    let empUrl = this.clientService.ProductivityMilestoneProgressByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  ProductivityProjectProgressByProjectID(postData) {
    let empUrl = this.clientService.ProductivityProjectProgressByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }

  FindByProjectTasksId(postData) {
    let empUrl = this.clientService.FindByProjectTasksId();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  ProjectModificationByProjectID(postData) {
    let empUrl = this.clientService.ProjectModificationByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  FindSubTaskBySubTaskNameAndProjectID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }

    postData['modifiedBy'] = user['full_name'];
    let empUrl = this.clientService.FindSubTaskBySubTaskNameAndProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  FindProjectListEditBySubTasksID(postData) {
    let empUrl = this.clientService.FindProjectListEditBySubTasksID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  GetAllProjectTaskByMilestoneID(postData) {
    let empUrl = this.clientService.GetAllProjectTaskByMilestoneID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  UpdateProjectSubTaskStatus(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.UpdateProjectSubTaskStatus();
    postData['modifiedby'] = user_info['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetProjectMilestoneByProjectID(postData) {
    let empUrl = this.clientService.GetProjectMilestoneByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetAllProjectSubTaskByMilestoneID(postData) {
    let empUrl = this.clientService.GetAllProjectSubTaskByMilestoneID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  FindModifiedSubTaskByProjectID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }

    let empUrl = this.clientService.FindModifiedSubTaskByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  GetProjectIDByEstID(postData) {
    let empUrl = this.clientService.GetProjectIDByEstID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  ModifyProjectByProjectID(postData) {

    let empUrl = this.clientService.ModifyProjectByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateCostProjectIsQuotationByID(postData) {

    let empUrl = this.clientService.UpdateCostProjectIsQuotationByID();
    //postData['modifiedby']=user_info['full_name'];
    //  postData['org_id']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  SetProjectModificationByProjectID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.SetProjectModificationByProjectID();
    postData['createdBy'] = user['full_name'];
    //  postData['org_id']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  GetProjectModifiationByEstID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.GetProjectModifiationByEstID();
    // postData['createdBy']=user_info['full_name'];
    //  postData['org_id']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  UpdateTask(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    postData['empid'] = user['id'];
    let empUrl = this.clientService.UpdateTask();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  UpdateSubTasks(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    postData['empid'] = user['id'];
    let empUrl = this.clientService.UpdateSubTask();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  UpdateSubTaskExceptUnitQty(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    postData['empid'] = user['id'];
    let empUrl = this.clientService.UpdateSubTaskExceptUnitQty();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }

  UpdateSubTaskStatus(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));
    }
    postData['modifiedby'] = user['full_name'];
    let empUrl = this.clientService.UpdateSubTaskStatus();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }

  GetProjectActivityTaskRatioByProjectID(postData) {
    let empUrl = this.clientService.GetProjectActivityTaskRatioByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  GetProjectActivityRatioByProjectID(postData) {
    let empUrl = this.clientService.GetProjectActivityRatioByProjectID();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  UpdateProjectActivity(postData) {
    let empUrl = this.clientService.UpdateProjectActivity();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }

  RemoveProjectActivity(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    let empUrl = this.clientService.RemoveProjectActivity();

    return this.http.post(empUrl, postData, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  AllProjectRatioByOrgID() {
    let postData = {
      'ID': localStorage.getItem('org_id')

    }

    let empUrl = this.clientService.AllProjectRatioByOrgID();

    return this.http.post(empUrl, postData, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  RemoveTask(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    let empUrl = this.clientService.RemoveTask();

    return this.http.post(empUrl, postData, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  RemoveProjectStatus(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby'] = user['full_name'];
    let empUrl = this.clientService.RemoveProjectStatus();

    return this.http.post(empUrl, postData, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  GetAllProjectStatus() {
    let empUrl = this.clientService.GetAllProjectStatus();


    return this.http.get(empUrl)
      .pipe(
        retry(1),

        catchError(this.handleError)
      )
  }
  FetchAllProjectByOrgID() {
    let postData = {
      'ID': localStorage.getItem('org_id')

    }

    let empUrl = this.clientService.FetchAllProjectByOrgID();

    return this.http.post(empUrl, postData, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  FetchProjectsWithLocationVerification() {
    let postData = {
      'ID': localStorage.getItem('org_id')

    }

    let empUrl = this.clientService.FetchProjectsWithLocationVerification();

    return this.http.post(empUrl, postData, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  FetchRecentProjectsByorgId(){
    let postData = {
      'ID': localStorage.getItem('org_id')

    }

    let empUrl = this.clientService.FetchRecentProjectsByorgId();

    return this.http.post(empUrl, postData, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }
  AddProjectActivity(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AddProjectActivity();
    postData['createdby'] = user['full_name'];

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  FindAllProjectMilestoneByProjectID(postData) {
    let empUrl = this.clientService.FindAllProjectMilestoneByProjectID();
    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  AddProjectMilestone(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AddProjectMilestone();
    postData['createdby'] = user['full_name'];

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  AddMilestoneTemplate(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AddMilestoneTemplate();
    postData['createdby'] = user['full_name'];
    postData['org_id'] = localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  AddProjTask(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AddProjTask();
    postData['createdby'] = user['full_name'];
    postData['empid'] = user['id'];

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  FetchAllProjectListByOrg() {
    let postData = {
      'id': localStorage.getItem('org_id')

    }
    let empUrl = this.clientService.FetchAllProjectListByOrg();
    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  FetchAllProjectListByEmpID() {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let postData = {
      "id": user['id']
    }
    let empUrl = this.clientService.FetchAllProjectListByEmpID();
    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  AddProjectLocalTask(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.AddProjectLocalTask();
    postData['createdby'] = user['full_name'];
    //  postData['empid']=user['id'];

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetTaskByMilestoneID(postData) {
    let empUrl = this.clientService.GetTaskByMilestoneID();
    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  //add log get task based on milestone
  GetAllEmployeeTasksByMilestoneId(postData) {
    let user = JSON.parse(localStorage.getItem('user_info'));
    postData['empID'] = user['id'];
    let empUrl = this.clientService.GetAllEmployeeTasksByMilestoneId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
  }

  GetMilestoneByProjectID(postData) {
    let empUrl = this.clientService.GetMilestoneByProjectID();
    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetProjectTaskListByEmployeeIDByProject(postData) {
    let empUrl = this.clientService.GetProjectTaskListByEmployeeIDByProject();
    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetTaskListByEmployeeIDByProject(postData) {
    let empUrl = this.clientService.GetTaskListByEmployeeIDByProject();
    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  AddMultipleTask(postData) {
    let empUrl = this.clientService.AddMultipleTask();


    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateProjectStatusByID(postData) {
    let user = {};
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl = this.clientService.UpdateProjectStatusByID();

    postData['modifiedby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  GetProjectActivityByProjectID(postData) {
    let empUrl = this.clientService.GetProjectActivityByProjectID();
    //  postData['createdby']=user_info['full_name'];

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getEmployeePreviousDayActivities(postData) {
    let userData = localStorage.getItem('ActivityEmpID');
    postData.empID = userData;
    console.log(postData)
    let empUrl = this.clientService.EmpProductivityDashboard();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  getEmployeePreviousDayActivitiesDashboard(postData) {
    let userData = JSON.parse(localStorage.getItem('user_info'));
    postData.empID = userData.id;
    console.log(postData)
    let empUrl = this.clientService.EmpProductivityDashboard();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  getEmployeePreviousDayActivitiesProjects(postData) {
    let userData = localStorage.getItem('ActivityEmpID');
    postData.empID = userData;
    let empUrl = this.clientService.getEmployeePreviousProjects();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetProformaInvoiceByOrgId(fromDate, toDate) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      fromDate: fromDate,
      toDate: toDate
    }
    let empUrl = this.clientService.GetProformaInvoiceByOrgId();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddSelfClaimProformaInvoice(postData) {
    let empUrl = this.clientService.AddSelfClaimProformaInvoice();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetAllProjectRevenueByOrgID(fromDate, toDate) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      fromDate: fromDate,
      toDate: toDate
    }
    let empUrl = this.clientService.GetAllProjectRevenueByOrgID();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetProformaInvoiceCount(fromDate, toDate) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      fromDate: fromDate,
      toDate: toDate
    }
    let empUrl = this.clientService.GetProformaInvoiceCount();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetAdvacneRevInv(fromDate, toDate) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      fromDate: fromDate,
      toDate: toDate
    }
    let empUrl = this.clientService.GetAdvacneRevInv();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetStagesRevInv(fromDate, toDate) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      fromDate: fromDate,
      toDate: toDate
    }
    let empUrl = this.clientService.GetStagesRevInv();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }


  GetProformaInvoiceByProject(postData) {
    let empUrl = this.clientService.GetProformaInvoiceByProject();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddDraftProformaInvoice(postData) {
    let empUrl = this.clientService.AddDraftProformaInvoice();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateProformDraftIds(postData) {
    let empUrl = this.clientService.UpdateProformDraftIds();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateAmountClaimed(postData) {
    let empUrl = this.clientService.UpdateAmountClaimed();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetRevenuePaymentByProject(postData) {
    let empUrl = this.clientService.GetRevenuePaymentByProject();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  FullModeGraphData(postData) {
    let empUrl = this.clientService.FullModeGraphData();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  ProjectBdgtProgressbyId(postData) {
    let empUrl = this.clientService.ProjectBdgtProgressbyId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetDraftProformaInvoiceByOrgId(fromDate, toDate) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      fromDate: fromDate,
      toDate: toDate
    }
    let empUrl = this.clientService.GetDraftProformaInvoiceByOrgId();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetOverDueInvoiceByOrgId(toDate) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      toDate: toDate
    }
    let empUrl = this.clientService.GetOverDueInvoiceByOrgId();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddInvoiceDebts(postData) {
    let empUrl = this.clientService.AddInvoiceDebts();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateInvoiceDebtById(postData) {
    let empUrl = this.clientService.UpdateInvoiceDebtById();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetInvoiceDebtsByDateOrgId(fromDate, toDate) {
    let postData = {
      orgID: this.orgID,
      fromDate: fromDate,
      toDate: toDate
    }
    let empUrl = this.clientService.GetInvoiceDebtsByDateOrgId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetProformaInvoiceByList(postData) {
    let empUrl = this.clientService.GetProformaInvoiceByList();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetPaymentPolicytermName(postData) {
    let empUrl = this.clientService.GetPaymentPolicytermName();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetBadDebtRequestById(postData) {
    let empUrl = this.clientService.GetBadDebtRequestById();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetInvoiceDebtsById(postData) {
    let empUrl = this.clientService.GetInvoiceDebtsById();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetProjectDetailsByMil(postData) {
    let empUrl = this.clientService.GetProjectDetailsByMil();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdatebadDebtRequestById(postData) {
    let empUrl = this.clientService.UpdatebadDebtRequestById();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateDraftProformaInv(postData) {
    let empUrl = this.clientService.UpdateDraftProformaInv();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddStageInvoice(postData) {
    let empUrl = this.clientService.AddStageInvoice();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetStageInvoiceByOrgId(fromDate, toDate) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      fromDate: fromDate,
      toDate: toDate
    }
    let empUrl = this.clientService.GetStageInvoiceByOrgId();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetRevenuePaymentOrgId(fromDate, toDate) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      fromDate: fromDate,
      toDate: toDate
    }
    let empUrl = this.clientService.GetRevenuePaymentOrgId();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetOpenbalProjects() {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.GetOpenbalProjects();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddProjectOpenBalance(postData) {
    let empUrl = this.clientService.AddProjectOpenBalance();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetReceivePByOrgId(fromDate, toDate) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      fromDate: fromDate,
      toDate: toDate
    }
    let empUrl = this.clientService.GetReceivePByOrgId();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetReceivePByProjectID(projectId) {
    let postData = {
      projectID: projectId
    }
    let empUrl = this.clientService.GetReceivePByProjectID();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetInvoicesByProjectID(projectID) {
    let postData = {
      id: projectID
    }
    let empUrl = this.clientService.GetInvoicesByProjectID();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetCustomerBalance(phone) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      phone
    }
    let empUrl = this.clientService.GetCustomerBalance();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateDraftProformaStsInv(postData) {
    let empUrl = this.clientService.UpdateDraftProformaStsInv();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddRevenuePayment(postData) {
    let empUrl = this.clientService.AddRevenuePayment();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateAccIdInPrjct(postData) {
    let empUrl = this.clientService.UpdateAccIdInPrjct();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetAllProjectsByOrgId() {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.GetAllProjectsByOrgId();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetWorkForceTeamsByOrgId() {
    let postData = {
      id: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.GetWorkForceTeamsByOrgId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddWorkForceTeams(postData) {
    let empUrl = this.clientService.AddWorkForceTeams();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
  }

  UpdateWorkforceTeam(postData) {
    let empUrl = this.clientService.UpdateWorkforceTeam();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError));
  }

  GetWorkForceTeamLead(postData) {
    let empUrl = this.clientService.GetWorkForceTeamLead();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
  }

  GetAllProjectRevenueByWrfcId(postData) {
    let empUrl = this.clientService.GetAllProjectRevenueByWrfcId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
  }

  GetWorkForceTeamsById(postData) {
    let empUrl = this.clientService.GetWorkForceTeamsById();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
  }

  EmployeeSummaryByWrkfcId(postData) {
    let empUrl = this.clientService.EmployeeSummaryByWrkfcId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
  }

  EmployeeProductvityByWrfcId(postData) {
    let empUrl = this.clientService.EmployeeProductvityByWrfcId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
  }

  GetInvoicesByCustPhone(postData) {
    postData.orgID = this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id')
    let empUrl = this.clientService.GetInvoicesByCustPhone();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetProformaInvoiceByCstId(postData) {
    let empUrl = this.clientService.GetProformaInvoiceByCstId();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetDraftProformaInvoiceByList(postData) {
    let empUrl = this.clientService.GetDraftProformaInvoiceByList();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddPaymentPolicyByName(postData) {
    postData.orgID = 'c674ef70-ef9a-4713-8106-e05c151c5ef8';
    postData.policyName = 'Old 3 Payment plan';
    let empUrl = this.clientService.AddPaymentPolicyByName();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddClaimInvoicesByOrgIdAndProject(postData) {
    postData.orgID = 'c674ef70-ef9a-4713-8106-e05c151c5ef8';
    let empUrl = this.clientService.AddClaimInvoicesByOrgIdAndProject();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddInvoiceDiscount(postData) {
    let empUrl = this.clientService.AddInvoiceDiscount();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddFullPaymentInClaim() {
    let empUrl = this.clientService.AddFullPaymentInClaim();
    return this.http.post(empUrl, { orgID: 'c674ef70-ef9a-4713-8106-e05c151c5ef8' }).pipe(retry(1), catchError(this.handleError))
  }

  AddCommisiontoClaim() {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.AddCommisiontoClaim();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetPendingProforma(projectID) {
    let postData = {
      id: projectID,
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.GetPendingProforma();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetAddInoviceDiscountbyApproverId(postData) {
    let empUrl = this.clientService.GetAddInoviceDiscountbyApproverId();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetExtensionsLead(postData) {
    let empUrl = this.clientService.GetExtensionsLead();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetExtensionsLeadId(postData) {
    let empUrl = this.clientService.GetExtensionsLeadId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateInvoiceDicountByID(postData) {
    let empUrl = this.clientService.UpdateInvoiceDicountByID();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetAddInoviceDiscountById(postData) {
    let empUrl = this.clientService.GetAddInoviceDiscountById();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetStageInvoiceById(postData) {
    let empUrl = this.clientService.GetStageInvoiceById();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  FetchPaymentPolicyById(projectID) {
    let postData = {
      orgID: this.userInformation.org_id !== null ? this.userInformation.org_id : localStorage.getItem('org_id'),
      id: projectID
    }
    let empUrl = this.clientService.FetchPaymentPolicyById();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddReceivePayment(postData) {
    let empUrl = this.clientService.AddReceivePayment();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateAmtClimInvoice(postData) {
    let empUrl = this.clientService.UpdateAmtClimInvoice();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdateAmtBalInvoice(postData) {
    let empUrl = this.clientService.UpdateAmtBalInvoice();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddCustomerCredit(postData) {
    let empUrl = this.clientService.AddCustomerCredit();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  ValidateAdvanceInvoice(postData) {
    let empUrl = this.clientService.ValidateAdvanceInvoice();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetCommissionServiceByProjId(postData) {
    let empUrl = this.clientService.GetCommissionServiceByProjId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetCommissionServiceByComId(postData) {
    let empUrl = this.clientService.GetCommissionServiceByComId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetCommissionVendorsById(postData) {
    let empUrl = this.clientService.GetCommissionVendorsById();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  FetchCommissionPolicyByIdAndDate(postData) {
    let empUrl = this.clientService.FetchCommissionPolicyByIdAndDate();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }


  //old function
  getEmployeePreviousDayActivitiesProjectsDashboard(postData) {
    let userData = JSON.parse(localStorage.getItem('user_info'));
    postData.empID = userData.id;
    let empUrl = this.clientService.getEmployeePreviousProjects();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetTimeLogAllActivityByEmpIDAndDate(postData) {
    let userData = JSON.parse(localStorage.getItem('user_info'));
    postData.empID = userData.id;
    let empUrl = this.clientService.GetTimeLogAllActivityByEmpIDAndDate();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }
  GetProjectAssigneeReassigneeList(postData) {

    let empUrl = this.clientService.GetProjectAssigneeReassigneeList();
    postData['org_id'] = localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }


  ReUnAssignEmployeeTaskByProjectID(postData) {
    let user: object;
    if (localStorage.getItem('user_info')) {
      user = JSON.parse(localStorage.getItem('user_info'));
    }
    let empUrl = this.clientService.ReUnAssignEmployeeTaskByProjectID();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];
    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  ReunAssignEmployeeTaskByMilestoneID(postData) {
    let user: object;

    if (localStorage.getItem('user_info')) {

      user = JSON.parse(localStorage.getItem('user_info'));

    }

    let empUrl = this.clientService.ReunAssignEmployeeTaskByMilestoneID();
    // postData['createdby']=user_info["full_name"];
    postData['createdby'] = user['full_name'];

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }


  GetLastAddedExtraProjectPrefixByOrgID(id) {
    let Id = {
      orgID: localStorage.getItem('org_id'),
      id: id
    }
    let empUrl = this.clientService.GetLastAddedExtraProjectPrefixByOrgID();


    return this.http.post(empUrl, Id)
      .pipe(
        retry(1),

        catchError(this.handleError)
      )
  }

  GetWorkForceMileStoneData(postData) {
    let empUrl = this.clientService.GetWorkForceMileStoneData();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError));
  }

  GelstPrjtExtraPrfxNoExt(id) {
    let empUrl = this.clientService.GelstPrjtExtraPrfxNoExt();
    return this.http.post(empUrl, { orgID: localStorage.getItem('org_id'), id: id }).pipe(retry(1), catchError(this.handleError))
  }




  AddProjectClosingTsk(postData) {
    let empUrl = this.clientService.AddProjectClosingTsk();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  UpdateProjectClosingTsk(postData) {
    let empUrl = this.clientService.UpdateProjectClosingTsk();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }



  GetAllClosingStepsByOrgID() {
    let Id = {
      id: localStorage.getItem('org_id')
    }
    let empUrl = this.clientService.GetAllClosingStepsByOrg();


    return this.http.post(empUrl, Id)
      .pipe(
        retry(1),

        catchError(this.handleError)
      )
  }


  GetProjectClosureTaskByProjectId(id) {
    let Id = {
      id: id
    }
    let empUrl = this.clientService.GetProjectClosureTaskByProjectId();


    return this.http.post(empUrl, Id)
      .pipe(
        retry(1),

        catchError(this.handleError)
      )
  }


  AddProjectClosureTasks(postData) {
    let empUrl = this.clientService.AddProjectClosureTasks();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  UpdateProjectClosureTasks(postData) {
    let empUrl = this.clientService.UpdateProjectClosureTaskByTaskID();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  UpdateClosureEmpTskById(postData) {
    let empUrl = this.clientService.UpdateClosureEmpTskById();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  UpdateClosureAprvTskById(postData) {
    let empUrl = this.clientService.UpdateClosureAprvTskById();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  UpdateRevenueAdjustment(postData) {
    let empUrl = this.clientService.UpdateRevenueAdjustment()
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddHistoryRevenuePayment(postData) {
    let empUrl = this.clientService.AddHistoryRevenuePayment();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddRequestForceClosure(postData) {
    let empUrl = this.clientService.AddRequestForceClosure();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  GetForceClosureRequest(postData) {
    let empUrl = this.clientService.GetForceClosureRequest();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  UpdateForceClosureRequest(postData) {
    let empUrl = this.clientService.UpdateForceClosureRequest();

    return this.http.patch(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }



  UndoProjectClosureTsk(postData) {
    let empUrl = this.clientService.UndoProjectClosureTsk();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }


  ValidateInvoicesRaised(postData) {
    let empUrl = this.clientService.ValidateInvoicesRaised();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }


  ValidatePaymentTerm(postData) {
    let empUrl = this.clientService.ValidatePaymentTerm();

    return this.http.post(empUrl, postData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }




  updateProjectPreficoveeride(postData) {
    let empUrl = this.clientService.updateProjectPreficoveeride();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddBuildingType(postData)  {
    let empUrl=this.clientService.AddBuildingType();
  
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  
  
  UpdateBuildingTypeById(postData)  {
    let empUrl=this.clientService.UpdateBuildingTypeById();
  
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  
  
  GetAllBuildingTypesOrgID(){
    let Id={
      id: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.GetAllBuildingTypesOrgID();
  
  
    return this.http.post(empUrl,Id)
    .pipe(
      retry(1),
  
      catchError(this.handleError)
    )
  }
  
  
  ConvertJsontoXLSX(postData){
  
    let empUrl=this.clientService.jsonToXlsx();
  
    return this.http.post(empUrl,postData)
    .pipe(
      retry(1),
  
      catchError(this.handleError)
    )
  }
  convertSummaryJsontoXLSX(postData){
    let empUrl=this.clientService.convertSummaryJsontoXLSX();
  
    return this.http.post(empUrl,postData)
    .pipe(
      retry(1),
  
      catchError(this.handleError)
    )
  }

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.status === 0) {
      errorMessage = 'Internal Server Error';
    } else {
      errorMessage = 'Something went wrong. please try again';
    }
    return throwError(errorMessage);
  }

}
