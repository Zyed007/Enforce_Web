import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Select2OptionData, Select2TemplateFunction } from 'ng2-select2';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import moment = require('moment');
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TeamService } from '../../services/team.service';
import { DesignationService } from '../../services/designation.service';
import { DepartmentService } from '../../services/department.service';
import { DataManager } from '@syncfusion/ej2-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectService } from '../../services/project.service';
import { CostService } from '../../services/cost.service';

@Component({
  selector: 'app-cost-hrs',
  templateUrl: './cost-hrs.component.html',
  styleUrls: ['./cost-hrs.component.scss']
})

export class CostHrsComponent implements OnInit {
  public taskPriority:string;
  public dateValue;
  public taskStatus:string;
  public taskPriorData: Array<Select2OptionData>;
  public taskStatusData: Array<Select2OptionData>;
  public assigneeData: Array<Select2OptionData>;
  public teamData:Array<Select2OptionData>;
  public approverData:Array<Select2OptionData>;
  public milestoneData:Array<Select2OptionData>;
public milestoneValue='';
  public showTaskList=false;
  public showAddForm=true;
  public assigneeStatus: string[];
  public taskOptions:Select2Options;
  public assigneeOptions:Select2Options;
  
  public editable=false;
  public taskForm: FormGroup;
  public form: FormGroup;
  public ejsDueDate;
  groupModel: any;
  p: number = 1;
  public filterEmpByDesgn=false;
  public filterEmpByDept=false;
  public filterEmpByFreeLanc=false;
  public filterEmpByOutsource=false;
  empDataSource: any;

  // public date=moment().format('dddd, D MMM YYYY');  
  public dueDate;
  public teamMembers=[];
  public teamMemFetchData=[];
  public teams=[];
  
   public teamsValFetchData=[];
   public disableTaskStatus=false;
   dataSource: any;
  //dataSource: MatTableDataSource<UserData>;
  employeeList=[];
  // private paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['index','task_name','full_name','status_name','priority_name','due_date','Action'];
  displayedEmpColumns= ['index','Job', 'CheckIn', 'CheckOut','Action'];
  public AddNewSubmit=true;
  public options: Select2Options;
  public desgnData: Array<Select2OptionData>;
  public deptData: Array<Select2OptionData>;
  
  public typeOfUnit = [{
    "id": '1',
    "text": 'Select'
  }, {
    "id": '2',
    "text": 'Hours'
  }]

