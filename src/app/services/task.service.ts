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

export class TaskService {

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


        getAllTask(){
            let empUrl=this.clientService.getAllTask();


            // return this.http.post(empUrl,orgId,this.httpOptions)
            // .pipe(
            //   retry(1),

            //   catchError(this.handleError)
            // )
            return this.http.get(empUrl,this.httpOptions)
            .pipe(
              retry(1),

              catchError(this.handleError)
            )
        }


        AddTask(postData)  {
    let empUrl=this.clientService.AddTask();
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
 postData['createdby']=user['full_name'];
//  postData['org_id']=localStorage.getItem('org_id');
 postData['empid']=user['id'];


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getByTaskID(postData)  {
    let empUrl=this.clientService.getByTaskID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  updateDept(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.updateDept();

    return this.http.put(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }

  //not required
  GetAllTaskByEmpIDAndProjectIDAndMilestoneIDAndTaskID(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['empID']=user['id'];

    let empUrl=this.clientService.GetAllTaskByEmpIDAndProjectIDAndMilestoneIDAndTaskID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  GetAllProjectTaskListByEmpIDAndProjectIDAndMilestoneIDAndTaskID(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
    postData['empID']=user['id'];
    let empUrl=this.clientService.GetAllProjectTaskListByEmpIDAndProjectIDAndMilestoneIDAndTaskID();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  GetAllFilterLocalTaskListByEmpIDAndProjectIDAndMilestoneIDAndTaskID(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
    postData['empID']=user['id'];
    let empUrl=this.clientService.GetAllFilterLocalTaskListByEmpIDAndProjectIDAndMilestoneIDAndTaskID();
    return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
  }

  GetAllTaskListByEmployeeID(){
    let empUrl=this.clientService.GetAllTaskListByEmployeeID();
    let empId = JSON.parse(localStorage.getItem('user_info'));
    let postData ={
      id: empId.id
    }
    return this.http.post(empUrl,postData).pipe(retry(1),catchError(this.handleError))
  }

  GetAllProjectTaskListByEmployeeID(){
    let empUrl=this.clientService.GetAllProjectTaskListByEmployeeID();
    let empId = JSON.parse(localStorage.getItem('user_info'));
    let postData ={
      id: empId.id
    }
    return this.http.post(empUrl,postData).pipe(retry(1),catchError(this.handleError))
  }

  GetAllMainandLocalTaskListByEmpId(){
    let empUrl=this.clientService.GetAllMainandLocalTaskListByEmpId();
    let empId = JSON.parse(localStorage.getItem('user_info'));
    let postData ={
      id: empId.id
    }
    return this.http.post(empUrl,postData).pipe(retry(1),catchError(this.handleError))
  }


  delTask(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.delTask();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  AddPriority(postData)  {
    let empUrl=this.clientService.AddPriority();
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
  getAllPriority(){
    let empUrl=this.clientService.getAllPriority();


    // return this.http.post(empUrl,orgId,this.httpOptions)
    // .pipe(
    //   retry(1),

    //   catchError(this.handleError)
    // )
    return this.http.get(empUrl,this.httpOptions)
    .pipe(
      retry(1),

      catchError(this.handleError)
    )
}
getByPriorityID(postData)  {
    let empUrl=this.clientService.getByPriorityID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  updatePriority(postData)  {
    let empUrl=this.clientService.updatePriority();
    postData['org_id']=localStorage.getItem('org_id');


    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  delPriority(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.delPriority();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  delTaskStatus(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.delTaskStatus();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  delIndType(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.delIndType();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  AddStatus(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['createdby']=user['full_name'];

    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.AddStatus();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  getAllTaskStatus(){
    let empUrl=this.clientService.getAllTaskStatus();


    // return this.http.post(empUrl,orgId,this.httpOptions)
    // .pipe(
    //   retry(1),

    //   catchError(this.handleError)
    // )
    return this.http.get(empUrl,this.httpOptions)
    .pipe(
      retry(1),

      catchError(this.handleError)
    )
}
getByStatusID(postData){
    let empUrl=this.clientService.getByStatusID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  updateStatus(postData)  {
    let empUrl=this.clientService.updateStatus();
    postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateTaskStatus(postData)  {
    let empUrl=this.clientService.UpdateTaskStatus();


    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllTaskByEmpID()  {
    let user_id=JSON.parse(localStorage.getItem('user_info'));
    let postData={
      id:user_id['id']
    }
    let empUrl=this.clientService.GetAllTaskByEmpID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllTaskByOrgAndEmpID()  {
    let user_id=JSON.parse(localStorage.getItem('user_info'));
    let postData={
      EmpID:user_id['id']
    }
    postData['OrgID']=localStorage.getItem('org_id');
    let empUrl=this.clientService.GetAllTaskByOrgAndEmpID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  fetchGridDataByTaskEmpID()  {
    let user_id=JSON.parse(localStorage.getItem('user_info'));
    let empUrl=this.clientService.fetchGridDataByTaskEmpID();
    let postData={
      id:user_id['id']
    }


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
updateEmpTaskStatus(postData)  {
  let user={};
  if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));


  }
  let empUrl=this.clientService.updateEmpTaskStatus();
  postData['empid']=user['id'];

  postData['modifiedby']=user['full_name'];
  postData['org_id']=localStorage.getItem('org_id');

  return this.http.patch(empUrl, postData)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
GetStatusByOrgID(){

  let empUrl=this.clientService.GetStatusByOrgID();
  let org_id={
    ID: localStorage.getItem('org_id')
  }
  return this.http.post(empUrl,org_id)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}
GetPriorityByOrgID(){

  let empUrl=this.clientService.GetPriorityByOrgID();
  let org_id={
    ID: localStorage.getItem('org_id')
  }
  return this.http.post(empUrl,org_id)
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
