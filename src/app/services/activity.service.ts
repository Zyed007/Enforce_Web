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

export class ActivityService {

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

            return this.http.get(empUrl)
            .pipe(
              retry(1),

              catchError(this.handleError)
            )
        }

        AdminProductivityTimeFrequencyByEmpIDAndDate(postData)  {
          let user:object;
          if(localStorage.getItem('user_info')){
            user= JSON.parse(localStorage.getItem('user_info'));


          }
          let empUrl=this.clientService.AdminProductivityTimeFrequencyByEmpIDAndDate();
      //  postData['empID']=user['id'];
        postData['orgID']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }


        ProductiveByDeptIDAndDate(postData)  {

          let empUrl=this.clientService.ProductiveByDeptIDAndDate();
          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        ProductiveByTeamIDAndDate(postData)  {

          let empUrl=this.clientService.ProductiveByTeamIDAndDate();
          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        ProductiveByOrgIDAndDate(postData)  {
          let empUrl=this.clientService.ProductiveByOrgIDAndDate();
          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        EmployeeProductivityTimeFrequencyByEmpIDAndDate(postData)  {
          let user:object;
          if(localStorage.getItem('user_info')){
            user= JSON.parse(localStorage.getItem('user_info'));


          }
          let empUrl=this.clientService.EmployeeProductivityTimeFrequencyByEmpIDAndDate();
      //  postData['empID']=user['id'];
      //  postData['org_id']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        EmpProductivityDashboard(postData)  {
          let user:object;
          if(localStorage.getItem('user_info')){
            user= JSON.parse(localStorage.getItem('user_info'));


          }
          let empUrl=this.clientService.EmpProductivityDashboard();
      //  postData['empID']=user['id'];
      //  postData['org_id']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        DesktopEmpProductivity(postData)  {
          let user:object;
          if(localStorage.getItem('user_info')){
            user= JSON.parse(localStorage.getItem('user_info'));


          }
          let empUrl=this.clientService.DesktopEmpProductivity();
          postData['empID']=user['id'];
      //  postData['org_id']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        AppTrackedByOrgIDByEntityIDAndDate(postData)  {

          let empUrl=this.clientService.AppTrackedByOrgIDByEntityIDAndDate();

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        GetEmployeeTasksTimesheetByEmpID(postData)  {
          // let user:object;
          // if(localStorage.getItem('user_info')){
          //   user= JSON.parse(localStorage.getItem('user_info'));
          //

          // }
          let empUrl=this.clientService.GetEmployeeTasksTimesheetByEmpID();
      //  postData['empID']=user['id'];
      //  postData['org_id']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        WorkforceProductiveByOrgIDAndDate(postData)  {
          // let user:object;
          // if(localStorage.getItem('user_info')){
          //   user= JSON.parse(localStorage.getItem('user_info'));
          //

          // }
          let empUrl=this.clientService.WorkforceProductiveByOrgIDAndDate();
      //  postData['empID']=user['id'];
        // postData['org_id']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        WorkforceProductiveByDeptIDAndDate(postData)  {
          // let user:object;
          // if(localStorage.getItem('user_info')){
          //   user= JSON.parse(localStorage.getItem('user_info'));
          //

          // }
          let empUrl=this.clientService.WorkforceProductiveByDeptIDAndDate();
      //  postData['empID']=user['id'];
      //  postData['org_id']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        WorkforceProductiveByTeamIDAndDate(postData)  {
          // let user:object;
          // if(localStorage.getItem('user_info')){
          //   user= JSON.parse(localStorage.getItem('user_info'));
          //

          // }
          let empUrl=this.clientService.WorkforceProductiveByTeamIDAndDate();
      //  postData['empID']=user['id'];
      //  postData['org_id']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }

        WorkforceEmployeeProductiveByOrgIDAndDate(postData)  {
          // let user:object;
          // if(localStorage.getItem('user_info')){
          //   user= JSON.parse(localStorage.getItem('user_info'));
          //

          // }
          let empUrl=this.clientService.WorkforceEmployeeProductiveByOrgIDAndDate();
      //  postData['empID']=user['id'];
        // postData['org_id']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        WorkforceEmployeeProductiveByDeptIDAndDate(postData)  {
          // let user:object;
          // if(localStorage.getItem('user_info')){
          //   user= JSON.parse(localStorage.getItem('user_info'));
          //

          // }
          let empUrl=this.clientService.WorkforceEmployeeProductiveByDeptIDAndDate();
      //  postData['empID']=user['id'];
      //  postData['org_id']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        WorkforceEmployeeProductiveByTeamIDAndDate(postData)  {
          // let user:object;
          // if(localStorage.getItem('user_info')){
          //   user= JSON.parse(localStorage.getItem('user_info'));
          //

          // }
          let empUrl=this.clientService.WorkforceEmployeeProductiveByTeamIDAndDate();
      //  postData['empID']=user['id'];
      //  postData['org_id']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        ProjectDetailByEmpIDAndDate(postData)  {
          let user:object;
          if(localStorage.getItem('user_info')){
            user= JSON.parse(localStorage.getItem('user_info'));


          }
          let empUrl=this.clientService.ProjectDetailByEmpIDAndDate();
       // postData['id']=user['id'];
      //  postData['org_id']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }



        GetEmployeeTasksTimesheetByOrgID(postData)  {
          // let user:object;
          // if(localStorage.getItem('user_info')){
          //   user= JSON.parse(localStorage.getItem('user_info'));
          //

          // }
          let empUrl=this.clientService.GetEmployeeTasksTimesheetByOrgID();
      //  postData['empID']=user['id'];
        postData['orgID']=localStorage.getItem('org_id');

          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),
            catchError(this.handleError)
          )
        }
        //old function
        AddTimesheetActivity(postData)  {
          let user={};
          if(localStorage.getItem('user_info')){
            user= JSON.parse(localStorage.getItem('user_info'));


          }
    let empUrl=this.clientService.AddTimesheetActivity();
 postData['createdby']=user['full_name'];

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

//new function
AddTimesheetActivityLog(postData){
  let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
    }
  let empUrl=this.clientService.AddTimesheetActivityLog();
  postData['createdby']=user['full_name'];
  return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
}

UpdateAdvancetoRevenue(postData){
  let empUrl=this.clientService.UpdateAdvancetoRevenue();
  return this.http.post(empUrl, postData).pipe(retry(1),catchError(this.handleError))
}


  AddTimesheetAdminActivity(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddTimesheetAdministrativeActivity();
 postData['createdby']=user['full_name'];
//  postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  EmployeeAppTrackedByEmpIDAndDate(postData)  {
    let empUrl=this.clientService.EmployeeAppTrackedByEmpIDAndDate();
//  postData['org_id']=localStorage.getItem('org_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetTop10TimesheetActivityOnTaskID(postData)  {
    let empUrl=this.clientService.GetTop10TimesheetActivityOnTaskID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetTop10TimesheetAdminActivityOnGroupIDAndAdminID(postData)  {
    let empUrl=this.clientService.GetTop10TimesheetAdminActivityOnGroupIDAndAdminID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
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
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['createdby']=user['full_name'];
    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');

    let empUrl=this.clientService.UpdateAdministrative();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  EmployeeProductivityPerDateByOrgIDAndDate(postData){
    let empUrl=this.clientService.EmployeeProductivityPerDateByOrgIDAndDate();
      postData['orgID']=localStorage.getItem('org_id');

        return this.http.post(empUrl, postData)
        .pipe(
          retry(1),
          catchError(this.handleError)
        )
  }
  ProductivityGraphByOrgIDAndDate(postData)  {
    let empUrl=this.clientService.ProductivityGraphByOrgIDAndDate();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  ProductiveGraphByTeamIDAndDate(postData)  {
    let empUrl=this.clientService.ProductiveGraphByTeamIDAndDate();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  ProductiveGraphByDeptIDAndDate(postData)  {
    let empUrl=this.clientService.ProductiveGraphByDeptIDAndDate();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AppTrackedByOrgIDAndDate(postData)  {
    let empUrl=this.clientService.AppTrackedByOrgIDAndDate();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddEntityApps(postData)  {
    let empUrl=this.clientService.AddEntityApps();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateEntityApps(postData)  {
    let empUrl=this.clientService.UpdateEntityApps();
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getProfileImage(imageId: string): Observable<Blob> { //imageId: string + imageId
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*' ,
      'Access-Control-Allow-Origin':  '*'
    });
    return this.http.get<Blob>( imageId, {headers: headers, responseType: 'blob' as 'json' });
}

  EmployeeScreenshotsPerDateByOrgIDAndDate(postData){
    let empUrl=this.clientService.EmployeeScreenshotsPerDateByOrgIDAndDate();
      postData['orgID']=localStorage.getItem('org_id');

        return this.http.post(empUrl, postData)
        .pipe(
          retry(1),
          catchError(this.handleError)
        )
  }
  RemoveAdministrative(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.RemoveAdministrative();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  GetAllTimesheetActivitys()  {
    let empUrl=this.clientService.GetAllTimesheetActivitys();


    return this.http.get(empUrl)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  fetchGridDataByDepartmentOrgID(){
    let postData={
      'orgID':localStorage.getItem('org_id')

    }

    let empUrl=this.clientService.fetchGridDataByDepartmentOrgID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

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