  editTaskId: any;
  searchField: string;
  teamAdd: boolean;
  teamValue: any;
  teamMembersData: { id: string; text: string; }[];
  desgnEmpValue: any;
  deptEmpValue: any;
  teamEmpName: string;
  teamMemberValue: any;
  approver: boolean;
  pageSettings: { pageSizes: boolean; pageCount: number; };
  toolbar: string[];
  isApprove: any;
  approverTaskValue: any='';
  taskApprove: any;
  addformSubmitted: any=false;
  showerrorMsg: boolean;
  editformSubmitted: any=false;
  emptoolbar: string[];
  @ViewChild('empgrid',{   static: false })
  empgrid;
  @ViewChild('grid',{   static: false })
  grid;
  selectedCategData: { id: string; text: string; additional: { teamBy: string; }; }[];
  acttaskListValue: any='';
  recentTaskSel: boolean;
  activityDataText: any;
  projidText: any;
  projid='';
  recentActSel: boolean;
  activtasksList: { id: string; text: string; }[];
  linkToProj: boolean;
  jobOptions: { placeholder: string; width: string; templateResult: Select2TemplateFunction; templateSelection: Select2TemplateFunction; };
  leadValue: any;
  showAssigneeApprove: boolean=false;
  showAssigneeLead: boolean=false;
  emailForm: FormGroup;
  submitClicked: boolean=false;
  editHrsId: any;
  constructor(public taskService:TaskService,private projectService:ProjectService,private costService:CostService, private spinner:NgxSpinnerService, private toastr: ToastrService,private deptService:DepartmentService, private desgnService:DesignationService, private teamService:TeamService,  private formBuilder: FormBuilder,public empService:EmployeeService,
    protected cdr: ChangeDetectorRef,) { 
    this.taskPriority = '0';
    this.taskStatus = '0';
    
    this.options = {
      multiple: true,
      placeholder: "Select",
      // allowClear: true,
      width: "100%",
      templateResult: this.templateResult,
      templateSelection: this.templateSelection
   
  
    }
    this.jobOptions={
      placeholder:"Select",
      width: "100%",
      templateResult: this.templateResult,
      templateSelection: this.templateSelection,
      
    }
  this.taskStatusData = [
   
    
  
  ]
  this.assigneeData = [
   
    

  ]
  this.taskOptions={
    placeholder: { id: '', text: 'Select' },
    width:'100%'
  }
  this.assigneeOptions={
    multiple:true,
    placeholder:"Select",
    width: "100%",
    templateResult: this.templateResult,
    templateSelection: this.templateSelection,
    
  }
  }
  public changedPriority(e: any): void {
    this.taskPriority= e.value;

  }
  public changedMilestone(e) {
    this.milestoneValue= e.value;
    
    const emails = this.emailForm.get('emails') as FormArray
     
    if(e.value!=''){
      this.getAllStaticMilestoneTasks(e.value);

    }

  }
  public goBack(){
    window.history.go(-1);
  }
  isFieldValid(field: string) {
    if(this.addformSubmitted){
      return (
      this.showerrorMsg=true,
        this.taskForm.get(field).errors && this.taskForm.get(field).touched ||
        this.taskForm.get(field).untouched &&
        this.addformSubmitted
      );
    }
    else if(this.editformSubmitted){
      return (
        this.showerrorMsg=true,
      
        this.taskForm.get(field).errors &&
        this.editformSubmitted
      );
    }
    else{

      return (
      this.showerrorMsg=false,

        false
      );
    }
   
  } 
  public checkIsProject(e:any){
    
    if(e.srcElement.checked) {
      this.linkToProj=true;
  
    }else{
      this.linkToProj=false;
  
    }
  
  }
  public  FetchAllProjectByOrgID(){
    this.projectService.FetchAllProjectByOrgID().subscribe(
      
      (projectData:any) => {
  
        var results=[{ id: '', text: 'Select',additional:{teamBy:''} }]
        // let dataObj = JSON.parse(data['token']);
      // 
      if(projectData){
        for (var i = 0; i < projectData.length; i++) {
          // logik to create new items
          
          results.push({
          
              id: projectData[i].project_id,
              text: projectData[i].project_name,
              additional:{
                teamBy: projectData[i].project_prefix 
            } 
          
              
           
          });
          
          }
      }
        
  
      
  
  
      
  this.selectedCategData =results;
  
      
  
      },
      error  => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result)=> {
             
            //  this.router.navigate(['/dashboard']);
          })
      
      
      }
      
      )
      }
      public changedProjAct(e: any): void {
        
        if(e.value){
        this.acttaskListValue=e.value;

          this.activityDataText=e.data[0].text;
      this.recentTaskSel=false;
      
        }else{
          this.recentTaskSel=true;
      
      
        }
      
      
       
      }
      public changedOption(e:any){
        
        if(e.value){
          this.projidText=e.data[0].text;
          this.projid=e.value;
          this.recentActSel=false;

        }else{
          this.recentActSel=true;
      
      
        }
       
       this.fetchActByProjectID(e.value)
        // this.showAdminTasks=true;
       
      }

      public fetchActByProjectID(projectId){
        let project_id={
          
            "ID": projectId
          
        }
        
        this.projectService.GetProjectActivityByProjectID(project_id).subscribe(
                
          (data:any) => {
            
      var results=[{ id: '', text: 'Select' }]
            // let dataObj = JSON.parse(data['token']);
          // 
          if(data){
            for (var i = 0; i < data.length; i++) {
              // logik to create new items
              
              results.push({
              
                  id: data[i].id,
                  text: data[i].activity_name
                
              
                  
               
              });
              
              }
          }
      
      
          
      this.activtasksList =results;
      
          },
          error  => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(
              //used Arrow function here
              (result)=> {
                 
                //  this.router.navigate(['/dashboard']);
              })
          
          
          }
          
          )
      }
  changedTaskApprover(e){
    this.approverTaskValue=e.value;
    }
  public checkIsDept(e: any): void{

    if(e.srcElement.checked) {
      this.filterEmpByDept=true;
     
  
    }else{
      this.filterEmpByDept=false;
  
    }
    // this.filterEmpByDept=!this.filterEmpByDept
    if(this.filterEmpByDept){
      this.getAllDept();
      this.teamData=[];

      $('#toggleDesgnCheck').attr("disabled","disabled");
      $('#toggleFreeLanCheck').attr("disabled","disabled");
      $('#toggleOutSourceCheck').attr("disabled","disabled");
    }else{
      $('#toggleDesgnCheck').removeAttr('disabled');
      $('#toggleFreeLanCheck').removeAttr('disabled');
      $('#toggleOutSourceCheck').removeAttr('disabled');

    }
   }
   public checkIsDesgn(e: any): void{
    if(e.srcElement.checked) {
      this.filterEmpByDesgn=true;
     
  
    }else{
      this.filterEmpByDesgn=false;
  
    }
    this.teamData=[];
    if(this.filterEmpByDesgn){
      this.getAllDesignationByOrgID();

      $('#toggleDeptCheck').attr("disabled","disabled");
      $('#toggleFreeLanCheck').attr("disabled","disabled");
      $('#toggleOutSourceCheck').attr("disabled","disabled");
    }else{
      $('#toggleDeptCheck').removeAttr('disabled');
      $('#toggleFreeLanCheck').removeAttr('disabled');
      $('#toggleOutSourceCheck').removeAttr('disabled');

    }
   }
   public checkIsFreeLan(e: any): void{
    if(e.srcElement.checked) {
      this.filterEmpByFreeLanc=true;
     
  
    }else{
      this.filterEmpByFreeLanc=false;
  
    }
    if(this.filterEmpByFreeLanc){
      this.EmpList();

      $('#toggleDeptCheck').attr("disabled","disabled");
      $('#toggleDesgnCheck').attr("disabled","disabled");
      $('#toggleOutSourceCheck').attr("disabled","disabled");
    }else{
      $('#toggleDeptCheck').removeAttr('disabled');
      $('#toggleDesgnCheck').removeAttr('disabled');
      $('#toggleOutSourceCheck').removeAttr('disabled');

    }
   }
   public checkIsOutsource(e: any): void{
    if(e.srcElement.checked) {
      this.filterEmpByOutsource=true;
     
  
    }else{
      this.filterEmpByOutsource=false;
  
    }
    if(this.filterEmpByOutsource){
      this.EmpList();

      $('#toggleDeptCheck').attr("disabled","disabled");
      $('#toggleFreeLanCheck').attr("disabled","disabled");
      $('#toggleDesgnCheck').attr("disabled","disabled");
    }else{
      $('#toggleDeptCheck').removeAttr('disabled');
      $('#toggleFreeLanCheck').removeAttr('disabled');
      $('#toggleDesgnCheck').removeAttr('disabled');

    }
   }
   public changedStatus(e: any): void {
    this.taskStatus= e.value;

  }
  public changedAssignee(e: any): void {
    let user_info:object;
    if(localStorage.getItem('user_info')){
        user_info= JSON.parse(localStorage.getItem('user_info'));
    
    }
    this.assigneeStatus= e.value;
    
    if(this.assigneeStatus.length==1){
      if(this.assigneeStatus[0]==user_info['id']){
        this.showAssigneeApprove=false;
      this.showAssigneeLead=false;

      }else{
        this.showAssigneeApprove=true;
      this.showAssigneeLead=true;

  
      }
  
    }else if(this.assigneeStatus.length>1){
      
        this.showAssigneeLead=true;

      this.showAssigneeApprove=true;
  
  
    }else{
      this.showAssigneeLead=false;


    this.showAssigneeApprove=false;
    }
  
  }
  public changedLeadAssignee(e: any): void {
    this.leadValue= e.value;
   
  }
  public changedTeam(e: any): void {
    this.teamValue= e.value;
   
  }
  public changedEmpDept(e: any): void {
    this.deptEmpValue=e.value;
  
    if(e.value){
      this.EmpList();
    }
  
   
  }
  public changedEmpDesgn(e: any): void {
    this.desgnEmpValue=e.value;
    if(e.value){
      this.EmpList();
    }
  
   
  }
   public  EmpList(){
    if(this.filterEmpByDept){
      let deptId={
        ID:this.deptEmpValue
      }
      this.empService.getEmpByDeptID(deptId).subscribe(
        
        (data:any) => {
          
  
  var results=[{ id: '', text: 'Select' }]
    if(data){
      for (var i = 0; i < data.length; i++) {
  
        results.push({
      
            "id": data[i].id,
            "text": data[i].full_name
        });
      
      }
    }   
  
  
        
  this.teamMembersData =results;
  // this.teamLeadData=results;
        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {
               
              //  this.router.navigate(['/dashboard']);
            })
        
        
        }
        
        )
  
    }
    else if(this.filterEmpByDesgn){
      let desgnId={
        ID:this.desgnEmpValue
      }
      this.empService.getEmpByDesgnID(desgnId).subscribe(
        
        (data:any) => {
          
  
  var results=[{ id: '', text: 'Select' }]
    if(data){
      for (var i = 0; i <data.length; i++) {
  
        results.push({
      
            "id": data[i].id,
            "text": data[i].full_name
        });
      
      }
    }
  
  
        
  this.teamMembersData =results;
  // this.teamLeadData=results;
        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {
               
              //  this.router.navigate(['/dashboard']);
            })
        
        
        }
        
        )
  
    }
    else if(this.filterEmpByFreeLanc){
    
      this.empService.getAllFreelancerEmpByOrgID().subscribe(
        
        (data:any) => {
          
  
  var results=[{ id: '', text: 'Select' }]
    if(data){
      for (var i = 0; i < data.length; i++) {
  
        results.push({
      
            "id": data[i].id,
            "text": data[i].full_name
        });
      
      }
    }
  
  
        
  this.teamMembersData =results;
  // this.teamLeadData=results;
        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {
               
              //  this.router.navigate(['/dashboard']);
            })
        
        
        }
        
        )
  
    }
    else if(this.filterEmpByOutsource){
     
      this.empService.getAllOutsourcedEmpByOrgID().subscribe(
        
        (data:any) => {
          
  
  var results=[{ id: '', text: 'Select' }]
    if(data){
      for (var i = 0; i < data.length; i++) {
  
        results.push({
      
            "id": data[i].id,
            "text": data[i].full_name
        });
      
      }
      
    }
  
        
  this.teamMembersData =results;
  // this.teamLeadData=results;
        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {
               
              //  this.router.navigate(['/dashboard']);
            })
        
        
        }
        
        )
  
    }
    else{
      
      this.empService.getEmployeeByOrgId().subscribe(
        
        (data:any) => {
          
        
  var results=[{ id: '', text: 'Select' }]
  if(data){
    for (var i = 0; i < data.length; i++) {
  
      results.push({
    
          "id": data[i].id,
          "text": data[i].full_name
      });
    
    }
    
  }
  
  
        
  this.teamMembersData =results;
        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {
               
              //  this.router.navigate(['/dashboard']);
            })
        
        
        }
        
        )
  
    }
     
        } 
  public AddForm(){


    this.showTaskList=false;
    this.showAddForm=true;


    this.editformSubmitted=false;
    this.addformSubmitted=false;

this.getAllStaticMilestone();

  
}
public getAllDept(){
  this.deptService.getAllDept().subscribe(
        
    (data:any) => {
      

var results=[{ id: '', text: 'Select' }]
      // let dataObj = JSON.parse(data['token']);
    // 
  if(data){
    for (var i = 0; i < data.length; i++) {
      // logik to create new items
    
      results.push({
    
          "id": data[i].id,
          "text": data[i].dep_name
      });
    
    }
  }


    
this.deptData =results;
    },
    error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        //used Arrow function here
        (result)=> {
           
          //  this.router.navigate(['/dashboard']);
        })
    
    
    }
    
    )
}
public getAllDesignationByOrgID(){
  this.desgnService.getAllDesignationByOrgID().subscribe(
        
    (data:any) => {
      

var results=[{ id: '', text: 'Select' }]
      // let dataObj = JSON.parse(data['token']);
    // 
    if(data){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items
        
        results.push({
        
            "id": data[i].id,
            "text": data[i].designation_name
        });
        
        }
    }

this.desgnData =results;

    
    },
    error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        //used Arrow function here
        (result)=> {
           
          //  this.router.navigate(['/dashboard']);
        })
    
    
    }
    
    )
}
public onEmpListByChange(val){

  if(val=="Department"){
    this.filterEmpByDept=true
    this.filterEmpByDesgn=false
    this.filterEmpByFreeLanc=false
    this.filterEmpByOutsource=false;
    this.getAllDept();


  }
  else if (val=="Designation"){
    this.filterEmpByDesgn=true
    this.filterEmpByDept=false;
    this.filterEmpByFreeLanc=false
    this.filterEmpByOutsource=false;
    this.getAllDesignationByOrgID();
   



  }
  else if (val=="Freelance"){
    this.filterEmpByDesgn=false
    this.filterEmpByDept=false
this.filterEmpByFreeLanc=true
this.filterEmpByOutsource=false


  }
  else{
    this.filterEmpByDesgn=false
    this.filterEmpByDept=false
    this.filterEmpByFreeLanc=false
this.filterEmpByOutsource=true;


  }
  this.EmpList();


}
public templateResult: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }

 

  return jQuery('<div><b>' + state.text+ '</b> ' + '<span> '+ state.additional.teamBy + '</span></div>');
}

