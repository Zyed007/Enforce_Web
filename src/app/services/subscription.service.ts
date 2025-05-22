import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


let orgId={
    id: localStorage.getItem('org_id')
}
let user_info:object;
let planId;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));
    

}

@Injectable(
{ providedIn: 'root'}
)

export class SubscriptionService {
public planId;
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


      

 
        AddPlan(postData)  {
          let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    let empUrl=this.clientService.AddPlan();
 postData['createdby']=user['full_name'];
//  postData['org_id']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddPlanFeature(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    let empUrl=this.clientService.AddPlanFeature();
 postData['createdby']=user['full_name'];
//  postData['org_id']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddPlanPrice(postData)  {
    let user;
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
      
  
  }
    let empUrl=this.clientService.AddPlanPrice();
 postData['createdby']=user['full_name'];
//  postData['org_id']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  
  FindPlanPriceByPlanID(postData)  {
    let empUrl=this.clientService.FindPlanPriceByPlanID();
 
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByPlanID(postData)  {
    let empUrl=this.clientService.FindByPlanID();
 
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByPlanPriceID(postData)  {
    let empUrl=this.clientService.FindByPlanPriceID();
 
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByPlanFeatureID(postData)  {
    let empUrl=this.clientService.FindByPlanFeatureID();
 
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddBilling(postData)  {
    let empUrl=this.clientService.AddBilling();
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    postData['user_id']=user['user_id'];
    postData['user_email']=user['workemail'];
    postData['createdby']=user['full_name'];
 
    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateSubscription(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    let empUrl=this.clientService.UpdateSubscription();
    postData['user_id']=user['user_id'];
    postData['modifiedby']=user['full_name'];
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  GetPlanDetail()  {
    let empUrl=this.clientService.GetPlanDetail();
 
    return this.http.get(empUrl)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdatePlan(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    
    postData['modifiedby']=user['full_name'];

    let empUrl=this.clientService.UpdatePlan();
 
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  UpdatePlanFeature(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    postData['modifiedby']=user['full_name'];

    let empUrl=this.clientService.UpdatePlanFeature();
 
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  UpdatePlanPrice(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    postData['modifiedby']=user['full_name'];

    let empUrl=this.clientService.UpdatePlanPrice();
 
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemovePlan(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.RemovePlan();
 
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemovePlanFeature(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.RemovePlanFeature();
 
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemovePlanPrice(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
        
    
    }
    postData['modifiedby']=user['full_name'];
    let empUrl=this.clientService.RemovePlanPrice();
 
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  
  GetAllPlan(){
    let empUrl=this.clientService.GetAllPlan();
    
 
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
  GetAllPlanFeature(){
    let empUrl=this.clientService.GetAllPlanFeature();
    
 
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
GetAllPlanPrice(){
    let empUrl=this.clientService.GetAllPlanPrice();
    
 
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
setPlanId(id){
  planId=id;

}
getPlanId(){


  return planId;
}
  AddPriority(postData)  {
    let empUrl=this.clientService.AddPriority();

 postData['createdby']=user_info['full_name'];
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

 
    return this.http.put(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  delPriority(postData){
    postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.delPriority();
 
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  delTaskStatus(postData){
    postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.delTaskStatus();
 
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  delIndType(postData){
    postData['modifiedby']=user_info['full_name'];
    let empUrl=this.clientService.delIndType();
 
    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  AddStatus(postData){
    postData['createdby']=user_info['full_name'];
  
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
  let empUrl=this.clientService.updateEmpTaskStatus();
  postData['empid']=user_info['id'];
  postData['createdby']=user_info['full_name'];
  postData['modifiedby']=user_info['full_name'];
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
