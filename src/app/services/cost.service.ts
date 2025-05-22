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

export class CostService {

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
        AddProjectTask(postData){
          let empUrl=this.clientService.AddProjectTask();
          return this.http.post(empUrl, postData)
          .pipe(
            retry(1),

            catchError(this.handleError)
          )
      }
      UpdateProjectIdTask(postData){

        let empUrl=this.clientService.UpdateProjectIdTask();
        postData['org_id']=localStorage.getItem('org_id');

        return this.http.patch(empUrl, postData)
        .pipe(
          retry(1),

          catchError(this.handleError)
        )
    }

        GetProjectTypeByOrgID(){
          let Id={
            ID: localStorage.getItem('org_id')
        }
          let empUrl=this.clientService.GetProjectTypeByOrgID();


          return this.http.post(empUrl,Id)
          .pipe(
            retry(1),

            catchError(this.handleError)
          )
      }

        AddProject(postData)  {
          let user={};
          if(localStorage.getItem('user_info')){
            user= JSON.parse(localStorage.getItem('user_info'));


          }
    let empUrl=this.clientService.AddProject();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');
 postData['user_id']=localStorage.getItem('user_id');

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  AddTypeOfDesign(postData)  {
    let empUrl=this.clientService.AddTypeOfDesign();
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
  SetUnitAddOrRemovedByUnitID(postData){
    let user={};

    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.SetUnitAddOrRemovedByUnitID();
    postData['modifiedBy']=user['full_name'];
   //  postData['org_id']=localStorage.getItem('org_id');


       return this.http.post(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )
  }
  setReverseCalc(postData)  {
    let empUrl=this.clientService.setReverseCalc();
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
 postData['createdby']=user['full_name'];

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  AddUnitDescription(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddUnitDescription();
    postData['createdby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');


       return this.http.post(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )
  }
  FetchAllUnitDescriptionByOrgID(){
    let postData={
      'ID':localStorage.getItem('org_id')

    }
    let empUrl=this.clientService.FetchAllUnitDescriptionByOrgID();


       return this.http.post(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )
  }
  FindByUnitDescriptionID(postData){
    let empUrl=this.clientService.FindByUnitDescriptionID();



       return this.http.post(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )
  }
  UpdateUnitDescription(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateUnitDescription();
    postData['org_id']=localStorage.getItem('org_id');
    postData['modifiedby']=user['full_name'];
    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateStaticCostTask(postData){
    let empUrl=this.clientService.UpdateStaticCostTask();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateIsSelectedByTaskID(postData){
    let empUrl=this.clientService.UpdateIsSelectedByTaskID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateCostProjectNotesQtyTaskID(postData){
    let empUrl=this.clientService.UpdateCostProjectNotesQtyTaskID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateCostProjectTaskQtyTaskID(postData){
    let empUrl=this.clientService.UpdateCostProjectTaskQtyTaskID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  GetLastAddedCostPrefixByOrgID(){

    let postData={
      'id':localStorage.getItem('org_id')

    }
    let empUrl=this.clientService.GetLastAddedCostPrefixByOrgID();


       return this.http.post(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )

  }

  GetAllStaticMilestoneByOrgID(){
    let postData={
      'id':localStorage.getItem('org_id')

    }
    let empUrl=this.clientService.GetAllStaticMilestoneByOrgID();


       return this.http.post(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )
  }
  UpdateCostProjectBudgetedHoursTaskID(postData){
    let empUrl=this.clientService.UpdateCostProjectBudgetedHoursTaskID();


       return this.http.post(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )
  }

  UpdateCostProjectFinalValueByCostProjectID(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateCostProjectFinalValueByCostProjectID();
    postData['createdby']=user['full_name'];


       return this.http.patch(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )
  }
  GetAllStaticMilestoneTasksByMilestoneID(postData){
    let empUrl=this.clientService.GetAllStaticMilestoneTasksByMilestoneID();

    postData['orgID']=localStorage.getItem('org_id');

       return this.http.post(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )
  }
  GetAllStaticMilestoneByMilestoneID(postData){
    let empUrl=this.clientService.GetAllStaticMilestoneByMilestoneID();

    postData['orgID']=localStorage.getItem('org_id');

       return this.http.post(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )
  }

  FindByCostProjectID(postData){
    let empUrl=this.clientService.FindByCostProjectID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveCostProjectByID(postData){
    let empUrl=this.clientService.RemoveCostProjectByID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateCostProject(postData){
    let empUrl=this.clientService.UpdateCostProject();

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateCostProjectStatusByID(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateCostProjectStatusByID();
    postData['modifiedby']=user['full_name'];

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  AddPaymentPolicy(postData){
    let empUrl=this.clientService.AddPaymentPolicy();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  AddProformaInvoice(postData){
    let empUrl=this.clientService.AddProformaInvoice();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  GetPaymentPolicyByOrgId(postData){
    let empUrl=this.clientService.GetPaymentPolicyByOrgId();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  FetchPaymentPolicy(postData){
    let empUrl=this.clientService.FetchPaymentPolicy();
    return this.http.post(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  UpdatePaymentPolicy(postData){
    let empUrl=this.clientService.UpdatePaymentPolicy();
    return this.http.patch(empUrl, postData).pipe(retry(1), catchError(this.handleError))
  }

  CalculateCostProject(postData){
    let empUrl=this.clientService.CalculateCostProject();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  FetchAllCostProjectByOrgID(){
    let org_id={
      id: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.FetchAllCostProjectByOrgID();
    return this.http.post(empUrl, org_id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchAllUnitDescriptionExtraByOrgID(){
    let org_id={
      id: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.FetchAllUnitDescriptionExtraByOrgID();
    return this.http.post(empUrl, org_id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveUnitDescriptionByID(postData){
    let empUrl=this.clientService.RemoveUnitDescriptionByID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddSpecifiation(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddSpecifiation();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddPackages(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddPackages();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddCostPerHour(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddCostPerHour();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  AddProfitMargin(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.AddProfitMargin();
 postData['createdby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchCostPerHourOrgID(){
    let org_id={
      id: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.FetchCostPerHourOrgID();
    return this.http.post(empUrl, org_id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FetchProfitMarginOrgID(){
    let org_id={
      id: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.FetchProfitMarginOrgID();
    return this.http.post(empUrl, org_id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveCostPerHourByID(postData){
    let empUrl=this.clientService.RemoveCostPerHourByID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  RemoveProfitMarginByID(postData){
    let empUrl=this.clientService.RemoveProfitMarginByID();


    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByCostPerHourID(postData){
    let empUrl=this.clientService.FindByCostPerHourID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  FindByProfitMarginID(postData){
    let empUrl=this.clientService.FindByProfitMarginID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateCostPerHour(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateCostPerHour();
 postData['modifedby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateProfitMargin(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateProfitMargin();
 postData['modifedby']=user['full_name'];
 postData['org_id']=localStorage.getItem('org_id');

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateCostProjectDiscountAndTotalCostTaskID(postData){
    let empUrl=this.clientService.UpdateCostProjectDiscountAndTotalCostTaskID();
    // postData['modifedby']=user_info['full_name'];

       return this.http.post(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )

  }
  GetMilestoneAndTasksByProjectID(postData){
    let empUrl=this.clientService.GetMilestoneAndTasksByProjectID();
    // postData['modifedby']=user_info['full_name'];

       return this.http.post(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )

  }
  UpdateCostProjectDiscountAndProfitMarginByProjectID(postData){
    let empUrl=this.clientService.UpdateCostProjectDiscountAndProfitMarginByProjectID();
    // postData['modifedby']=user_info['full_name'];

       return this.http.patch(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )

  }

  FetchAllPackagesByOrgID(){
    let org_id={
      id: localStorage.getItem('org_id')
  }
    let empUrl=this.clientService.FetchAllPackagesByOrgID();
    return this.http.post(empUrl, org_id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  FindByPackagesID(postData){
    let empUrl=this.clientService.FindByPackagesID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemovePackagesByID(postData){
    let empUrl=this.clientService.FindByPackagesID();

    return this.http.post(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  UpdatePackages(postData){
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdatePackages();
    postData['modifiedby']=user['full_name'];
    postData['org_id']=localStorage.getItem('org_id');


       return this.http.patch(empUrl, postData)
       .pipe(
         retry(1),
         catchError(this.handleError)
       )

  }
  UpdateCostProjectDetails(postData){
    // let user={};
    // if(localStorage.getItem('user_info')){
    //   user= JSON.parse(localStorage.getItem('user_info'));


    // }
    let empUrl=this.clientService.UpdateCostProjectDetails();
    // postData['modifiedby']=user['full_name'];
    // postData['org_id']=localStorage.getItem('org_id');


       return this.http.patch(empUrl, postData)
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
  FindByProjectActivityID(postData)  {
    let empUrl=this.clientService.FindByProjectActivityID();

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
  RemoveTypeOfDesignByID(postData){

    let empUrl=this.clientService.RemoveTypeOfDesignByID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  RemoveSpecifiationByID(postData){

    let empUrl=this.clientService.RemoveSpecifiationByID();

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
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    postData['modifiedby']=user['full_name'];
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
    postData['modifiedby']=user_info['full_name'];
    postData['empid']=user_info['id'];
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
  FetchAllTypeOfDesignByOrgID(){
    let postData={
      'ID':localStorage.getItem('org_id')

    }

    let empUrl=this.clientService.FetchAllTypeOfDesignByOrgID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  FetchAllSpecifiationByOrgID(){
    let postData={
      'ID':localStorage.getItem('org_id')

    }

    let empUrl=this.clientService.FetchAllSpecifiationByOrgID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }
  FindByTypeOfDesignID(postData){


    let empUrl=this.clientService.FindByTypeOfDesignID();

    return this.http.post(empUrl,postData,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
    }
    FindBySpecifiationID(postData){


      let empUrl=this.clientService.FindBySpecifiationID();

      return this.http.post(empUrl,postData,this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
      }

  UpdateSpecifiation(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateSpecifiation();
    postData['org_id']=localStorage.getItem('org_id');

 postData['modifiedby']=user['full_name'];

    return this.http.patch(empUrl, postData)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  UpdateTypeOfDesign(postData)  {
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateTypeOfDesign();
    postData['org_id']=localStorage.getItem('org_id');

 postData['modifiedby']=user['full_name'];

    return this.http.patch(empUrl, postData)
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
  AddCostProject(postData)  {
    let empUrl=this.clientService.AddCostProject();
//  postData['createdby']=user_info['full_name'];

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
    let user={};
    if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));


    }
    let empUrl=this.clientService.UpdateProjectStatusByID();

  postData['modifiedby']=user['full_name'];

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
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Internal Server Error`;
    }
    return throwError(errorMessage);
 }
}