// function for selection template
public templateSelection: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }

  return jQuery('<span><b>' + state.text + '</b> ' + state.additional.teamBy + '</span>');
  //return jQuery('<div><b>' + state.text+ '</b></div> ' + '<div>'+ state.additional.teamBy + '</div>');

}
public FindTeamsByOrgID(){
  this.teamService.FindTeamsByOrgID().subscribe(
          
    (data:any) => {
      

var results=[{ id: '', text: 'Select',additional:{teamBy:''} }]
      // let dataObj = JSON.parse(data['token']);
    // 
    if(data){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items
        
        results.push({
        
            id: data[i].id,
            text: data[i].team_name,
            additional:{
              teamBy: data[i].team_by
          } 
        
            
         
        });
        
        }

    }


    
this.teamData =results;

    },
    error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        //used Arrow function here
        (result)=> {
           
          //  this.router.navigate(['/dashboard']);
        })
    
    
    }
    
    )

}
public TaskView(){
  this.fetchDataGrid();
this.clearForm();
  this.showTaskList=true;
  this.showAddForm=false;
  this.editable=false;
  $('#isProj').prop('checked',false);
  this.linkToProj=false;

  this.projid='';
  this.acttaskListValue='';
   

}
isRecentActFieldValid() {
  if(this.addformSubmitted){
    if( this.linkToProj && this.projid=='' ){
this.recentActSel=true;
    }
    else if( this.linkToProj && this.acttaskListValue==''  ){
      this.recentTaskSel=true;
          }
   
        }
  
  else{

    return (
   // this.showerrorMsg=false,

      false
    );
  }
 
}
public onAddSubmit(){ 
  // this.addformSubmitted=true;
  //   this.isRecentActFieldValid();
    this.submitClicked=true;
  //  let date=document.getElementById('dueDate').innerText
  //  $("#dueDate").html("18:56:00");
  //   

  // this.teamCount=this.teamMemFetchData.length;
 

// team_member_empid.push(user_info['id'])

    let postData={
      "cost_per_hour": this.taskForm.get('taskName').value,
    }
    

if(this.taskForm.status=='VALID'){

  this.spinner.show();
     
        return this.costService.AddCostPerHour(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          
          if(data.status==200){
            // this.TaskView();
  this.submitClicked=false;
            
            this.spinner.hide();
this.fetchDataGrid();
            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });

          }
          // this.router.navigate(["/organizations"]);
  
          },
          error  => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              //used Arrow function here
              (result)=> {
                 
                //  this.router.navigate(['/dashboard']);
              })
          
          
          }
          
          )
      
        }
   
 
}


