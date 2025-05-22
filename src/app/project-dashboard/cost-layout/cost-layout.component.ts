import { Component, OnInit, ViewEncapsulation, NgZone, ViewChild, ElementRef, AfterViewInit, AfterContentInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../services/employee.service';
import { Select2OptionData, Select2TemplateFunction } from 'ng2-select2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment = require('moment');
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import { MatTableDataSource } from '@angular/material';
import { DesignationService } from '../../services/designation.service';
import { DepartmentService } from '../../services/department.service';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { NgxSpinnerService } from 'ngx-spinner';
import { TeamService } from '../../services/team.service';
import { DataManager } from '@syncfusion/ej2-data';
import { TemplateService } from '../../services/template.service';
import { Browser } from '@syncfusion/ej2-base';
import { EditService, ToolbarService, PageService, DialogEditEventArgs, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { DataUtil,Predicate  } from '@syncfusion/ej2-data';
import {  AbstractControl } from '@angular/forms';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
import {FormBuilder, FormArray} from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
am4core.useTheme(am4themes_animated);
let chart;
let taskchart;
@Component({
  selector: 'app-cost-layout',
  templateUrl: './cost-layout.component.html',
  styleUrls: ['./cost-layout.component.scss'],
  providers: [ToolbarService, EditService, PageService],
  encapsulation: ViewEncapsulation.None,
})

export class CostLayoutComponent implements OnInit   {
  public paramId=this.route.snapshot.params.id;
  public options: Select2Options;
  public teamoptions: Select2Options;
  public assigneeOptions: Select2Options;
  public approverData: Array<Select2OptionData>;
  public activList: Array<Select2OptionData>;
  private chart: am4charts.XYChart;
  public full_name:any;
  public emailForm: FormGroup;
  public emailLabels = ['Home', 'Work', 'Other'];
  public validationMsgs = {
    'emailAddress': [{ type: 'email', message: 'Enter a valid email' }]
  }


  public isApprove=false;
  @ViewChild('listviewInstance',{static:false})
  public listviewInstance: any;
  @ViewChild('chartElement',{static:false}) chartElement: ElementRef<HTMLElement>;
  @ViewChild('assignee',{static:false})
     countryObj: MultiSelectComponent;
  projectName: any;
  approverValue: any;
  showApprover=false;
  activityLogForm: FormGroup;
  taskLogForm: FormGroup;
  startdateValue;
  enddateValue: any;
  projActivityCount: any;
  addApprover: any;
  activListValue: any;
  disableAddAct:boolean;
  public taskPriority:string;
  public dateValue;
  public taskStatus:string;
  public taskPriorData: Array<Select2OptionData>;
  public taskStatusData: Array<Select2OptionData>;
  public assigneeData: Array<Select2OptionData>;
  public customerData: Array<Select2OptionData>;
  public projStatusData: Array<Select2OptionData>;
// public People;


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

   displayedEmpColumns= ['index','Job', 'CheckIn', 'CheckOut','Action'];
   public desgnData: Array<Select2OptionData>;
   public deptData: Array<Select2OptionData>;
   public milestoneTempData: Array<Select2OptionData>;
   public taskTempData: Array<Select2OptionData>;

   searchField: string;
   teamAdd: boolean;
   teamValue: any;
   teamMembersData: { id: string; text: string; }[];
   desgnEmpValue: any;
   deptEmpValue: any;
   teamEmpName: string;
   teamMemberValue: any;
   approver: boolean
  assigneeStatus: any;
  teamData: any[];
  ejsDueDate: string;

  nearbyAddress="";
  nearbyPlaces: google.maps.places.PlaceResult[];
  changed_address: string;

  public formatted_address;
   public lat;
   public lang;
   public street_number;
  //  public route;
   public locality;
   public administrative_area_level_2;
   public administrative_area_level_1;
   public postal_code;
   public country;

   public changed_formatted_address;
   public changed_lat;
   public changed_lang;
   public changed_street_number;
   public changed_route;
   public changed_locality;
   public changed_administrative_area_level_2;
   public changed_administrative_area_level_1;
   public changed_postal_code;
   public changed_country;
   public changedLocationData;
   public showNearbyPlaces=false;
   public editableLoc;
   public piedata: Object[];
   public tooltip: Object;
   geoCodeData: any;
   public showAssigneeLead=false;
   public headerTitle: string = 'Milestones';
    public cssClass: string = 'e-list-template';
   disableLocationAdd=true;
  newAttribute: any = {};

  firstField = true;
  firstFieldName = 'First Item name';
  isEditItems: boolean;

   title: string = 'AGM project';
   latitude: number;
   longitude: number;
   zoom: number;
   address: string;
   private geoCoder;
   @ViewChild('search',{ read: ElementRef , static: false })
    searchElementRef: ElementRef;
  project_start_date: any;
  project_end_date: any;
  project_desc: any;
  customerForm: FormGroup;
  customerVal='';
  editCustomer: boolean;
  customerId: any;
  projTaskCount=0;
  planType: string;
  dataSource: any;

  taskDataSource: any;
  editActivityId: any;
  editTaskId: any;
  project_activity_id: any;
  editable=false;
  activityEditable=false;
  activityChartData: any;
  projStatusValue: any;
  projectProgress: any;
  approveChecked: any;
  taskApprove: any;
  disableEndDate=true;
  minEndDate: any;
  startValChange: boolean;
  disableAddTask:boolean;
  approverTaskValue='';
  user_info: any;
  addformSubmitted: any;
  editformSubmitted: any;
  @ViewChild('empgrid',{   static: false })
  empgrid;
  activityCompletedList=[];
  activityOpenList=[];
  taskCompletedList=[];
  taskOpenList=[];
  public templateAdd=false;
  disableTaskStatus: boolean=false;
  milestoneTempValue: any;
  taskTemplateAdd: boolean=false;
  taskTempValue: any;
  leadValue: any;
  showAssigneeApprove: boolean=false;
  allActCount: any;
  completedActCount: number;
  public headerText: Object = [{ text: "Single Task", 'iconCss': 'e-twitter' },
  { text: "Multiple Task", 'iconCss': 'e-facebook' }];

public taskData: Object[] = [
  ]
  public data: Object[];
    public editSettings: Object;
    public toolbar: string[];
    public orderForm: FormGroup;
    public pageSettings: Object;
    public shipCityDistinctData: Object[];
    public shipCountryDistinctData: Object[];
    public submitClicked: boolean = false;
  ejsTaskData: { id: string; text: string; }[];
  ejsactivList: { id: string; text: string; }[];
  ejstaskPriorData: { id: string; text: string; }[];
  ejsassigneeData: { id: any; text: string; }[];
  currentUser: any;
  choseTaskTemplate: boolean=false;
  choseMilestTemplate: boolean=false;
  singleTask: boolean=true;
  multiTask: boolean=false;
  projectData: Object[];
  xpandStatus: boolean=false;
  selectedProjectId: any;
  selectedValue: any;
  projectId: string;
  constructor(public route:ActivatedRoute,public router:Router, private zone: NgZone,private projectService:ProjectService,private toastr: ToastrService,
    private empService:EmployeeService,private taskService:TaskService,private desgnService:DesignationService,
    private deptService:DepartmentService,private mapsAPILoader: MapsAPILoader,private spinner:NgxSpinnerService,private teamService:TeamService,
    private ngZone: NgZone,private templateService:TemplateService,private formBuilder: FormBuilder) {
    this.options={
    placeholder: { id: '', text: 'Select' },
    width:'100%'
  }
  this.assigneeOptions={
    multiple: true,

    placeholder: { id: '', text: 'Select' },
    width:'100%'
  }
  this.teamoptions = {
    multiple: true,
    placeholder: "Select",
    // allowClear: true,
    width: "100%",
    templateResult: this.templateResult,
    templateSelection: this.templateSelection


  }
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

public addActivity(){
  this.getAllEmployee();
  this.FindMilestoneTemplatesByOrgID();
  this.activityEditable=false;
  this.disableAddAct=true;
  this.editable=false;
  this.approveChecked=false;
  this.approverValue=false;
this.showApprover=false;
  $("#activity_log_modal").modal('show');

}
public addTask(){
  this.GetProjectActivityByProjectID();
  this.getAllPriority();
  this.getAllStatus();
  this.getEmployeeByOrgId();
  this.getAllEmployee();
  this.FindTeamsByOrgID();
  this.FindTaskTemplatesByOrgID();
  this.editable=false;
  $("#task_log_modal").modal('show');

}
public addCustomer(){
  this.GetAllCustomer();
  this.FindByProjectID();
  $("#customer_modal").modal('show');

}
public OnCustomerClose(){

  $("#customer_modal").modal('hide');

}
public addLocation(){
  this.locationSetUp();

  $("#location_setup_modal").modal('show');

}
public OnLocationClose(){
  this.resetLocationAdded();
}
isFieldValid(field: string) {
  if(this.addformSubmitted){
    return (
      this.activityLogForm.get(field).errors && this.activityLogForm.get(field).touched ||
      this.activityLogForm.get(field).untouched &&
      this.addformSubmitted
    );
  }
  else if(this.editformSubmitted){
    return (

      this.activityLogForm.get(field).errors &&
      this.editformSubmitted
    );
  }
  else{

    return (
   // this.showerrorMsg=false,

      false
    );
  }

}
public activityEdit(id){

  this.editActivityId=id;
  this.activityEditable=true;
  this.editable=true;
  this.getAllEmployee();
//this.getAllStatus();
   this.GetAllProjectStatus();
  this.FindByProjectActivityID();
$('#activity_log_modal').modal('show');
}
public taskEdit(id,projectId){

  this.editable=true;
   this.editTaskId=id;
   this.project_activity_id=projectId;
  this.getEmployeeByOrgId();
this.getAllEmployee();
   this.GetProjectActivityByProjectID();
  this.getAllPriority();
  this.getAllStatus();
  this.FindTaskTemplatesByOrgID();
  this.FindByProjectTaskID();

$('#task_log_modal').modal('show');
}
public taskDelete(id){

  // this.editActivityId=id;
  // this.RemoveProjectTaskID(id);
}
public activityDelete(){

}
public FindMilestoneTemplatesByOrgID(){


      return this.templateService.FindMilestoneTemplatesByOrgID().subscribe(
        (data:any)  => {
          if(data){

  var results=[{'id':'',text:'Select'}]
  // let dataObj = JSON.parse(data['token']);
//

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
"id": data[i].id,
"text": data[i].template_name
});

}


this.milestoneTempData =results

          }


        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            (result)=> {

            })


        }

        )


}
public FindTaskTemplatesByOrgID(){


  return this.templateService.FindTaskTemplatesByOrgID().subscribe(
    (data:any)  => {
      if(data){

var results=[{'id':'',text:'Select'}]
// let dataObj = JSON.parse(data['token']);
//

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
"id": data[i].id,
"text": data[i].template_name
});

}


this.taskTempData =results
this.ejsTaskData=results

      }


    },
    error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      ).then(
        (result)=> {

        })


    }

    )


}
public FindTaskTemplatesByTemplateID(id){

 let postData= {
    "ID": id
  }


      return this.templateService.FindTaskTemplatesByTemplateID(postData).subscribe(
        (data:any)  => {
          if(data){

           this.taskLogForm.patchValue({
            taskName: data.task_name,
             desc: data.task_desc,
             date: moment(data.due_date).format('L'),

          //   remarks: new FormControl(''),
          //  // startDate: new FormControl(''),
           // endDate: new FormControl(''),
            // email: new FormControl('', [Validators.required]),



         });
        this.activListValue=data.milestone_id,
       this.taskPriority=data.priority_id,
       this.assigneeStatus=data.assignee_emp_id;

       let user_info= JSON.parse(localStorage.getItem('user_info'));

       if(data.assignee_emp_id=='Anyone' || data.assignee_emp_id==user_info['id']){
        this.disableTaskStatus=false;
       }else{
        this.disableTaskStatus=true;

       }
   setTimeout(() => this.assigneeStatus=data.assignee_emp_id, 2000);

       this.isApprove=data.is_approve_req;
       if(this.isApprove==true){
        this.isApprove=true;

       }else{
        this.isApprove=false;
       }
          }


        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            (result)=> {

            })


        }

        )







}
public FindByProjectTaskID(){

 let postData= {
    "ID": this.editTaskId
  }


      return this.projectService.FindByProjectTasksId(postData).subscribe(
        (data:any)  => {
          if(data){

           this.taskLogForm.patchValue({
            taskName: data.task_name,
             desc: data.task_desc,
             date: moment(data.due_date).format('L'),

          //   remarks: new FormControl(''),
          //  // startDate: new FormControl(''),
           // endDate: new FormControl(''),
            // email: new FormControl('', [Validators.required]),



         });
        this.activListValue=this.project_activity_id,
       this.taskPriority=data.priority_id,

       this.leadValue=data.assigned_empid,
       this.taskStatus=data.status_id;

       let user_info= JSON.parse(localStorage.getItem('user_info'));

       if(data.assigned_empid=='Anyone' || data.assigned_empid==user_info['id']){
        this.disableTaskStatus=false;
       }else{
        this.disableTaskStatus=true;

       }
       let teamMembers=[]
       for(var i=0;i<data.employees.length;i++){
         teamMembers.push(data.employees[i].empid)
       }


    setTimeout(() => this.assigneeStatus=teamMembers, 1500);
       this.isApprove=data.is_approver;
       if(this.isApprove==true){
        this.isApprove=true;
        this.approverTaskValue=data.is_approver_id

       }else{
        this.isApprove=false;
       }
          }


        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            (result)=> {

            })


        }

        )







}
public resetLocationAdded(){
   this.searchElementRef.nativeElement.value='';
  this.nearbyAddress='';
this.disableLocationAdd=true;
this.FindByProjectID();
  $("#location_setup_modal").modal('hide');

}
public resetCustomerAdded(){
  this.customerVal='';

 $("#customer_modal").modal('hide');

}
public selectedOption(e): void {


this.xpandStatus=false;
this.selectedValue=e.project_name;
this.selectedProjectId=e.project_id;
localStorage.setItem('project_id',e.project_id);
this.FindByProjectID();
this.ProjectTaskCountByProjectID();
    this.GetProjectActivityByProjectID();
    this.GetAllTaskByProjectID();
    this.FindAllProjectActivityByProjectID();

}
public  GetPriorityByOrgID(){
  this.projectService.FetchAllProjectByOrgID().subscribe(

    (data:any) => {


this.projectData=data;



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
public onAddProjLocation(){
  this.spinner.show();

let postData={
     "entity_id": localStorage.getItem('project_id'),
     "geo_address":this.searchElementRef.nativeElement.value,

    "formatted_address": this.changed_address?this.changed_address:this.formatted_address,
        "lat": this.latitude?JSON.stringify(this.latitude):"",
        "lang": this.longitude?JSON.stringify(this.longitude):"",
        "street_number": this.changed_street_number,
        "route": this.changed_route,
        "locality": this.changed_locality,
        "administrative_area_level_2": this.changed_administrative_area_level_2,
        "administrative_area_level_1": this.changed_administrative_area_level_1,
        "postal_code": "",
        "country":  this.changed_country,
      "city": this.changed_administrative_area_level_1


}


      return this.projectService.AddEntityLocation(postData).subscribe(
        (data:any)  => {
          if(data.status==200){
           this.resetLocationAdded();

           this.spinner.hide();

          //  this.editableLoc=true;

            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });
          }
          else{

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
            error,
            'error'
          ).then(
            (result)=> {

            })


        }

        )







}
public onAddCustomer(){

  this.spinner.show();

let postData={


  "project_id": localStorage.getItem('project_id'),
  "cst_id": this.customerVal
  // "createdby": "string"
}


      return this.projectService.AddProjectCustomer(postData).subscribe(
        (data:any)  => {
          if(data.status==200){
           this.resetCustomerAdded();

this.spinner.hide();
this.FindByProjectID();
          //  this.editableLoc=true;

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
            error,
            'error'
          ).then(
            (result)=> {

            })


        }

        )







}
public GetProjectActivityTaskRatioByProjectID(){
  let postData={
    id:localStorage.getItem('project_id')
  }
  this.projectService.GetProjectActivityTaskRatioByProjectID(postData).subscribe(

    (data:any) => {
      taskchart.data=data;
      // let dataObj = JSON.parse(data['token']);
    //






    }
  )}
public GetProjectActivityRatioByProjectID(){
  let postData={
    id:localStorage.getItem('project_id')
  }
  this.projectService.GetProjectActivityRatioByProjectID(postData).subscribe(

    (data:any) => {
      chart.data=data;
        for(var i=0;i<data.length;i++){
      if(data[i].project_status_name=="Completed"){
      this.projectProgress=data[i].ratio;

        }
      }


      // let dataObj = JSON.parse(data['token']);
    //





    }
  )}

  public FindMilestoneTemplatesByTemplateID(id){

   let postData= {
      "ID": id
    }


        return this.templateService.FindMilestoneTemplatesByTemplateID(postData).subscribe(
          (data:any)  => {
            if(data){


             this.activityLogForm.patchValue({
              activName:data.milestone_name,
              remarks:data.milestone_desc,
              startDate: moment(data.start_date).format('L'),
              endDate: moment(data.end_date).format('L'),
              // email: new FormControl('', [Validators.required]),



           });
      this.disableAddAct=false;

        //  this.projStatusValue=data.status_id

         this.approveChecked=data.is_approve_req;
         if(this.approveChecked==true){
          this.showApprover=true;
         this.approverValue=data.approve_emp_id;

          // this.isApprove=true;

         }else{
          this.showApprover=false;
          // this.isApprove=false;
          this.approveChecked=false;
         }

            }


          },
          error  => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(
              (result)=> {

              })


          }

          )







  }
