import { Component, OnInit, ChangeDetectorRef, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { Select2OptionData, Select2TemplateFunction } from 'ng2-select2';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../../services/task.service';
import moment = require('moment');
import { EmployeeService } from '../../../services/employee.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TeamService } from '../../../services/team.service';
import { DesignationService } from '../../../services/designation.service';
import { DepartmentService } from '../../../services/department.service';
import { ParentComponentApi } from '../dashboard-user-new.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataManager } from '@syncfusion/ej2-data';
import { ProjectService } from '../../../services/project.service';
import { TagInputComponent, TagInputDropdown } from 'ngx-chips';
import { tickStep } from 'd3-array';

declare var $: any;

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  encapsulation: ViewEncapsulation.None,
})



export class AddTaskComponent implements OnInit {
    @Input() parentApi: ParentComponentApi
    @ViewChild('tagInput',{static:false})
    tagInput: TagInputComponent;
    @ViewChild('TagInputDropdown',{static:false})
    tagInputDropdown: TagInputDropdown;
    public taskPriority:string;
    public dateValue;
    public taskStatus:string;
    public taskPriorData: Array<Select2OptionData>;
    public taskStatusData: Array<Select2OptionData>;
    public assigneeData: Array<Select2OptionData>;
    public teamData:Array<Select2OptionData>;
    public approverData:Array<Select2OptionData>;


    public showTaskList=true;
    public showAddForm=false;
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
    public isDisabled=false;
    public checkTeamValue=false;

    empDataSource: any;

    // public date=moment().format('dddd, D MMM YYYY');
    public dueDate;
    public teamMembers=[];
    public teamMemFetchData=[];
    public teams=[];

     public teamsValFetchData=[];
     public isOutsourceDisable=false;
     public isDeptDisable=false;
     public isDesgnDisable=false;
     public isFreeLanDisable=true;

    // dataSource: any;
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
    dataSource: any;
    taskInputValue='';
  isApprove=false;
  taskApprove: any;
  approverTaskValue='';
  addformSubmitted: any;
  editformSubmitted: any;
  emptoolbar: string[];
  @ViewChild('empgrid',{   static: false })
  empgrid;
  selectedCategData: { id: string; text: string; additional: { teamBy: string; }; }[];
  jobOptions: { placeholder: string; width: string; templateResult: Select2TemplateFunction; templateSelection: Select2TemplateFunction; };
  projid: any='';
  projidText: any;
  activtasksList: { id: string; text: string; }[];
  acttaskListValue: any='';
  showprojTask: boolean;
  activityDataText: any;
  recentActSel: boolean;
  linkToProj: boolean=false;
  selecteOptionValue: string='';
  recentTaskSel: boolean;
  public showAssigneeApprove: boolean=false;
  public showAssigneeLead: boolean=false;
  public leadValue: any;
  showSubtaskText: boolean=false;
  projTaskData: { id: string; text: string; }[];
  taskInputText: any;
  projTagTaskData: { value: string; display: string; }[];
  arrayContains: boolean=false;