public onEditSubmit(){
  // if(document.getElementById('dueDate').innerText!=''){
  //   this.dueDate=document.getElementById('dueDate').innerText
  // }
  
this.editformSubmitted=true;
  let postData={
    id:this.editTaskId,
     
    cost_per_hour: this.taskForm.get('taskName').value,
   

     
    }
      
     
    if(this.taskForm.status=='VALID'){
      this.spinner.show();

      
       
          return this.costService.UpdateCostPerHour(postData).subscribe(
            (data:any)  => {
              // let dataObj = JSON.parse(data['token']);
            
            
            if(data.status==200){
              this.fetchDataGrid();
            this.spinner.hide();
            this.editformSubmitted=false;

              this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
           });
        
           this.editable=false;

            }
            // this.router.navigate(["/organizations"]);

            },
            error  => {
            this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                //used Arrow function here
                (result)=> {
                   
                  //  this.router.navigate(['/dashboard']);
                })
            
            
            }
            
            )
        
        
     
    }
}
public onAddNewSubmit(){
 
  //  $("#dueDate").html("18:56:00");
  //   
 this.submitClicked=true;
  let postData={
    
    design_name: this.taskForm.get('taskName').value  ,
    
     
    }
    
 

 if(this.taskForm.get('taskName').value!=''  ){
  this.spinner.show();
     
        return this.costService.AddTypeOfDesign(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          
          if(data.status==200){
            this.spinner.hide();
this.taskForm.reset();
this.submitClicked=false;

            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });
      
           

          }
          // this.router.navigate(["/organizations"]);
  
          },
          error  => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              //used Arrow function here
              (result)=> {
                 
                //  this.router.navigate(['/dashboard']);
              })
          
          
          }
        )
 }
}

    public onChange(e){
      this.ejsDueDate=moment(e.value).format('L');
        

    }
    public  getAllStaticMilestone(){
      this.costService.GetAllStaticMilestoneByOrgID().subscribe(
        
        (data:any) => {
    
      var results=[{ id: '', text: 'Select an option' }]
          // let dataObj = JSON.parse(data['token']);
        //  
      
    for (var i = 0; i < data.length; i++) {
    
    results.push({
        "id": data[i].id,
        "text": data[i].milestone_name
    });
    
    }
    
        
    this.milestoneData =results;
        // this.router.navigate(["/organizations"]);
    
        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {
               
              //  this.router.navigate(['/dashboard']);
            })
        
        
        }
        
        )
        }
        public  getAllStaticMilestoneTasks(milesoneId){
          let postData={
            id:milesoneId
          }
          this.costService.GetAllStaticMilestoneTasksByMilestoneID(postData).subscribe(
            
            (data:any) => {
        
              // let dataObj = JSON.parse(data['token']);
              
         if(data){
          this.createTaskForm(data)

         } 
            // this.router.navigate(["/organizations"]);
        
            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {
                   
                  //  this.router.navigate(['/dashboard']);
                })
            
            
            }
            
            )
            }
        public  getAllEmployee(){
          let user_info= JSON.parse(localStorage.getItem('user_info'));
      
          this.empService.getEmployeeByOrgId().subscribe(
            (data:any) => {
              var results=[{ id: user_info['id'], text: 'Me', additional:{
                teamBy: ''
            }  }]
         
              // let dataObj = JSON.parse(data['token']);
            // 
        for (var i = 0; i < data.length; i++) {
        // logik to create new items
         if(data[i].id!=user_info['id']){
          results.push({
            "id": data[i].id,
            "text": data[i].full_name,
             additional:{
              teamBy: data[i].workemail 
          } 
        });
         }
        
       
        
        }
        
            
       
      results.splice(data.length+1, 0,{ id: 'Anyone', text: 'Anyone', additional:{
        teamBy: ''
      }  })
      this.assigneeData =results;
      this.assigneeStatus=[user_info['id']];
        this.showAssigneeLead=false;
        this.showAssigneeApprove=false;
        this.leadValue=user_info['id'];
          
        
           
        
            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {
                   
                  //  this.router.navigate(['/dashboard']);
                })
            
            
            }
            
            )
            }
    public  getAllTask(){
      this.taskService.getAllTask().subscribe(
        
        (data:any) => {

        this.dataSource = data;
        
        // this.router.navigate(["/organizations"]);
  
        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            //used Arrow function here
            (result)=> {
               
              //  this.router.navigate(['/dashboard']);
            })
        
        
        }
        
        )
        }
    
        
        public taskEdit(dept_id){
          
          // this.DesgnList();

          this.AddNewSubmit=false;
          this.editable=true;
        this.editTaskId=dept_id;
        this.showTaskList=false;
        this.showAddForm=true;
       ;
          let postData={
            id:dept_id
          }
          this.costService.FindByCostPerHourID(postData).subscribe(
            (data:any)  => {
             
           
              this.taskForm.patchValue({
           
                taskName: data.cost_per_hour,
                
              })

        
            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {
                   
                  //  this.router.navigate(['/dashboard']);
                })
            
            
            }
            
            )
         
        }
        public onCheckChange(e){
          this.taskApprove=e.value;
          if(e.srcElement.checked==true){
            this.isApprove=true

          }else{
            this.isApprove=false
        
          }
          
        }
        public  getEmployeeByOrgId(){
          this.empService.getEmployeeByOrgId().subscribe(
            
            (data:any) => {
              var results=[{ id: '', text: 'Select' }]
         
              // let dataObj = JSON.parse(data['token']);
            // 
          
        for (var i = 0; i < data.length; i++) {
        // logik to create new items
        
        results.push({
            "id": data[i].id,
            "text": data[i].first_name
        });
        
        }
        
            
        this.approverData =results;
          
        
           
        
            },
            error  => {
              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {
                   
                  //  this.router.navigate(['/dashboard']);
                })
            
            
            }
            
            )
            }
        public fetchDataGrid(){
            this.costService.FetchCostPerHourOrgID().subscribe(
              (data:any)  => {
if(data.length!=0){
this.editable=true;
this.editHrsId=data[0].id;
this.taskEdit(data[0].id);

}else{
this.editable=false;

} }      
              )
        }
        public checkIsTeam(e:any){
          
          if(e.srcElement.checked) {
            this.teamAdd=true;
            this.EmpList();
        
          }else{
            this.teamAdd=false;
        
          }
        
        }
        applyFilter(filterValue: string) {
          this.dataSource.filter = filterValue.trim().toLowerCase();
        }
        public  clearForm() {
          //$("#task_log_modal").modal('hide');
      
          this.taskForm.reset();
          let user_info= JSON.parse(localStorage.getItem('user_info'));

          //  this.assigneeStatus='';
      this.assigneeStatus=[user_info['id']];

          this.teamAdd=false;
          setTimeout(()=>{
           // this.checkTeamValue = false
          });
      
      //$("#task_log_modal").modal('hide');
      
      
          // $('#isTeam').attr('checked',false);
          // $('#isTeam').attr('disabled','disabled');
          // $('#isTeam').prop('checked',false);
          $('#toggleDeptCheck').prop('checked',false);
          $('#toggleDesgnCheck').prop('checked',false);
          $('#toggleOutSourceCheck').prop('checked',false);
          $('#toggleFreeLanCheck').prop('checked',false);
          this.teamAdd=false;
          this.teamValue='';
          this.deptEmpValue='';
          this.desgnEmpValue='';
          this.teamMemberValue='';
          this.teamMembers=[];
          this.isApprove=false;
    this.approverTaskValue='';
          
        }
        public taskDelete(deptId){
          this.spinner.show();
          
          let postData={
            ID:deptId
          }
          this.costService.RemoveTypeOfDesignByID(postData).subscribe(
            (data:any)  => {
              
              if(data.status==200){
                this.fetchDataGrid();
                this.spinner.hide();

                          this.toastr.error(data['desc'], undefined,{
                            positionClass: 'toast-top-center'
                       });
            
                        }
             
          
            },
            error  => {
            this.spinner.hide();

              Swal.fire(
                'Error!',
                error,
                'error'
              ).then(
                //used Arrow function here
                (result)=> {
                 
                })
            
            }
            
            )
          }
          public clearSearchField() {
            this.searchField = '';
            this.fetchDataGrid();
          } 
          public AddTeams(){
            let teamsValFetchData=[]
              if(this.teams.length==0){
                
              
                      this.teams.push(this.teamValue[0])
                      
                     
                      let teamEmpId={
                        ID: this.teamValue[0]
                      }
                      this.empService.FindEmpDepartDesignByTeamID(teamEmpId).subscribe(
                            
                        (data:any) => {
                      
                      data.forEach(element => {
                        this.teamsValFetchData.push(element)
                        teamsValFetchData=this.teamsValFetchData
                         this.teamMemFetchData.push( element);
                      
                    });
                 
                      
                         
                         this.checkedValues()
                        }
                        )
            
              }
              else{
                let teamsValFetchData=[]
                this.teamValue.forEach(element => {
                  if(!this.teams.includes(element)){
                           this.teams.push(element)
          
                           let teamEmpId={
                            ID: element
                          }
                          this.empService.FindEmpDepartDesignByTeamID(teamEmpId).subscribe(
                                
                            (data:any) => {
                          
                          data.forEach(element => {
                           this.teamsValFetchData.push(element)
                           teamsValFetchData=this.teamsValFetchData;
                          // this.teamMemFetchData.push(element);
          
                          
                        });
                        
                  
                     
                      const result = [];
                      const map = new Map();
                      for (const item of this.teamsValFetchData) {
                          if(!map.has(item.id)){
                              map.set(item.id, true);    // set any value to Map
                              result.push({
                                  id: item.id,
                                  full_name: item.full_name,
                                  employee_type_name:item.employee_type_name,
                                  designation_name:item.designation_name
                              });
                          }else{
                            Swal.fire(
                              'Error!',
                             item.full_name + 'has already been added.Please add other employee',
                              'error'
                            ).then(
                              //used Arrow function here
                              (result)=> {
                                 
                                //  this.router.navigate(['/dashboard']);
                              })
                          }
                      }
                      
                      this.teamMemFetchData=result;
                      
                            
                            
                            
                             
                             this.checkedValues()
                            }
                            )
          
                
                  } 
                  //    else{
                  //   Swal.fire(
                  //     'Error!',
                  //      this.teamEmpName + 'has already been added.Please add other employee',
                  //     'error'
                  //   ).then(
                  //     //used Arrow function here
                  //     (result)=> {
                  //        
                  //         this.router.navigate(['/dashboard']);
                  //     })
                  
                  
                  // }
                               
                
                  
                });
                      
                        
                    
                    }
                  
            
            }
          public AddTeamMembers(){
  
              if(this.teamMembers.length==0){
                
              
                      this.teamMembers.push(this.teamMemberValue)
                      
                     
                      let teamEmpId={
                        ID: this.teamMemberValue
                      }
                      this.empService.empDepartDesignByEmpID(teamEmpId).subscribe(
                            
                        (data:any) => {
                          
          
                       
                    
                             this.teamMemFetchData.push({data});
            
                         
            
                        this.checkedValues()
                        }
                        )
            
              }
              else{
          
                if(!this.teamMembers.includes(this.teamMemberValue)){
                    this.teamMembers.push(this.teamMemberValue)
                    
                        // logik to create new items
                        let teamEmpId={
                          ID: this.teamMemberValue
                        }
                        
                        this.empService.empDepartDesignByEmpID(teamEmpId).subscribe(
                              
                          (data:any) => {
                          
                        
                          
                            // this.teamMemFetchData.push(data[0]);
                             this.teamMemFetchData.push({data});
                          
                          // this.empDataSource=new MatTableDataSource(data);
            
                           this.checkedValues()
                          }
                          )
                       
                    
                  }
                  
                  else{
                    Swal.fire(
                      'Error!',
                       this.teamEmpName + 'has already been added.Please add other employee',
                      'error'
                    ).then(
                      //used Arrow function here
                      (result)=> {
                         
                        //  this.router.navigate(['/dashboard']);
                      })
                  
                  
                  }
              }
            
            }
          public checkedValues(){
              const result = [];
              const map = new Map();
              for (const item of this.teamMemFetchData) {
                  if(((!map.has(item.id)) && (!map.has(item.data && item.data.id)))){
                      map.set(((item.id)|| (item.data && item.data.id)), true);    // set any value to Map
                      result.push({
                          id: item.data?item.data.id:item.id,
                          full_name:item.data? item.data.full_name:item.full_name,
                           employee_type_name:item.data?item.data.employee_type_name:item.employee_type_name,
                           designation_name:item.data?item.data.designation_name:item.designation_name
                      });
                  }else{
                    Swal.fire(
                      'Error!',
                      item.data? item.data.full_name + 'has already been added.Please add other employee':item.full_name + 'has already been added.Please add other employee',
                      'error'
                    ).then(
                      //used Arrow function here
                      (result)=> {
                         
                        //  this.router.navigate(['/dashboard']);
                      })
                  }
              }
              
              this.teamMemFetchData=result;
              
          
          
              // this.empDataSource=new MatTableDataSource(this.teamMemFetchData)
              // this.empDataSource.connect().next(this.teamMemFetchData);
              

              this.empgrid.refresh();
  let datas = new DataManager(this.teamMemFetchData);
  this.empDataSource=datas.dataSource['json']
  this.emptoolbar = ['Search' ];
              
            }

          public changedTeamMember(e: any): void {
              this.teamMemberValue=e.value;
              this.teamEmpName=e.data[0].text;
             
            }
            public teamDelete(id){
              
              for(var i = 0;i < this.teamMemFetchData.length; i ++)
          {
            if((this.teamMemFetchData[i].data?this.teamMemFetchData[i].data.id:this.teamMemFetchData[i].id) ==id)
            {
              this.teamMemFetchData.splice(i, 1);
              this.teamMembers.splice(id,1)
              // if(this.teamMemFetchData[i].data){
              //   this.teams.splice(this.teamMemFetchData[i].data.id,1)
          
              // }else{
              //   this.teamMembers.splice(this.teamMemFetchData[i].id,1)
          
              // }
            }
          }
          this.checkedValues();
            }
            public createTaskForm(taskList) {
              const emails = this.emailForm.get('emails') as FormArray
              emails.clear();
              var results = [];
              
              for (var i = 0; i < taskList.length; i++) {
          
                emails.push(this.createEmailFormGroup())
          
                results.push({ Label: taskList[i].task_name, id: taskList[i].id,UnitType: '2',unit_no:taskList[i].qty })
                // emails.controls.forEach(pair => pair.patchValue({ Label: this.typeOfTask[i].id }));
          
          
              }
              emails.patchValue(results);
            }
            public qtyChange(e, id) {
             

             
            }
            private createEmailFormGroup(): FormGroup {
              return new FormGroup({
                // 'emailAddress': new FormControl('', Validators.email),
                'id': new FormControl(''),
          
                'Label': new FormControl(''),
                'UnitType': new FormControl(''),
                'unit_no': new FormControl('', Validators.required),
                
          
          
          
              })
            }     
  ngOnInit() {
    //this.getAllTask();
    this.emailForm = this.formBuilder.group({
      emails: this.formBuilder.array([])
    });
    this.fetchDataGrid();
  // this.dataSource=this.paginator;
this.getAllStaticMilestone();
 
    $.getScript('assets/plugins/custom/fullcalendar/fullcalendar.bundle.js')
    $.getScript('assets/js/pages/crud/forms/widgets/bootstrap-datepicker.js')
  
    // $.getScript('assets/modaljs/cssParser.js')
    // $.getScript('assets/modaljs/css-filters-polyfill.js')
 

    this.taskForm = new FormGroup({
      taskName: new FormControl('', [Validators.required]),
     


          
   });
   this.form = this.formBuilder.group({
    datepicker: [new Date(), Validators.required],
  });

  this.form.valueChanges.subscribe((value) => {
    
  });
  this.form.get('datepicker').valueChanges.subscribe((value) => {
    
  });

  }
  // ngAfterViewInit() {
   
  //   this.taskService.fetchGridDataByTaskEmpID().subscribe(
  //     (data:any)  => {
  //      
      
  // this.dataSource =  new MatTableDataSource(data);
  // this.dataSource.paginator = this.paginator;
  // this.dataSource.sort = this.sort;})
   
 

    
  //  }

}