public FindByProjectActivityID(){

 let postData= {
    "ID": this.editActivityId
  }


      return this.projectService.FindByProjectActivityID(postData).subscribe(
        (data:any)  => {
          if(data){


           this.activityLogForm.patchValue({
            activName:data[0].activity_name,
            remarks:data[0].activity_desc,
            startDate: moment(data[0].start_date).format('L'),
            endDate: moment(data[0].end_date).format('L'),
            // email: new FormControl('', [Validators.required]),



         });
    this.disableAddAct=false;

       this.projStatusValue=data[0].status_id

       this.approveChecked=data[0].is_approve_req;
       if(this.approveChecked==true){
        this.showApprover=true;
        // this.isApprove=true;

       }else{
        this.showApprover=false;
        // this.isApprove=false;
        this.approveChecked=false;
       }
       this.approverValue=data[0].approved_id;

          }


        },
        error  => {
          Swal.fire(
            'Error!',
            error,
            'error'
          ).then(
            (result)=> {

            })


        }

        )







}
public onEditCustomer(){

  this.spinner.show();
let postData={


  "project_id": localStorage.getItem('project_id'),
  "cst_id": this.customerId
  // "createdby": "string"
}


      return this.projectService.AddProjectCustomer(postData).subscribe(
        (data:any)  => {
          if(data.status==200){
           this.resetLocationAdded();

           this.spinner.hide();

          //  this.editableLoc=true;

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
            error,
            'error'
          ).then(
            (result)=> {

            })


        }

        )







}
public changedCustomer(e){

  this.customerVal=e.value;
  //  this.FindCustomProjectPrefixByOrgIDAndPrefix(this.customPrefix)
      }
 public changedMilestoneTemp(e){
        this.milestoneTempValue=e.value;
          this.FindMilestoneTemplatesByTemplateID(e.value)
            }

            public changedTaskTemp(e){
              this.taskTempValue=e.value;
                this.FindTaskTemplatesByTemplateID(e.value)
                  }

