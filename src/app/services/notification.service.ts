import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Subject } from 'rxjs';
// import { CONFIGURATION } from '../_models/app.constants';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
let UtilsOrgIDAndPrefix={
    orgID:'',
prefix:''
}
@Injectable({
  providedIn: 'root'
})

export class NotificationService {
    constructor( private clientService: ClientService,private http: HttpClient,) {
    
    }
  private connection: signalR.HubConnection;
  connectionEstablished = new Subject<Boolean>();
   locationCordinates = new Subject();

  connect() {
    if (!this.connection) {
      this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.clientService.NotifyService() )
      .build();
console.log('connection',this.connection)
      this.connection.start().then(() => {
        console.log('Hub connection started');
        this.connectionEstablished.next(true);
      }).catch(err => console.log(err));
      console.log('connection',this.connection)

      this.connection.on('Notification', (DATA) => {
          console.log('Received',DATA);
        //this.locationCordinates.next({ postData.orgID, postData.prefix });
      });
     }
  }

 
  disconnect() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }
  AddNotifyType(postData)  {
    let user:object;
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    let empUrl=this.clientService.AddNotifyType();
//  postData['empID']=user['id'];
  postData['org_id']=localStorage.getItem('org_id');
  postData['createdby']=user['full_name'];

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
 

  UpdateNotifyType(postData)  {
    let user:object;
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    let empUrl=this.clientService.UpdateNotifyType();
    postData['org_id']=localStorage.getItem('org_id');
  postData['modifiedby']=user['full_name'];
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveNotifyType(postData)  {
   
    let empUrl=this.clientService.RemoveNotifyType();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByNotifyTypeID(postData)  {
   
    let empUrl=this.clientService.FindByNotifyTypeID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  PushNotifyByEmpID()  {
    let user:object;
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
let postData={
  id:user['id']
}
    let empUrl=this.clientService.PushNotifyByEmpID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchGridDataNotifyTypeByOrgID()  {
   
    let empUrl=this.clientService.FetchGridDataNotifyTypeByOrgID();
    let postData={
      "orgID": localStorage.getItem('org_id')
    }
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetAllViewedNotifyByEmpID()  {
    let user:object;
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    let empUrl=this.clientService.GetAllViewedNotifyByEmpID();
    let postData={
      "id": user['id']
    }
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddNotify(postData)  {
    let user:object;
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    let empUrl=this.clientService.AddNotify();
//  postData['empID']=user['id'];
  postData['org_id']=localStorage.getItem('org_id');
  postData['createdby']=user['full_name'];

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
 

  UpdateNotify(postData)  {
    let user:object;
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    let empUrl=this.clientService.UpdateNotify();
    postData['org_id']=localStorage.getItem('org_id');
  postData['modifiedby']=user['full_name'];
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveNotify(postData)  {
   
    let empUrl=this.clientService.RemoveNotify();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByNotifyID(postData)  {
   
    let empUrl=this.clientService.FindByNotifyID();
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchGridDataNotifyByOrgID()  {
   
    let empUrl=this.clientService.FetchGridDataNotifyByOrgID();
    let postData={
      "orgID": localStorage.getItem('org_id')
    }
    return this.http.post(empUrl, postData)
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