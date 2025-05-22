import { Component,ViewChild, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { extend } from '@syncfusion/ej2-base';
import { KanbanComponent, ColumnsModel, CardSettingsModel, SwimlaneSettingsModel, DialogSettingsModel, CardRenderedEventArgs } from '@syncfusion/ej2-angular-kanban';

import { ProjectService } from '../../services/project.service';
import Swal from 'sweetalert2';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
am4core.useTheme(am4themes_animated);
let chart;
let taskchart;

@Component({
  selector: 'app-drag-drop-new',
  templateUrl: './drag-drop-new.component.html',
  styleUrls: ['./drag-drop-new.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DragDropNewComponent implements OnInit {
  // public data: Object[] = kanbanData;
  public cardSettings: CardSettingsModel = {
      contentField: 'sub_task_name',
      headerField: 'sub_task_id',
      showHeader: false

  };
//   public cardSettings: CardSettingsModel = {
//     contentField: 'assignedto',
//     headerField: 'task_name',

// };
  primaryContact={
    name:'empty',
    email:'empty',
    phone:'empty'
      };
      projectAttribute={
        total_hours:'',
        total_amount:'',
        net_total_amount:'',
        profit_margin_amount:'',
    gross_total_amount:'',
    vat_amount:''

      };

  @ViewChild('kanbanObj',{static:true}) kanbanObj: KanbanComponent;
    // public kanbanData: Object[] = extend([], cardData, null, true) as Object[];
    public columns: ColumnsModel[] = [
      { headerText: 'To Do', keyField: 'Open' },
      { headerText: 'In Progress', keyField: 'InProgress' },
      { headerText: 'In Review', keyField: 'Review' },
      { headerText: 'Done', keyField: 'Close' }
  ];
    // public cardSettings: CardSettingsModel = {
    //     headerField: 'task_name',
    //     //template: '#cardTemplate',
    //     // selectionType: 'Multiple',
    //     // priority: 'RankId'
    // };
    public dialogSettings: DialogSettingsModel = {
        fields: [
            { text: 'ID', key: 'Title', type: 'Input' },
            { key: 'Status', type: 'DropDown' },
            { key: 'Assignee', type: 'DropDown' },
            { key: 'RankId', type: 'Input' },
            { key: 'Summary', type: 'TextArea' }
        ]
    };
    public swimlaneSettings: SwimlaneSettingsModel = { keyField: 'TaskName' };
  taskDataSource : Object[];
  project_start_date: any;
  projectName: any;
  project_end_date: any;
  project_desc: any;
  projectProgress: any;
  projActivityCount=0;
  projTaskCount=0;
  taskStatusData: { id: string; text: string; }[];
  projectData: any;
  xpandStatus: boolean;
  selectedValue: any;
  selectedProjectId: any;
  projectId: string;
  cstName: any='';
  nearbyAddress='';
  projectPrefix: any;
  milestoneTabValue: any;
  milestoneData: any;
  projectProperty: any={
    "milestoneCount": "0",
  "taskCount": "0",
  "overDueCount": "0",
  "dueTodayCount": "0",
  "openTaskCount": "0",
  "inProgressCount": "0",
  "completedTaskCount": "0",
  "assignedCount": "0",
  "unAssignedCount": "0",
  projectBugetedHours: "0",
  projectProgressPercent: "0",
  projectWorkedHours: "0"

  };



  GetProjectActivityByProjectID(){
    let postData={
      id:localStorage.getItem('project_id')
    }
    this.projectService.GetProjectMilestoneByProjectID(postData).subscribe(

      (data:any) => {
        this.projActivityCount=data.length;
        this.milestoneData=data;
        if(data.length!=0){
          this.milestoneTabValue=data[0].milestoneId;
          this.getAllTaskByActId(data[0].milestoneId);
        }else{
          this.milestoneTabValue=''
        }
      }
    )
      }

      getAllTaskByActId(id){
          this.milestoneTabValue = id;
       this.spinner.show();
          let postData={
            id:id
          }
          this.projectService.GetAllProjectSubTaskByMilestoneID(postData).subscribe(

            (data:any) => {
           if(data!=null && data.length!=0){
             this.taskDataSource=data;
             this.spinner.hide();
           }else{
            this.spinner.hide();

           }

            }
          )
        }
        public subTaskItemRenderer(args: CardRenderedEventArgs): void {
          let itemStatus = args.element.getElementsByClassName('e-card-content')[0];
          itemStatus.insertAdjacentHTML('beforeend', '<div class="lead_name" > '+(args.data.lead_name!=null?args.data.lead_name:'')+'</div>'+'<div style="color:#2c77f4" class="lead_name">'+(args.data.priority_name!=null?args.data.priority_name:'')+'</div>'+'<div class="dueDate">'+(args.data.due_date!=null?args.data.due_date:'')+'</div>');
        }

public updateStatus(args){
  let status_id;
  // let status=args.data[0]['status_name']
  let user_info= JSON.parse(localStorage.getItem('user_info'));
  console.log('args',args.data[0]);

  if(args.data[0]!=null && args.data[0]['lead_id']){

  if((args.data[0]['lead_id']=='Anyone' || args.data[0]['lead_id']==user_info['id'])){
    if(args.data[0]['status_name']){
      for(var i=0;i<this.taskStatusData.length;i++){
        if(this.taskStatusData[i].text==args.data[0]['status_name']){
          status_id=this.taskStatusData[i].id;
        }
          }

  let postData={
    "id": args.data[0]['sub_task_id'],
    "status_id": status_id,
  }

     this.projectService.UpdateProjectSubTaskStatus(postData).subscribe(

          (data:any) => {

      if(data.status=='200'){
        // this.GetAllTaskByProjectID();
        this.getAllTaskByActId(this.milestoneTabValue);
        this.toastr.success(data['desc'], undefined,{
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

              (result)=> {


              })


          }

          )

  }



  }else{
  console.log('args.cancel',args.data[0]['lead_id']);

    args.cancel = true;

  }
}

if(args.data[0]!=null && args.data[0]['lead_id']==null){
  args.cancel = true;

}

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
public  getAllStatus(){
  this.taskService.GetStatusByOrgID().subscribe(

    (data:any) => {

  var results=[]
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
public showError(args){
  // args.cancel = true;
  let user_info= JSON.parse(localStorage.getItem('user_info'));
  console.log('showError',args,user_info['id'])

       if(args.data[0]['lead_id']=='Anyone' || args.data[0]['lead_id']==user_info['id']  ){
       }else{
        this.toastr.error('Only Assignee is able to change the task status', undefined,{
          positionClass: 'toast-top-center'
     });
       }

}


    constructor(private projectService:ProjectService,private taskService:TaskService,private toastr:ToastrService,private spinner:NgxSpinnerService) {
    }

    public getString(assignee: string) {
        return assignee.match(/\b(\w)/g).join('').toUpperCase();
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
this.selectedValue=data.project_name;
    this.projectName=data.project_name;
    this.projectPrefix=data.project_prefix;

    this.project_start_date=data.start_date;
    this.project_end_date=data.end_date;
    this.project_desc=data.project_desc;
    if(data.projectAttribute!=null){
      this.projectAttribute=data.projectAttribute;
    }
    this.spinner.hide();
    if(data.entityLocation!=null){
      if(data.entityLocation.lat!="" && data.entityLocation.lang!="" ){

        //  this.searchElementRef.nativeElement.value=data.entityLocation.formatted_address;
        this.nearbyAddress=data.entityLocation.geo_address;


    }


    }

    if(data.entityCustomer!=null){


      this.cstName=data.entityCustomer.cst_name;
      for(var i=0;i<data.entityContact.length;i++){
        if(data.entityContact[i]['is_primary']==true){
          this.primaryContact=data.entityContact[i]
        }
      }

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
public GetProjectActivityTaskRatioByProjectID(){
  let postData={
    id:localStorage.getItem('project_id')
  }
  this.projectService.GetProjectActivityTaskRatioByProjectID(postData).subscribe(

    (data:any) => {
     // taskchart.data=data;
      // let dataObj = JSON.parse(data['token']);
    //





    }
  )}

  // GetProjectActivityByProjectID(){
  //   let postData={
  //     id:localStorage.getItem('project_id')
  //   }
  //   this.projectService.GetProjectActivityByProjectID(postData).subscribe(

  //     (data:any) => {
  //       this.projActivityCount=data.length;

  //     }
  //   )
  //     }
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
public GetProjectActivityRatioByProjectID(){
  let postData={
    id:localStorage.getItem('project_id')
  }
  this.projectService.GetProjectActivityRatioByProjectID(postData).subscribe(

    (data:any) => {
   //   chart.data=data;
        for(var i=0;i<data.length;i++){
      if(data[i].project_status_name=="Completed"){
      this.projectProgress=data[i].ratio;

        }
      }


      // let dataObj = JSON.parse(data['token']);
    //





    }
  )}
    public GetAllTaskByProjectID (){
      let postData={
        id:localStorage.getItem('project_id')
      }
      this.projectService.GetAllTaskByProjectID(postData).subscribe(

        (data:any) => {
          this.taskDataSource=data;


        }
      )
        }
        ProjectPropertyByProjectID(){
          //   this.AddNewSubmit=false;
          //   this.editable=true;
          // this.editTaskId=dept_id;
          // this.showTaskList=false;
          // this.showAddForm=true;
          this.spinner.show();
            let postData={
              id:localStorage.getItem('project_id')
            }


            this.projectService.ProjectListPropertyByProjectID(postData).subscribe(
              (data:any)  => {
                 this.projectProperty=data;


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

  ngOnInit() {
  // this.GetAllTaskByProjectID();
this.FindByProjectID();
this.ProjectTaskCountByProjectID();
this.GetProjectActivityByProjectID();
this.getAllStatus();
this.GetPriorityByOrgID();
this.ProjectPropertyByProjectID();

    this.projectProgress=0;
    // chart = am4core.create("chartdiv", am4charts.PieChart);
    // taskchart = am4core.create("taskchartdiv", am4charts.PieChart);

    // Add and configure Series
  //   let pieSeries = chart.series.push(new am4charts.PieSeries());
  //   pieSeries.dataFields.value = "ratio";
  //   pieSeries.dataFields.category = "project_status_name";
  //  //  chart.innerRadius = am4core.percent(40);
  //   chart.legend = new am4charts.Legend();
  //   // Add and configure Series
  //   let taskpieSeries = taskchart.series.push(new am4charts.PieSeries());
  //   taskpieSeries.dataFields.value = "ratio";
  //   taskpieSeries.dataFields.category = "status_name";
  //   // taskchart.innerRadius = am4core.percent(40);
  //   taskchart.legend = new am4charts.Legend();
  }

}