public  GetAllCustomer() {
  this.projectService.GetAllCustomerByOrgID().subscribe(
    (data:any) => {
      var results=[{'id':'',text:'Select'}]
      // let dataObj = JSON.parse(data['token']);
    //

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
    "id": data[i].id,
    "text": data[i].cst_name
});

}


this.customerData =results
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

public onEditProjLocation(){

  this.spinner.show();

  let postData={
       "entity_id": localStorage.getItem('project_id'),
       "geo_address":this.searchElementRef.nativeElement.value,
      "formatted_address": this.changed_address?this.changed_address:this.formatted_address,
          "lat": this.latitude?JSON.stringify(this.latitude):"",
          "lang": this.longitude?JSON.stringify(this.longitude):"",
          "street_number": this.changed_street_number,
          "route": this.changed_route,
          "locality": this.changed_locality,
          "administrative_area_level_2": this.changed_administrative_area_level_2,
          "administrative_area_level_1": this.changed_administrative_area_level_1,
          "postal_code": "",
          "country":  this.changed_country,

  }


        return this.projectService.UpdateEntityLocation(postData).subscribe(
          (data:any)  => {
            if(data.status==200){
              this.resetLocationAdded();
           //this.FindByProjectID();
           this.spinner.hide();

             this.editableLoc=true;

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
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(
              (result)=> {

              })


          }

          )







  }
public nearByPlaces(){
if(this.editableLoc==false){
  this.setCurrentLocation();

}
// let nearbyplaces= new google.maps.places.PlacesService(map);
this.geoCoder = new google.maps.Geocoder;
let nearby=new google.maps.places.PlacesService(document.createElement('div'));
nearby.nearbySearch({
location: {lat: this.latitude, lng: this.longitude},
radius: 100,

}, (results,status) => {
if (status === google.maps.places.PlacesServiceStatus.OK) {
  for (var i = 0; i < results.length; i++) {
    // this.createMarker(results[i]);
  }
}
this.nearbyPlaces=results;

});



}
focusFunction (){
  if(this.searchElementRef.nativeElement.value==''){
    this.showNearbyPlaces=true;

  }else{
    this.showNearbyPlaces=false;

  }
 this.mapsAPILoader.load().then(() => {
  this.nearByPlaces();
 });
}
keyup(event){
   this.showNearbyPlaces=false;

  if(event.keyCode == 8 && this.searchElementRef.nativeElement.value=='' ){
    this.showNearbyPlaces=true;
    // this.searchLocVal='';
    this.disableLocationAdd=true;

    this.mapsAPILoader.load().then(() => {
      this.nearByPlaces();
     });
  }else{
    this.disableLocationAdd=false;

  }


}

clickFunction (){
   if(this.searchElementRef.nativeElement.value==''){
    this.showNearbyPlaces=true;
    this.disableLocationAdd=true;


  }else{
    this.showNearbyPlaces=false;

  }
 this.mapsAPILoader.load().then(() => {
  this.nearByPlaces();
 });
}


selectNearBy(nearbyPlace){
  this.nearbyAddress=nearbyPlace.name;
  // this.searchLocVal=nearbyPlace.name;
  this.address=nearbyPlace.name;
  this.disableLocationAdd=false;
  // this.changed_address=nearbyPlace.name;
  // this.web_site = place.website;
  // this.name = place.name;

  // this.getChangedMatchedTypes()
  this.ngZone.run(() => {
    this.latitude = nearbyPlace.geometry.location.lat();
    this.longitude = nearbyPlace.geometry.location.lng();
    this.showNearbyPlaces=false;
    this.zoom=12;
  })


  //set latitude, longitude and zoom


}

public locationSetUp(){

  $('#kt_user_edit_tab_3').trigger('click')
  this.mapsAPILoader.load().then(() => {
    //this.nearByPlaces();
   this.geoCoder = new google.maps.Geocoder;
 if(this.editableLoc==false){
  this.setCurrentLocation();

 }
// let nearby=new google.maps.places.PlacesService(document.createElement('div'));
// nearby.nearbySearch({
//   location: {lat: this.latitude, lng: this.longitude},
//   radius: 100,

// }, (results,status) => {
//   if (status === google.maps.places.PlacesServiceStatus.OK) {
//     for (var i = 0; i < results.length; i++) {
//       // this.createMarker(results[i]);
//
//     }
//   }
//   this.nearbyPlaces=results;

// });
let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);






      autocomplete.addListener("place_changed", () => {
    this.ngZone.run(() => {
      //get the place result

       let place: google.maps.places.PlaceResult = autocomplete.getPlace();

      if (place.geometry === undefined || place.geometry === null) {
        return;
      }
      this.address = place.formatted_address;

       this.changedLocationData=place;
       this.getChangedMatchedTypes();

       this.changed_address=place.formatted_address;
      // this.web_site = place.website;
      // this.name = place.name;


      //set latitude, longitude and zoom
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      this.zoom = 12;
      // this.showNearbyPlaces=false;
      if(this.searchElementRef.nativeElement==''){
        // this.showNearbyPlaces=true;

      }
    });
  });



});
}
public getChangedMatchedTypes() {
  let address_components
  if(this.changedLocationData.length!=0){
     address_components=this.changedLocationData['address_components']

  }


  let i,
      j,
      types;
  let address_component;
  // Loop through the Geocoder result set. Note that the results
// array will change as this loop can self iterate.
for( i=0;i<address_components.length;i++){
  types = address_components[i]['types'];



  for (j = 0; j < types.length; j++) {
    if (types[j] == 'street_number') {




   this.changed_street_number = address_components[i]['short_name'];


    }
    if (types[j] === 'route') {
      this.changed_route =  address_components[i]['long_name'];
    }
    // if (types[j] === 'formatted_address') {
    //   this.formatted_address =  address_components[i]['long_name'];
    // }
    // if (types[j] === 'neighborhood') {
    //   this.changed_street_number =  address_components[i]['long_name'];
    // }
    if (types[j] === 'locality') {
      this.changed_locality =  address_components[i]['long_name'];
    }
    if (types[j] === 'administrative_area_level_1') {
      this.changed_administrative_area_level_1 =  address_components[i]['long_name'];
    }
    if (types[j] === 'administrative_area_level_2') {
      this.changed_administrative_area_level_2 =  address_components[i]['long_name'];
    }
    if (types[j] === 'postal_code') {
      this.changed_postal_code =  address_components[i]['long_name'];
    }
    if (types[j] === 'country') {
      this.changed_country =  address_components[i]['long_name'];
    }

  }
}


    // address_component = address_components[element];




}
private setCurrentLocation() {
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.zoom = 8;

    this.getAddress(this.latitude, this.longitude);


  });
}
}
public onSearchChange(){

}