    constructor(public taskService:TaskService,public projectService:ProjectService, private spinner:NgxSpinnerService, private toastr: ToastrService,private deptService:DepartmentService, private desgnService:DesignationService, private teamService:TeamService,  private formBuilder: FormBuilder,public empService:EmployeeService,
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
    isFieldValid(field: string) {
      if(this.addformSubmitted){
        return (
          this.taskForm.get(field).errors && this.taskForm.get(field).touched ||
          this.taskForm.get(field).untouched &&
          this.addformSubmitted
        );
      }
      else if(this.editformSubmitted){
        return (

          this.taskForm.get(field).errors &&
          this.editformSubmitted
        );
      }
      else{

        return (

          false
        );
      }

    }
    showSubtask(){
      this.showSubtaskText=true;

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
  this.isDesgnDisable=true;
  this.isFreeLanDisable=true;
  this.isOutsourceDisable=true;
        // $('#toggleDesgnCheck').attr("disabled","disabled");
        // $('#toggleFreeLanCheck').attr("disabled","disabled");
        // $('#toggleOutSourceCheck').attr("disabled","disabled");
      }else{
        this.isDesgnDisable=false;
        this.isFreeLanDisable=false;
        this.isOutsourceDisable=false;
        // $('#toggleDesgnCheck').removeAttr('disabled');
        // $('#toggleFreeLanCheck').removeAttr('disabled');
        // $('#toggleOutSourceCheck').removeAttr('disabled');

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
        this.isDeptDisable=true;
        this.isFreeLanDisable=true;
        this.isOutsourceDisable=true;

      }else{
        this.isDeptDisable=false;
        this.isFreeLanDisable=false;
        this.isOutsourceDisable=false;


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
        this.isDesgnDisable=true;
        this.isDeptDisable=true;
        this.isOutsourceDisable=true;

      }else{
        this.isDesgnDisable=false;
        this.isDeptDisable=false;
        this.isOutsourceDisable=false;


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
        this.isDesgnDisable=true;
        this.isFreeLanDisable=true;
        this.isDeptDisable=true;

      }else{
        this.isDesgnDisable=false;
        this.isFreeLanDisable=false;
        this.isDeptDisable=false;


      }
     }
     public changedStatus(e: any): void {
      this.taskStatus= e.value;

    }
    // public changedAssignee(e: any): void {
    //   this.assigneeStatus= e.value;