markerDragEnd($event: MouseEvent) {

  this.latitude = $event.coords.lat;
  this.longitude = $event.coords.lng;
  this.getAddress(this.latitude, this.longitude);
}
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {

        this.geoCodeData=results[2];



      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          // this.getMatchedTypes();

          this.address = results[0].formatted_address;
          this.formatted_address = results[2].formatted_address;

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
    public getMatchedTypes() {
      let address_components
      if(this.geoCodeData.length!=0){
         address_components=this.geoCodeData['address_components']

      }


      let i,
          j,
          types;
      let address_component;
      // Loop through the Geocoder result set. Note that the results
    // array will change as this loop can self iterate.
    for( i=0;i<address_components.length;i++){
      types = address_components[i]['types'];



      for (j = 0; j < types.length; j++) {
        if (types[j] == 'street_number') {




       this.street_number = address_components[i]['short_name'];


        }
        if (types[j] === 'route') {
          this.route =  address_components[i]['long_name'];
        }
        // if (types[j] === 'formatted_address') {
        //   this.formatted_address =  address_components[i]['long_name'];
        // }
        if (types[j] === 'neighborhood') {
          this.street_number =  address_components[i]['long_name'];
        }
        if (types[j] === 'locality') {
          this.locality =  address_components[i]['long_name'];
        }
        if (types[j] === 'administrative_area_level_1') {
          this.administrative_area_level_1 =  address_components[i]['long_name'];
        }
        if (types[j] === 'administrative_area_level_2') {
          this.administrative_area_level_2 =  address_components[i]['long_name'];
        }
        if (types[j] === 'postal_code') {
          this.postal_code =  address_components[i]['long_name'];
        }
        if (types[j] === 'country') {
          this.country =  address_components[i]['long_name'];
        }

      }
    }


        // address_component = address_components[element];




  }


public onChange(e){
  this.ejsDueDate=moment(e.value).format('L');


}
public addMultiTask(){
  const emails = this.emailForm.get('emails') as FormArray
  let postData=[];
  let user:object;
  if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));

  }
  for(var i=0;i<emails.value.length;i++){
    if(emails.value[i].OrderID!=''){
      let empdata=[];

if(emails.value[i].Assignee && emails.value[i].Assignee.length!=0){
for(var j=0;j<emails.value[i].Assignee.length;j++){
        empdata.push({

          "id": null,
          "task_id": null,
          "empid": emails.value[i].Assignee[j],


      });
      }
}

      let object={
        "id": null,
        "project_id": localStorage.getItem('project_id'),
        "activtity_id": emails.value[i].MilestoneName,
        "empid": user['id'],
        "task_name": emails.value[i].OrderID,
        "task_desc": emails.value[i].taskDesc,
        "priority_id": emails.value[i].Priority,
        "status_id":null,
        "assigned_empid": emails.value[i].Lead!=''?emails.value[i].Lead:user['id'],
        "due_date": moment(emails.value[i].DueDate).format('L'),
        "createdby": user['full_name'],
        "is_approver": emails.value[i].ApproverCheck!=''?emails.value[i].ApproverCheck:false,
        "is_approver_id": emails.value[i].ApproverCheck!=''?emails.value[i].Approver:null,
        "employees":empdata

        }
    postData.push(object)

    }

  }
  if(this.emailForm.get('emails').status=='VALID'){
    return this.projectService.AddMultipleTask(postData).subscribe(
      (data:any)  => {
      if(data.status==200){

      this.GetAllTaskByProjectID();
      this.ProjectTaskCountByProjectID();

        this.resetMultiTaskForm()
        this.spinner.hide();

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
public onAddProjTask(){
  this.spinner.show();

  let team_member_empid=[]

 if(this.teamMemFetchData){
  for(var i=0;i<this.teamMemFetchData.length;i++){
    team_member_empid.push(this.teamMemFetchData[i].id)

  }
}
let employee={
  "empid": team_member_empid
}
let user:object;
  if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));

  }
  let empdata=[];
  for(var i=0;i<this.assigneeStatus.length;i++){
    empdata.push({

      "id": null,
      "task_id": null,
      "empid": this.assigneeStatus[i],


  });
  }

  let postData={
    id:null,
    project_id: localStorage.getItem('project_id'),
    activtity_id: this.activListValue,

    task_name: this.taskLogForm.get('taskName').value  ,
    task_desc: this.taskLogForm.get('desc').value,
    priority_id:this.taskPriority,
    status_id:null,
    assigned_empid:this.leadValue,
    // dep_id: this.departmentLeadValue
      due_date: this.ejsDueDate,
      "employees": empdata,
      is_approver:this.isApprove,
      is_approver_id:(this.isApprove?this.approverTaskValue:null),


  }


 $('#toggleCheck').prop('checked',true);

//  $('#toggleCheck').attr('checked', true);
 $('#toggleCheck').attr('disabled', 'disabled')


// team_member_empid.push(user_info['id'])




if(this.taskTemplateAdd){
  let data={
    "id": null,
    "template_name": this.taskLogForm.get('taskTemplateName').value,
    "milestone_id": this.activListValue,
    task_name: this.taskLogForm.get('taskName').value  ,
    task_desc: this.taskLogForm.get('desc').value,
    priority_id:this.taskPriority,
    assigned_empid:this.leadValue,
    // dep_id: this.departmentLeadValue
      due_date: this.ejsDueDate,
     // employees:team_member_empid.length==0?null:employee,
      is_approve_req:this.isApprove,
      approve_emp_id:(this.isApprove?this.approverTaskValue:null),

  }
   this.templateService.AddTaskTemplate(data).subscribe(
    (data:any)  => {
      // let dataObj = JSON.parse(data['token']);
    if(data.status==200){
      //this.TaskView();
   $('#taskTemp').prop('checked',false)
     this.taskTemplateAdd=false;
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

        return this.projectService.AddProjTask(postData).subscribe(
          (data:any)  => {
          if(data.status==200){

          this.GetAllTaskByProjectID();
    this.ProjectTaskCountByProjectID();

            this.resetForm()
            this.spinner.hide();

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
public onUpdateProjTask(){
  this.spinner.show();
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

      "id": null,
      "task_id": null,
      "empid": this.assigneeStatus[i],


  });
  }
  let postData={
    id:this.editTaskId,
    project_id: localStorage.getItem('project_id'),
    activtity_id: this.activListValue,

    task_name: this.taskLogForm.get('taskName').value  ,
    task_desc: this.taskLogForm.get('desc').value,
    priority_id:this.taskPriority,
    status_id:this.taskStatus,
    assigned_empid:this.leadValue,
    // dep_id: this.departmentLeadValue
      due_date: this.ejsDueDate,
      employees:empdata,
      is_approver:this.isApprove,
      is_approver_id:(this.isApprove?this.approverTaskValue:null),

  }


 $('#toggleCheck').prop('checked',true);
//  $('#toggleCheck').attr('checked', true);
 $('#toggleCheck').attr('disabled', 'disabled')


// team_member_empid.push(user_info['id'])





        return this.projectService.UpdateTask(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          if(data.status==200){
            //this.TaskView();
  this.spinner.hide();


          this.GetAllTaskByProjectID();
          this.GetProjectActivityTaskRatioByProjectID();
            this.resetForm();

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

public resetForm(){
  this.taskLogForm.reset();
  this.taskPriority='';
  this.assigneeStatus='';
  this.approverValue='';
  this.editable=false;
  this.activListValue='';
  this.dateValue=null;
  this.isApprove=false;
   $("#task_log_modal").modal('hide');
   $("#chosetaskTemp").prop('checked',false);
   this.choseTaskTemplate=false;



}
public resetMultiTaskForm(){
  // let arr = <FormArray>this.emailForm.controls['emails'];
  // arr.clear();
  const emails = this.emailForm.get('emails') as FormArray
  if (emails.length > 1) {
    //emails.removeAt(i)
    for (var i = 0; i < emails.length; i++) {
      // logik to create new items

      emails.removeAt(i)

      }

  } else {
// emails.controls.forEach(pair => pair.patchValue({ Assignee: '' }));

    emails.reset()
  }
  emails.controls.forEach(pair => pair.patchValue({ Assignee: '' }));

// Iterates the Pairs' FormArray controls and use patchValue if you want to reset or assign a new value to a particular property
  // this.emailForm.controls['email'].reset();
this.submitClicked=false;
}
public tab1(){
  this.singleTask=true;
  this.multiTask=false;
}
public tab2(){
  this.singleTask=false;
  this.multiTask=true;
}
public resetActivityForm(){
  this.activityLogForm.reset();
  this.taskPriority='';
  this.assigneeStatus='';
  this.approverValue='';
  this.activityEditable=false;
this.editformSubmitted=false;
this.addformSubmitted=false;
this.disableAddAct=true;
this.approveChecked=null;


  $("#activity_log_modal").modal('hide');


}
public OnTaskClose(){
  this.resetForm();
  this.resetMultiTaskForm();
}
public enableAddAct(){
  // if(this.activityLogForm.get('activName').value!=''){
  //   this.disableAddAct=false;

  // }else{
  //   this.disableAddAct=true;

  // }
}
public changedPriority(e: any): void {
  this.taskPriority= e.value;

}

public FindTeamsByOrgID(){
  this.teamService.FindTeamsByOrgID().subscribe(

    (data:any) => {


var results=[]
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
public checkIsTeam(e:any){

  if(e.srcElement.checked) {
    this.teamAdd=true;
    this.EmpList();

  }else{
    this.teamAdd=false;

  }

}
public checkIsTemplate(e:any){

  if(e.srcElement.checked) {
    this.templateAdd=true;

  }else{
    this.templateAdd=false;

  }

}
public checkIsTaskTemplate(e:any){

  if(e.srcElement.checked) {
    this.taskTemplateAdd=true;

  }else{
    this.taskTemplateAdd=false;

  }

}
public checkIsChooseTaskTemplate(e:any){

  if(e.srcElement.checked) {
    this.choseTaskTemplate=true;

  }else{
    this.choseTaskTemplate=false;

  }

}
public checkIsChooseMilestTemp(e:any){

  if(e.srcElement.checked) {
    this.choseMilestTemplate=true;

  }else{
    this.choseMilestTemplate=false;

  }

}

public checkIsDept(e: any): void{

  if(e.srcElement.checked) {
    this.filterEmpByDept=true;


  }else{
    this.filterEmpByDept=false;

  }
  // this.filterEmpByDept=!this.filterEmpByDept
  if(this.filterEmpByDept){
    // this.getAllDept();
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

public RemoveProjectActivity(id){
  let postData={
    "ID": id
  }
  this.projectService.RemoveProjectActivity(postData).subscribe(

    (data:any) => {

      if(data.status==200){
        this.FindAllProjectActivityByProjectID();


       //  this.editableLoc=true;

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

          //  this.router.navigate(['/dashboard']);
        })


    }

    )
}
public RemoveProjectTask(id){
  let postData={
    "ID": id
  }
  this.projectService.RemoveTask(postData).subscribe(

    (data:any) => {

      if(data.status==200){
        this.GetAllTaskByProjectID();


       //  this.editableLoc=true;

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

          //  this.router.navigate(['/dashboard']);
        })


    }

    )
}
public ProjectTaskCountByProjectID(){
  let postData={
    "ID": localStorage.getItem('project_id')
  }
  this.projectService.ProjectTaskCountByProjectID(postData).subscribe(

    (data:any) => {

if(data.length!=0){
  this.projTaskCount=data;

}else{
  this.projTaskCount=0;

}
      // let dataObj = JSON.parse(data['token']);






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
  this.currentUser=user_info['id'];
  this.assigneeStatus= e.value;

  if(this.assigneeStatus.length==1){
    if(this.assigneeStatus[0]==user_info['id']){
      this.showAssigneeApprove=false;
      this.showAssigneeLead=false;
    }else{
      this.showAssigneeApprove=true;
      this.showAssigneeLead=true;

    }


  }else{
    this.showAssigneeLead=true;
    this.showAssigneeApprove=true;


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

changedApprover(e){
this.approverValue=e.value;
this.addformSubmitted=false;

}
changedTaskApprover(e){
  this.approverTaskValue=e.value;
  }
changedProjStatus(e){
  this.projStatusValue=e.value;
  }
GetProjectActivityByProjectID(){
  let postData={
    id:localStorage.getItem('project_id')
  }
  this.projectService.GetProjectActivityByProjectID(postData).subscribe(

    (data:any) => {
      this.projActivityCount=data.length;
      // this.dataSource=data;
      var results=[{ id: '', text: 'Select' }]

      // let dataObj = JSON.parse(data['token']);
    //

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
    "id": data[i].id,
    "text": data[i].activity_name
});

}


this.activList =results;
 this.ejsactivList=results;

    }
  )
    }

    FindAllProjectActivityByProjectID(){
      let postData={
        id:localStorage.getItem('project_id')
      }
      this.projectService.FindAllProjectActivityByProjectID(postData).subscribe(

        (data:any) => {
          this.dataSource=data;
          this.allActCount=data.length;
          // this.dataSource.connect().next(data);
          let completedTasks=[]
          let openTasks=[]
          let inProgrssTasks=[]


          if(data){
            for (var i = 0; i < data.length; i++) {
              // logik to create new items

              if(data[i].status_name=="Completed"){


                completedTasks.push(data[i]);
              }
              else if(data[i].status_name=="Open"){
                openTasks.push(data[i]);


              }else{
                inProgrssTasks.push(data[i]);
              }
            this.activityCompletedList=completedTasks;
            this.activityOpenList=openTasks;
           this.completedActCount=completedTasks.length;




          }
        }


    }



      )
        }

public GetAllTaskByProjectID (){
  let postData={
    id:localStorage.getItem('project_id')
  }
  this.projectService.GetAllTaskByProjectID(postData).subscribe(

    (data:any) => {
      this.taskDataSource=data;
           // this.dataSource.connect().next(data);
           let completedTasks=[]
           let openTasks=[]
           let inProgrssTasks=[]


           if(data){
             for (var i = 0; i < data.length; i++) {
               // logik to create new items

               if(data[i].status_name=="Completed"){


                 completedTasks.push(data[i]);
               }
               else if(data[i].status_name=="Open"){
                 openTasks.push(data[i]);


               }else{
                 inProgrssTasks.push(data[i]);
               }
             this.taskCompletedList=completedTasks;
             this.taskOpenList=openTasks;




           }
         }

      // let dataObj = JSON.parse(data['token']);
    //






    }
  )
    }

public  getAllEmployee(){
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
    // public onstartDtChange(e){
    //   this.startdateValue=moment(e.value).format('L');
    //

    // }
public dragdrp(){
            this.router.navigate(['/drag-drop']);
        }
    public onstartDtChange(e){
      this.startdateValue=moment(e.value).format('L');

        this.disableEndDate=false;

        this.activityLogForm.get('startDate').valueChanges.subscribe(() => {
          // fires when the input value has actually changed
          if(this.activityLogForm.get('startDate').value!=''){
            this.startValChange=true;
          }
          let startDate=this.activityLogForm.get('startDate').value;
          this.minEndDate=startDate;

          this.activityLogForm.get('endDate').enable()






      });


    }
    public onendDtChange(e){
      this.enddateValue=moment(e.value).format('L');
      this.disableAddAct=false;


    }
    public onCheckChange(e){
      this.addApprover=e.value;
      this.showApprover=!this.showApprover;
      // this.isApprove=true;
    }
    public onTaskCheckChange(e){

      this.taskApprove=e.value;
      if(e.srcElement.checked==true){
        this.isApprove=true
      }else{
        this.isApprove=false

      }

    }
    public OnActivityClose(){
      $("#activity_log_modal").modal('hide');
    this.disableAddAct=true;
     this.activityLogForm.reset();
     this.addformSubmitted=false;
     this.editformSubmitted=false;
     this.milestoneTempValue='';
     this.choseMilestTemplate=false;
     $('#milestTemp').prop('checked',false)

  //    this.activityLogForm.patchValue({

  //     startDate: moment().format('L'),
  //     endDate: moment().format('L'),



  //  });
     this.activityEditable=false;
     this.approveChecked=null;


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
    this.ejstaskPriorData =results;
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
  public  GetAllProjectStatus(){
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


  this.projStatusData =results;
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
    public  getEmployeeByOrgId(){
      let user_info:object;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));

}
      this.empService.getEmployeeByOrgId().subscribe(

        (data:any) => {
          var results=[{ id: user_info['id'], text: 'Me' }]

          // let dataObj = JSON.parse(data['token']);
        //

    for (var i = 0; i < data.length; i++) {
    // logik to create new items
    if(data[i].id!=user_info['id']){

    results.push({
        "id": data[i].id,
        "text": data[i].first_name
    });

    }
  }
  results.splice(data.length+1, 0,{ id: 'Anyone', text: 'Anyone'})

    this.assigneeData =results;
    this.ejsassigneeData =results;
    this.showAssigneeLead=false;
  this.showAssigneeApprove=false;
  if(this.editable==false){
    this.leadValue=user_info['id'];
    this.assigneeStatus=user_info['id'];
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

              //  this.router.navigate(['/dashboard']);
            })


        }

        )
        }
    public changedActTask(e){
      this.activListValue=e.value;
    }
    public onAddProjActivity(){
      this.addformSubmitted=true;
      let postData={

        project_id: localStorage.getItem('project_id'),

        activity_name: this.activityLogForm.get('activName').value  ,
        activity_desc: this.activityLogForm.get('remarks').value,
        unit: null,
        qty: null,

        start_date:moment(this.startdateValue).format('L') ,
        end_date: moment(this.enddateValue).format('L'),
        is_approve_req:this.showApprover,
        approved_id:(this.showApprover?this.approverValue:null),
        // status_id: "a96a57b9-0ad0-4460-8bff-c421af3c5cd3",




      }
      if(this.activityLogForm.get('startDate').value!='' &&
       this.activityLogForm.get('endDate').value!='' &&
       this.activityLogForm.get('activName').value!=''
      && this.showApprover?this.approverValue!='':true ){
        this.spinner.show();
        if(this.templateAdd){
          let data={
            "id": null,
            "template_name": this.activityLogForm.get('templateName').value,
            "milestone_name":this.activityLogForm.get('activName').value ,
            "milestone_desc": this.activityLogForm.get('remarks').value,
            "start_date": moment(this.startdateValue).format('L'),
            "end_date": moment(this.enddateValue).format('L'),

            is_approve_req:this.showApprover,
            approve_emp_id:(this.showApprover?this.approverValue:null),

          };

          this.projectService.AddMilestoneTemplate(data).subscribe(
            (data:any)  => {
            if(data.status==200){

 $('#milestoneTemp').prop('checked',false);
this.templateAdd=false

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
      return this.projectService.AddProjectActivity(postData).subscribe(
        (data:any)  => {
          // let dataObj = JSON.parse(data['token']);

        if(data.status==200){
           this.activityLogForm.reset();
           this.GetProjectActivityByProjectID();
           this.FindAllProjectActivityByProjectID();
          this.spinner.hide();
          $("#activity_log_modal").modal('hide');
          this.addformSubmitted=false;
          this.approveChecked=null;
          this.milestoneTempValue='';
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
    public onEditProjActivity(){
     this.editformSubmitted=true;
      let postData={
        id:this.editActivityId,
        project_id: localStorage.getItem('project_id'),

        activity_name: this.activityLogForm.get('activName').value  ,
        activity_desc: this.activityLogForm.get('remarks').value,
        unit: null,
        qty: null,

        start_date:moment(this.startdateValue).format('L') ,
        end_date: moment(this.enddateValue).format('L'),
        is_approve_req:this.showApprover,
        approved_id:this.approverValue,
         status_id: this.projStatusValue,




      }
      if(this.activityLogForm.get('startDate').value!='' && this.activityLogForm.get('endDate').value!='' && this.activityLogForm.get('activName').value!='' && this.showApprover?this.approverValue!='':true ){
        this.spinner.show();

      return this.projectService.UpdateProjectActivity(postData).subscribe(
        (data:any)  => {
          // let dataObj = JSON.parse(data['token']);

        if(data.status==200){
          //  this.activityLogForm.reset();
           this.resetActivityForm();

           this.FindAllProjectActivityByProjectID();
this.GetProjectActivityRatioByProjectID();
          // $("#activity_log_modal").modal('hide');
          this.spinner.hide();

          this.toastr.success(data['desc'], undefined,{
            positionClass: 'toast-top-center'
       });

        }else{
          this.toastr.error(data['desc'], undefined,{
            positionClass: 'toast-top-center'
       });
          this.spinner.hide();

          Swal.fire(
            'Error!',
            data['result'].desc,
            'error'
          ).then(
            (result)=> {

            })



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
    public goBack(){
      window.history.go(-1);
    }
public FindByProjectID(){
//   this.AddNewSubmit=false;
//   this.editable=true;
// this.editTaskId=dept_id;
// this.showTaskList=false;
// this.showAddForm=true;
this.spinner.show();
  let postData={
    id:localStorage.getItem('project_id')
  }
 this.projectId=localStorage.getItem('project_id');

  this.projectService.FindByProjectID(postData).subscribe(
    (data:any)  => {

    this.GetProjectActivityRatioByProjectID();
    this.GetProjectActivityTaskRatioByProjectID();
    this.spinner.hide();

    this.projectName=data.project_name;
    this.selectedValue=data.project_name;

    this.project_start_date=data.start_date;
    this.project_end_date=data.end_date;
    this.project_desc=data.project_desc;
if(data.entityLocation!=null){
  this.editableLoc=true;
  if(data.entityLocation.lat!="" && data.entityLocation.lang!="" ){

    //  this.searchElementRef.nativeElement.value=data.entityLocation.formatted_address;
    this.nearbyAddress=data.entityLocation.geo_address;
    this.latitude=parseFloat(data.entityLocation.lat);
    this.longitude=parseFloat(data.entityLocation.lang);
  // this.address=data.entityLocation.formatted_address;
  this.changed_street_number=data.entityLocation.street_number;
  this.changed_route=data.entityLocation.route;
  this.changed_locality=data.entityLocation.locality;
  this.changed_administrative_area_level_2=data.entityLocation.changed_administrative_area_level_2;
  this.changed_administrative_area_level_1=data.entityLocation.changed_administrative_area_level_1;
  this.changed_country=data.entityLocation.changed_country;

  this.mapsAPILoader.load().then(() => {
    //this.nearByPlaces();
   this.geoCoder = new google.maps.Geocoder;

    this.setPredefinedLocation(this.latitude,this.longitude);
  })

}


}
else{
  this.editableLoc=false;

}
if(data.entityCustomer!=null){
  this.GetAllCustomer();

  this.editCustomer=true;
  this.customerId=data.entityCustomer.id;
  this.customerVal=data.entityCustomer.id;
}else{
  this.editCustomer=false;

}


      // this.projectForm.patchValue({

      //   project_name: data.project_name,
      //   desc:data.project_desc,
      //   startDate:moment(data.start_date).format('L'),
      //   endDate:moment(data.end_date).format('L'),
      //   // completeDate:moment(data.completed_date).format('L'),
      //   accessControl:data.is_private==true?'is_private':'is_public'
      //  // accessControl:new FormControl('')


      // })
     // this.EmpList();
      // this.DesgnList();

    //   this.taskPriority=data.priority,
    //  this.taskStatus=data.status,
    //   this.assigneeStatus=data.assigned_empid,

    //   this.projectForm.valueChanges.subscribe(
    //     value=> {
    //
    //     }
    //  );

    //  this.projectForm.get('firstName').valueChanges.subscribe(val=>{
    //    if(data.first_name!=val){
    //

    //    }
    // })
    // this.projectForm.get('firstName')
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

private setPredefinedLocation(lat,lang) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = lat;
      this.longitude = lang;
      this.zoom = 8;

      this.getAddress(lat,lang);

    });
  }
}

 createFormGroup(data: IOrderModel): FormGroup {
        return new FormGroup({
            OrderID: new FormControl(data.OrderID, Validators.required),
            OrderDate: new FormControl(data.OrderDate, this.dateValidator()),
            // CustomerName: new FormControl(data.CustomerName, Validators.required),
            Freight: new FormControl(data.Freight),
            ShipAddress: new FormControl(data.ShipAddress),
            ShipCity: new FormControl(data.ShipCity),
            ShipCountry: new FormControl(data.ShipCountry),
            TaskTemplate: new FormControl(data.TaskTemplate),
            MilestoneName:new FormControl(data.MilestoneName),
            Priority:new FormControl(data.Priority),
            Assignee:new FormControl(data.Assignee),
            Lead:new FormControl(data.Lead),
            Approver:new FormControl(data.Lead),
            TemplateName:new FormControl(data.TemplateName),

        });
    }

    dateValidator() {
        return (control: FormControl): null | Object  => {
            return control.value && control.value.getFullYear &&
            (1900 <= control.value.getFullYear() && control.value.getFullYear() <=  2099) ? null : { OrderDate: { value : control.value}};
        }
    }

    actionBegin(args: SaveEventArgs): void {
      // $('#ta')
  $("#task_log_modal").modal('hide');

        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            this.submitClicked = false;
            this.orderForm = this.createFormGroup(args.rowData);
            if(args.rowData['Approver']!=null && args.requestType === 'beginEdit'){
this.approveChecked=true
            }else{
this.approveChecked=false

            }
        }
        if (args.requestType === 'save') {
            this.submitClicked = true;
  $("#task_log_modal").modal('show');

            if (this.orderForm.valid) {
                args.data = this.orderForm.value;

            } else {
                args.cancel = true;
            }
        }


    }

    actionComplete(args: DialogEditEventArgs): void {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            if (Browser.isDevice) {
                args.dialog.height = window.innerHeight - 90 + 'px';
                args.dialog.zIndex = 2000;
                (<Dialog>args.dialog).dataBind();
            }
            // Set initail Focus
            if (args.requestType === 'beginEdit') {
                (args.form.elements.namedItem('ShipAddress') as HTMLInputElement).focus();

            } else if (args.requestType === 'add') {
                (args.form.elements.namedItem('OrderID') as HTMLInputElement).focus();
            }
        }
    }

  //   get OrderID(): AbstractControl  { return this.orderForm.get('OrderID'); }
     get Assignee(): AbstractControl { return this.orderForm.get('Assignee'); }
    // get Controls(): AbstractControl { return this.emailForm.get('emails'); }

    get OrderDate(): AbstractControl { return this.orderForm.get('OrderDate'); }
    get TaskTemplate(): AbstractControl { return this.orderForm.get('TaskTemplate'); }
    get MilestoneName(): AbstractControl { return this.orderForm.get('MilestoneName'); }
    get Priority(): AbstractControl { return this.orderForm.get('Priority'); }
    get Lead(): AbstractControl { return this.orderForm.get('Lead'); }
    get Approver(): AbstractControl { return this.orderForm.get('Approver');
  }

    public changedEjsAssignee(e): void {
      let user_info:object;
      if(localStorage.getItem('user_info')){
          user_info= JSON.parse(localStorage.getItem('user_info'));

      }

       let pred:Predicate;

      if(this.countryObj.value)
      if(this.countryObj.value.length==1){
        if(this.countryObj.value[0]==user_info['id']){
          this.showAssigneeApprove=false;
        }else{
          this.showAssigneeApprove=true;

        }
        this.showAssigneeLead=false;

      }else{
        this.showAssigneeLead=true;
        this.showAssigneeApprove=true;



      }




    }
    public addEmailFormGroup() {
      const emails = this.emailForm.get('emails') as FormArray


      this.showAssigneeApprove=false;
      this.showAssigneeLead=false;
      this.showApprover=false;
      this.submitClicked=true;
      if(this.emailForm.get('emails').status=='VALID'){
        emails.push(this.createEmailFormGroup())
      this.submitClicked=false;


      }
    }

    public removeOrClearEmail(i: number) {
      const emails = this.emailForm.get('emails') as FormArray
      if (emails.length > 1) {
        emails.removeAt(i)
      } else {
        emails.reset()
      }
    }

    private createEmailFormGroup(): FormGroup {
      return new FormGroup({
        // 'emailAddress': new FormControl('', Validators.email),
        // 'emailLabel': new FormControl(''),
        'OrderID': new FormControl('',Validators.required),
        'Priority': new FormControl('',Validators.required),
        'taskDesc': new FormControl(''),
        'DueDate': new FormControl('',Validators.required),
        'Assignee': new FormControl('',Validators.required),
        'MilestoneName':new FormControl('',Validators.required),
        'Lead':new FormControl(''),
        'Approver':new FormControl(''),
        'ApproverCheck':new FormControl('')


      })
    }

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      emails: this.formBuilder.array([this.createEmailFormGroup()])
    });
    this.projectProgress=0;
    chart = am4core.create("chartdiv", am4charts.PieChart);
    taskchart = am4core.create("taskchartdiv", am4charts.PieChart);

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "ratio";
    pieSeries.dataFields.category = "project_status_name";
   //  chart.innerRadius = am4core.percent(40);
    chart.legend = new am4charts.Legend();
    // Add and configure Series
    let taskpieSeries = taskchart.series.push(new am4charts.PieSeries());
    taskpieSeries.dataFields.value = "ratio";
    taskpieSeries.dataFields.category = "status_name";
    // taskchart.innerRadius = am4core.percent(40);
    taskchart.legend = new am4charts.Legend();
    if(localStorage.getItem('planType')){

      this.planType='Basic'
    }
    if(localStorage.getItem('user_info')){
      this.user_info= JSON.parse(localStorage.getItem('user_info'));
      this.full_name=this.user_info['first_name'];

     ;


  }
    this.FindByProjectID();
    this.GetPriorityByOrgID();
    this.piedata = [
      { x: 'Jan', y: 3, text: 'Jan: 3' }, { x: 'Feb', y: 3.5, text: 'Feb: 3.5' },
      { x: 'Mar', y: 7, text: 'Mar: 7' }, { x: 'Apr', y: 13.5, text: 'Apr: 13.5' },
      { x: 'May', y: 19, text: 'May: 19' }, { x: 'Jun', y: 23.5, text: 'Jun: 23.5' },
      { x: 'Jul', y: 26, text: 'Jul: 26' }, { x: 'Aug', y: 25, text: 'Aug: 25' },
      { x: 'Sep', y: 21, text: 'Sep: 21' }, { x: 'Oct', y: 15, text: 'Oct: 15' },
      { x: 'Nov', y: 9, text: 'Nov: 9' }, { x: 'Dec', y: 3.5, text: 'Dec: 3.5' }];
    this.tooltip = {
            enable: true
            }

    this.ProjectTaskCountByProjectID();
    this.GetProjectActivityByProjectID();
    this.GetAllTaskByProjectID();
    this.FindAllProjectActivityByProjectID();
    // this.getAllPriority();
    // this.getAllStatus();
    // this.getEmployeeByOrgId();
    // this.getAllEmployee();
    this.activityLogForm = new FormGroup({
      activName: new FormControl('', [Validators.required]),
      remarks: new FormControl(''),
      startDate: new FormControl('',[Validators.required]),
      endDate: new FormControl('',[Validators.required]),
      templateName: new FormControl('',[Validators.required])



   });
   if(this.activityLogForm.get('startDate').value==''){
    this.disableEndDate=true;
    this.disableAddAct=true
  }
  this.GetAllCustomer();

   this.customerForm = new FormGroup({
    customer_Name:new FormControl(''),
     contact_name:new FormControl(''),
     customer_type:new FormControl(''),
     customer_email:new FormControl(''),
     customer_phone:new FormControl(''),
     city:new FormControl(''),


     street_1: new FormControl(''),
     street_2: new FormControl(''),


     country: new FormControl('', [Validators.required]),

     name: new FormControl(''),
     position: new FormControl(''),
     phone: new FormControl(''),
     mobile: new FormControl(''),
     email: new FormControl(''),






  });
   this.taskLogForm= new FormGroup({
    taskName: new FormControl('', [Validators.required]),
    desc: new FormControl(''),
    date: new FormControl(''),
    taskTemplateName: new FormControl('')



 });

   if(this.taskLogForm.get('date').value==''){
    this.disableAddTask=true;
  }else{
   this.disableAddTask=false;

  }
  this.taskLogForm.get('date').valueChanges.subscribe(() => {
    // fires when the input value has actually changed
    this.disableAddTask=false;

  });
  let user_info:object;
  if(localStorage.getItem('user_info')){
      user_info= JSON.parse(localStorage.getItem('user_info'));

  }


  this.data = this.taskData;
  this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  this.toolbar = ['Add', 'Edit', 'Delete'];
  this.pageSettings = { pageCount: 5};

//
  }

  // ngAfterViewInit() {
  //   this.zone.runOutsideAngular(() => {
  //     am4core.ready(function() {
  //       setTimeout(() => {
  //         let chart = am4core.create('chartdiv', am4charts.XYChart);

  //         chart.paddingRight = 20;

  //         let data = [];
  //         let visits = 10;
  //         for (let i = 1; i < 366; i++) {
  //           visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
  //           data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
  //         }

  //         chart.data = data;

  //         let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  //         dateAxis.renderer.grid.template.location = 0;

  //         let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //         valueAxis.tooltip.disabled = true;
  //         valueAxis.renderer.minWidth = 35;

  //         let series = chart.series.push(new am4charts.LineSeries());
  //         series.dataFields.dateX = "date";
  //         series.dataFields.valueY = "value";

  //         series.tooltipText = "{valueY.value}";
  //         chart.cursor = new am4charts.XYCursor();

  //         let scrollbarX = new am4charts.XYChartScrollbar();
  //         scrollbarX.series.push(series);
  //         chart.scrollbarX = scrollbarX;

  //         this.chart = chart;


  //       }, 1000);
  //       // chart code

  //     });

  //   });
  // }

  // ngOnDestroy() {
  //   this.zone.runOutsideAngular(() => {
  //     if (this.chart) {
  //       this.chart.dispose();
  //     }
  //   });
  // }

}
export interface IOrderModel {
  OrderID?: string;
  // CustomerName?: string;
  ShipCity?: string;
  OrderDate?: Date;
  Freight?: number;
  ShipCountry?: string;
  ShipAddress?: string;
  TaskTemplate?:string;
  MilestoneName?:string;
  Priority?:string;
  Assignee?:string;
  Lead?:string;
  TemplateName?: string;
  Approver?:string;

}