    // }
    public changedAssignee(e: any): void {
      let user_info:object;
      if(localStorage.getItem('user_info')){
          user_info= JSON.parse(localStorage.getItem('user_info'));

      }
      this.assigneeStatus= e.value;

      if(this.assigneeStatus!=null && this.assigneeStatus.length==1){
        if(this.assigneeStatus[0]==user_info['id']){
          this.showAssigneeApprove=false;
        this.showAssigneeLead=false;

        }else{
          this.showAssigneeApprove=true;
        this.showAssigneeLead=true;


        }

      }else if(this.assigneeStatus!=null && this.assigneeStatus.length>1){

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
       $("#dueDate").html('02/15/2019');
  this.getAllEmployee();
      this.getAllPriority();
      this.getAllStatus();
      this.FindTeamsByOrgID();
      $.getScript('assets/plugins/custom/fullcalendar/fullcalendar.bundle.js')
      $.getScript('assets/js/pages/crud/forms/widgets/bootstrap-datepicker.js')
      let dueDate="02/15/2019";
      this.showTaskList=false;
      this.showAddForm=true;
      this.taskForm.setValue({

        taskName: '',
        desc:'',
        date:''


      })
      this.dueDate='';


      this.taskPriority='',
     this.taskStatus='',
      this.assigneeStatus=[]



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
    // this.fetchDataGrid();
    // this.clearForm();
    // this.linkToProj=false;
    // this.showTaskList=true;
    // this.showAddForm=false;
    this.tagInput.dropdown.hide()
    this.parentApi.callParentMethod()

  }
  callblr(e){
   // console.log('callblr',e);
    //this.tagInput.dropdown.hide()
  }
  taskInputChange(event){

    this.taskInputValue=event.target.value;

   //  if( event.target.value=='' ){

   //  }


   }
   onOpen(args) {
    // args.popup.position = { X: "left", Y: "top" }; // changing popup position
    // args.popup.position = { X: "top", Y: "top" };
    if(this.linkToProj){
 args.popup.offsetX=0;
    args.popup.offsetY=-350;
    }else{
      args.popup.offsetX=0;
    args.popup.offsetY=-100;
    }

  }
  public onAddSubmit(){
    //  let date=document.getElementById('dueDate').innerText
    //  $("#dueDate").html("18:56:00");
    //

    // this.teamCount=this.teamMemFetchData.length;
    this.addformSubmitted=true;
    this.isRecentActFieldValid();
    let teamMembers=this.teamMembers;
    console.log('arrayContains',this.arrayContains)
  // teamMembers.push(user_info['id'])

  //  $('#toggleCheck').prop('checked',true);
  //  $('#isProj').prop('checked',false);
  //  $('#toggleCheck').attr('checked', true);
   $('#toggleCheck').attr('disabled', 'disabled')
  let team_member_empid=[]

   if(this.teamMemFetchData){
    for(var i=0;i<this.teamMemFetchData.length;i++){
      team_member_empid.push(this.teamMemFetchData[i].id)

    }
  }
  let employee={
    "empid": team_member_empid
  }
  let empdata=[];
  for(var i=0;i<this.assigneeStatus.length;i++){
    empdata.push({
      "taskAutoId": null,
      "taskId": null,
      "projectid": null,
      "projectName": null,
      "milestoneId": null,
      "milestoneName": null,
      "employeeId":this.assigneeStatus[i],
      "employeeName": null,
  });
  }
  // if(this.linkToProj){

  //   this.taskForm.get('taskName').valueChanges.subscribe(() => {

  //     const array =  this.projTagTaskData;

  //     if(this.projTagTaskData.length!=0){
  //       if(array.some(code => code.value === (this.taskForm.get('taskName').value!=''&& this.taskForm.get('taskName').value!=null &&this.taskForm.get('taskName').value[0]['value']))){
  //         this.arrayContains=true;
  //         }else{
  //         this.arrayContains=false;

  //         }
  //     }



  //   });

  // }else{
  //   this.arrayContains=false;

  // }
  // console.log('taskNameValue',this.taskForm.get('taskName').value[0]['value'], this.arrayContains);
  // team_member_empid.push(user_info['id'])
    let postData={
      "taskAutoId": null,
      taskId:this.arrayContains?this.taskForm.get('taskName').value[0]['value']:null,
      taskName:(this.taskForm.get('taskName').value!='' && this.taskForm.get('taskName').value!=null)?this.taskForm.get('taskName').value[0]['display']:null,
    //sub_task_name:(this.taskLogForm.get('subtaskName').value!='' && this.taskLogForm.get('subtaskName').value!=null)?this.taskLogForm.get('subtaskName').value[0]['display']:null,
      // id:(this.linkToProj?this.taskInputValue:null),
      projectId: (this.linkToProj && this.projid!='')?this.projid:null,
      "projectName": null,
      milestoneId: (this.linkToProj && this.acttaskListValue!='')?this.acttaskListValue:null,
      "milestoneName": null,
      "subTaskId": null,
     // task_name:(this.linkToProj?this.taskInputText:this.taskForm.get('taskName').value )  ,
     subTaskName:this.taskForm.get('subtaskName').value!=''?this.taskForm.get('subtaskName').value:null,
      description: this.taskForm.get('desc').value,
      priorityId:this.taskPriority,
      "priorityName": null,
      statusId:null,
      "statusName": null,
       leadId:this.leadValue,
       "leadName": null,
      //is_local_activity:(this.linkToProj && this.projid!='')?false:true,
      isLocalActivity:true,
      // dep_id: this.departmentLeadValue
      dueDate: this.ejsDueDate,
        employees:empdata,
        isApproved:this.isApprove,
        "approvedBy": (this.isApprove?this.approverTaskValue:null),
      }


  console.log('postData',postData,this.taskForm.status,this.arrayContains);
  if(this.taskForm.status=='VALID' && ((this.arrayContains || this.showSubtaskText)?(this.taskForm.get('subtaskName').value!='' && this.taskForm.get('subtaskName').value!=null):true)&& (this.isApprove?this.approverTaskValue!=='':true) && this.assigneeStatus.length!=0 ){
             this.spinner.show();
          return this.projectService.AddProjectLocalTask(postData).subscribe(
            (data:any)  => {

            if(data.status==200){
              this.TaskView();
              this.clearForm();

              $("#task_log_modal").modal('hide');

              this.spinner.hide();



              this.showSubtaskText=false;
              //this.showSubtask();



              this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
           });

            }else{
              this.spinner.hide();

              Swal.fire(
                'Error!',
                data['result'].desc,
                'error'
              ).then(
                (result)=> {
                })



            }

            },
            error  => {
              this.spinner.hide();

              Swal.fire(
                'Error!',
                'Error.',
                'error'
              ).then(
                (result)=> {

                })


            }

            )


           }

  }

  /**
   *  clearForm
   */
  public  clearForm() {
    //$("#task_log_modal").modal('hide');

    this.taskForm.reset();
    let user_info= JSON.parse(localStorage.getItem('user_info'));
    this.assigneeStatus[0]=user_info['id'];
this.addformSubmitted=false;
    setTimeout(()=>{
      this.checkTeamValue = false
    });

$("#task_log_modal").modal('hide');
     this.TaskView()


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
    this.taskInputValue='';
    this.teamMemFetchData=[];
    $('#isProj').prop('checked',false);
    this.selecteOptionValue='';
    this.acttaskListValue='';
    this.linkToProj=false;
    this.projid='';
    this.activtasksList=[];
    this.projTagTaskData=[];


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
  public onEditSubmit(){
    // if(document.getElementById('dueDate').innerText!=''){
    //   this.dueDate=document.getElementById('dueDate').innerText
    // }

    let postData={
        id:this.editTaskId,
      task_name: this.taskForm.get('taskName').value  ,
      task_desc: this.taskForm.get('desc').value,
      priority_id:this.taskPriority,
      status_id:this.taskStatus,
      assigned_empid:this.assigneeStatus,
      // dep_id: this.departmentLeadValue
      due_date: this.ejsDueDate

        // due_date: moment(this.dueDate).format('L')


      }



        if (this.taskForm.get('taskName').value !== '') {


            return this.taskService.updateEmpTaskStatus(postData).subscribe(
              (data:any)  => {
                // let dataObj = JSON.parse(data['token']);


              if(data.status==200){
                this.TaskView();
                this.toastr.success(data['desc'], undefined,{
                  positionClass: 'toast-top-center'
             });

             this.AddNewSubmit=true;
             this.editable=false;

              }
              // this.router.navigate(["/organizations"]);

              },
              error  => {
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
    let date=document.getElementById('dueDate').innerText
    //  $("#dueDate").html("18:56:00");
    //
    let postData={

      task_name: this.taskForm.get('taskName').value  ,
      task_desc: this.taskForm.get('desc').value,
      priority_id:this.taskPriority,
      status_id:this.taskStatus,
      assigned_empid:this.assigneeStatus,
      // dep_id: this.departmentLeadValue
        due_date: moment(date).format('L'),
        is_approver: this.approver,


      }


          return this.taskService.AddTask(postData).subscribe(
            (data:any)  => {
              // let dataObj = JSON.parse(data['token']);

            if(data.status==200){
              this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
           });



            }
            // this.router.navigate(["/organizations"]);

            },
            error  => {
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
  GetProjectListByEmpID(){
/*     this.projectService.FetchAllProjectByEmpID().subscribe((projectData:any) => {
      var results=[{ id: '', text: 'Select',additional:{teamBy:''} }]
      if(projectData){
        for (var i = 0; i < projectData.length; i++) {
          results.push({
              id: projectData[i].project_id,
              text: projectData[i].project_name,
              additional:{
                teamBy: projectData[i].project_prefix
              }
          });
        }
      }
    this.selectedCategData=results
  },error  => {
    Swal.fire(
    'Error!',
    error,
    'error'
  ).then((result)=> {})
}) */

  this.projectService.FetchAllEmployeeProjectByEmpID().subscribe((projectData:any) => {
  var results = [{ id: '', text: 'Select',additional:{teamBy:''} }];
    projectData.map((elm) => {
      results.push({
          id: elm.ProjectId,
          text: elm.ProjectName,
          additional:{
            teamBy: elm.ProjectPrefix
          }
      })
    })
    this.selectedCategData = results
  },error => {
    Swal.fire(
      'Error!',
        error,
      'error'
    ).then((result)=> {})
  })
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
      public GetProjTaskonActID(id): void {
        let actID={
          "id": id
        }
        this.projectService.GetTaskByMilestoneID(actID).subscribe(

          (data:any) => {


      var results=[{ id: '', text: 'Select' }]
      var dresults=[]
            // let dataObj = JSON.parse(data['token']);

          if(data){
            for (var i = 0; i < data.length; i++) {
              // logik to create new items

              results.push({

                  "id": data[i].taskId,
                  "text": data[i].taskName

              });


              }
              for (var i = 0; i < data.length; i++) {
                // logik to create new items

                dresults.push({
                    "value": data[i].taskId,
                    "display": data[i].taskName
                });

                }

          }

      this.projTaskData =results;
      this.projTagTaskData =dresults;
      this.taskForm.patchValue({
        taskName:''
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
      public changedProjAct(e: any): void {

        if(e.value){
          this.showprojTask=true;
        this.acttaskListValue=e.value;

          this.activityDataText=e.data[0].text;
      this.recentTaskSel=false;
    this.projTagTaskData=[];
      this.GetProjTaskonActID(e.value);
        }else{
          this.recentTaskSel=true;


        }



      }
      changedTask(e: any): void {
        console.log('e',e);
        let taskControl=this.taskForm.get('taskName');
        let subtaskControl=this.taskForm.get('subtaskName');
        if(e.value){
          this.taskInputValue=e.value;
          this.taskInputText=e.data[0].text;

          taskControl.setValidators(null);
          subtaskControl.setValidators([Validators.required])
          //this.showSubtask();

        }
        taskControl.updateValueAndValidity();
        subtaskControl.updateValueAndValidity();


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

            "id": projectId

        }

        this.projectService.GetMilestoneByProjectID(project_id).subscribe(

          (data:any) => {

      var results=[{ id: '', text: 'Select' }]
            // let dataObj = JSON.parse(data['token']);
          //
          if(data){
            for (var i = 0; i < data.length; i++) {
              // logik to create new items

              results.push({

                  id: data[i].milestoneId,
                  text: data[i].milestoneName




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
  public  getAllPriority(){
    this.taskService.GetPriorityByOrgID().subscribe(

      (data:any) => {

        var results=[{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
      //

  for (var i = 0; i < data.length; i++) {
  // logik to create new items

  results.push({
      "id": data[i].id,
      "text": data[i].priority_name
  });
  if(data[i].priority_name=='Low'){
    this.taskPriority=data[i].id;
  }
  }


  this.taskPriorData =results;
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
      public onChange(e){
        this.ejsDueDate=moment(e.value).format('L');


      }
      public  getAllStatus(){
        this.taskService.GetStatusByOrgID().subscribe(

          (data:any) => {

        var results=[{ id: '', text: 'Select an option' }]
            // let dataObj = JSON.parse(data['token']);
          //

      for (var i = 0; i < data.length; i++) {
      // logik to create new items

      results.push({
          "id": data[i].id,
          "text": data[i].status_name
      });

      }


      this.taskStatusData =results;
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
  this.getAllPriority();
  this.getAllStatus();
  this.getAllEmployee();
            $.getScript('assets/plugins/custom/fullcalendar/fullcalendar.bundle.js')
            $.getScript('assets/js/pages/crud/forms/widgets/bootstrap-datepicker.js')
            this.AddNewSubmit=false;
            this.editable=true;
          this.editTaskId=dept_id;
          this.showTaskList=false;
          this.showAddForm=true;
          this.teamAdd=false;
            let postData={
              id:dept_id
            }
            this.taskService.getByTaskID(postData).subscribe(
              (data:any)  => {


                this.taskForm.setValue({

                  taskName: data.task_name,
                  desc:data.task_desc,
                  date:moment(data.due_date).format('L')

                })
                this.dueDate=data.due_date;


                this.taskPriority=data.priority_id,
               this.taskStatus=data.status_id,
                this.assigneeStatus=data.assigned_empid,
                this.dateValue=moment(data.due_date).format('L')

              //   this.empProfileForm.valueChanges.subscribe(
              //     value=> {
              //
              //     }
              //  );

              //  this.empProfileForm.get('firstName').valueChanges.subscribe(val=>{
              //    if(data.first_name!=val){
              //

              //    }
              // })
              // this.empProfileForm.get('firstName')
              // .valueChanges
              // .pipe(pairwise())
              // .subscribe(([prev, next]: [any, any]) => {
              //
              //
              // });
                //this.EmpList();
               // this.departmentLeadValue=data.depart_lead_empid;
                //  let dataObj = JSON.parse(data['token']);



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
          public onCheckChange(e){
            this.approver=!this.approver;

            this.taskApprove=e.value;
            if(e.srcElement.checked==true){
              this.isApprove=true
            }else{
              this.isApprove=false

            }
          }
          public fetchDataGrid(){

              this.taskService.fetchGridDataByTaskEmpID().subscribe(
                (data:any)  => {


          this.dataSource =  new MatTableDataSource(data);
          // this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // setTimeout(() => {
          //   this.dataSource.paginator = this.paginator;
          //   this.dataSource.sort = this.sort;
          // })

                }
                )
          }
          public checkIsTeam(e:any){

            if(e.srcElement.checked) {
              this.teamAdd=true;
              this.EmpList();
              this.checkTeamValue=true;

            }else{
              this.teamAdd=false;

            }

          }
          public checkIsProject(e:any){

            if(e.srcElement.checked) {
              this.linkToProj=true;
              this.taskForm.get('taskName').valueChanges.subscribe(() => {

                const array =  this.projTagTaskData;

                if(this.projTagTaskData.length!=0){
                  if(array.some(code => code.value === (this.taskForm.get('taskName').value!=''&& this.taskForm.get('taskName').value!=null &&this.taskForm.get('taskName').value[0]['value']))){
                    this.arrayContains=true;
                    console.log('arrayContains',true)
                    }else{
                    this.arrayContains=false;
                    console.log('arrayContains',false)

                    }
                }



              });

            }else{
              this.linkToProj=false;
              this.arrayContains=false;
              this.projTagTaskData=[];
              this.taskForm.reset();
              this.projid='';
              this.acttaskListValue='';
              this.showSubtaskText=false;

            }

          }
          hideSubtask(){
            this.showSubtaskText=false;
            this.taskForm.patchValue({
              subtaskName:''
            })
          }
          applyFilter(filterValue: string) {
            this.dataSource.filter = filterValue.trim().toLowerCase();
          }

          public taskDelete(deptId){
            let postData={
              ID:deptId
            }
            this.taskService.delTask(postData).subscribe(
              (data:any)  => {

                if(data.status==200){
                  this.fetchDataGrid();

                            this.toastr.error(data['desc'], undefined,{
                              positionClass: 'toast-top-center'
                         });

                          }


              },
              error  => {
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
                //

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
              changedTaskApprover(e){
                this.approverTaskValue=e.value;
                }
    ngOnInit() {
      //this.getAllTask();
      //this.checkTeamValue=false;

      // $('#isTeam').prop('checked',true);
      //  $('#isTeam').attr('checked', true);


      this.getAllEmployee();
      this.getAllPriority();
      this.getAllStatus();
      this.FindTeamsByOrgID();
      this.fetchDataGrid();
      this.getEmployeeByOrgId();
      let user_info= JSON.parse(localStorage.getItem('user_info'));

      if(user_info['is_superadmin']==true){
        this.FetchAllProjectByOrgID();


       }
       if(user_info['is_admin']==true && user_info['is_superadmin']==false){

        this.FetchAllProjectByOrgID();


       }
       if(user_info['is_admin']==false && user_info['is_superadmin']==false){
        this.GetProjectListByEmpID();


       }
    // this.dataSource=this.paginator;
    this.showAssigneeLead=false;



      $.getScript('assets/plugins/custom/fullcalendar/fullcalendar.bundle.js')
      $.getScript('assets/js/pages/crud/forms/widgets/bootstrap-datepicker.js')

      // $.getScript('assets/modaljs/cssParser.js')
      // $.getScript('assets/modaljs/css-filters-polyfill.js')


      this.taskForm = new FormGroup({
        taskName: new FormControl('', [Validators.required]),
        desc: new FormControl(''),
        date:new FormControl('', [Validators.required]),
        subtaskName:new FormControl('')


     });
     if(this.linkToProj){



    }else{
     // this.arrayContains=false;

    }
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
