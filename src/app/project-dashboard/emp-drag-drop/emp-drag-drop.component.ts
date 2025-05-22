import { Component,ViewChild, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { extend } from '@syncfusion/ej2-base';
import { KanbanComponent, ColumnsModel, CardSettingsModel, SwimlaneSettingsModel, DialogSettingsModel } from '@syncfusion/ej2-angular-kanban';
import { kanbanData } from '../drag-drop/data';
import { ProjectService } from '../../services/project.service';
import Swal from 'sweetalert2';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import { jqxKanbanComponent } from 'jqwidgets-ng/jqxkanban';
import { EmployeeService } from '../../services/employee.service';
import { QuotationService } from '../../services/quotation.service';

import { HistoryService } from '../../services/history.service';

am4core.useTheme(am4themes_animated);
let chart;
let taskchart;
@Component({
  selector: 'app-emp-drag-drop',
  templateUrl: './emp-drag-drop.component.html',
  styleUrls: ['./emp-drag-drop.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EmpDragDropComponent implements OnInit {

  // public cardSettings: CardSettingsModel = {
  //     contentField: 'assignedto',
  //     headerField: 'task_name',

  // };
  public options: Select2Options;
  public empoptions: Select2Options;

  public cardSettings: CardSettingsModel = {
    contentField: 'Summary',
    headerField: 'Id'
};

  // @ViewChild('kanbanObj',{static:true}) kanbanObj: KanbanComponent;
  //   public kanbanData: Object[] = extend([], kanbanData, null, true) as Object[];
  //@ViewChild('myKanbanOne', { static: false }) myKanbanOne: jqxKanbanComponent;
  // @ViewChild('myKanbanTwo', { static: false }) myKanbanTwo: jqxKanbanComponent;
  @ViewChild('myKanbanThree', { static: true }) myKanbanThree: jqxKanbanComponent;
  fields: any =
  [
      { name: 'status', map: 'state', type: 'string' },
      { name: 'text', map: 'label', type: 'string' },
      { name: 'content', map: 'statusName', type: 'string' },
      // { name: 'tags', type: 'string' },
       { name: 'color', map: 'hex', type: 'string' },
    { name: 'resourceId', type: 'string' }
  ];
  onefield: any =
  [
      { name: 'status', map: 'state', type: 'string' },
      { name: 'text', map: 'label', type: 'string' },
      { name: 'content', map: 'statusName', type: 'string' },
      // { name: 'tags', type: 'string' },
       { name: 'color', map: 'hex', type: 'string' },
    { name: 'resourceId', type: 'string' }
  ];
  employeeList: any[];
  milestList: any[];
  selectedItem: any;
  taskList: any[];
  selectedKanbanItem: boolean=false;
  mainTaskList: any[];
  selectedTaskId: any;
  milestoneData: any;
  selectedIndex: any;
  milestoneTabValue='';
  entityContactData: { id: string; text: string; }[];
  entityContactVal: any;
  showBranchList: boolean=false;
  branchDataSource: any;
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
  nearbyAddress='';
  cstName='';
  projectPrefix: any;
  primaryContactName='';
  primaryContactEmail='';
  primaryContactPhone='';
  selectedActivitityId: any;
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
  activList: { id: string; text: string; }[];
  employeeData: any[];
  activListValue: any='';
  empValue: any='';
  assgnMilestClick: boolean=false;
  projempValue: any='';
  assgnProjClick: boolean=false;
  reassigned_empid=null;
  projReAssgn: boolean=false;

getWidth() : any {
  // if (document.body.offsetWidth < 850) {
  //   return '92%';
  // }

  /* return 1506; */
  return 4000;
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


    this.projectService.ProjectPropertyByProjectID(postData).subscribe(
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
getWidths() : any {
  if (document.body.offsetWidth < 850) {
    return '90%';
  }

  return 850;
}

  source: any =
  {
      localData:
      [
          // { state: 'new', label: 'Combine Orders',  hex: '#5dc3f0', resourceId: 3 },
          // { state: 'new', label: 'Change Billing Address', hex: '#f19b60', resourceId: 1 },
          // { state: 'new', label: 'One item added to the cart', hex: '#5dc3f0', resourceId: 3 },
          // { state: 'new', label: 'Edit Item Price', hex: '#5dc3f0', resourceId: 4 },
          // { state: 'new', label: 'Login 404 issue', hex: '#6bbd49' }
      ],
      dataType: 'array',
      dataFields: this.fields
  };
  dataAdapter: any ;
  source2: any =
  {
      localData:
      [
          { state: '1', label: 'Logout issue', tags: 'logout, issue', hex: '#5dc3f0', resourceId: 7 },
          { state: '1', label: 'Remember password issue', tags: 'password, issue', hex: '#6bbd49', resourceId: 8 },
          { state: '1', label: 'Cart calculation issue', tags: 'cart, calculation', hex: '#f19b60', resourceId: 9 },
          { state: '1', label: 'Remove topic issue', tags: 'topic, issue', hex: '#6bbd49' }
      ],
      dataType: 'array',
      dataFields: this.fields
  };
  dataAdapter2: any = new jqx.dataAdapter(this.source2);
  source3: any =
  {
      localData:
      [
          // { state: '2', label: 'Delete orders', tags: 'orders, combine', hex: '#f19b60', resourceId: 4 },
          // { state: '3', label: 'Add New Address', tags: 'address', hex: '#6bbd49', resourceId: 5 },
          // { state: '1', label: 'Rename items', tags: 'rename', hex: '#5dc3f0', resourceId: 6 },
          // { state: '2', label: 'Update cart', tags: 'cart, update', hex: '#6bbd49' }
      ],
      dataType: 'array',
      dataFields: this.fields
  };
  dataAdapter3: any;

    public data: Object[] = kanbanData;
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
    public swimlaneSettings: SwimlaneSettingsModel = { keyField: 'activity_name' };
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
  empDataSource: Object[];
public updateStatus(args){
  let status_id;
  // let status=args.data[0]['status_name']
  let user_info= JSON.parse(localStorage.getItem('user_info'));
  if(args.data[0]['assigned_empid']){

  if(args.data[0]['assigned_empid']=='Anyone' || args.data[0]['assigned_empid']==user_info['id']){
    if(args.data[0]['status_name']){
      for(var i=0;i<this.taskStatusData.length;i++){
        if(this.taskStatusData[i].text==args.data[0]['status_name']){
          status_id=this.taskStatusData[i].id;
        }
          }

  let postData={
    "id": args.data[0]['task_id'],
    "status_id": status_id,
  }

     this.projectService.UpdateProjectStatusByID(postData).subscribe(

          (data:any) => {

      if(data.status=='200'){
        //this.GetAllTaskByProjectID();
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
    args.cancel = true;

  }
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
    //this.GetAllTaskByProjectID();

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
    public getAllEmp(){
      this.employee.fetchGridDataEmployeeByOrgID().subscribe(

        (data:any) => {

      var results=[]
      var employeeData=[{ id: '', text: 'Select' }]
          // let dataObj = JSON.parse(data['token']);
        //

    for (var i = 0; i < data.length; i++) {
    // logik to create new items

    results.push({
        "dataField": data[i].id,
        "text": data[i].full_name
    });
    employeeData.push({
      "id": data[i].id,
      "text": data[i].full_name
  });

    }
    results.push({
      "dataField":'Anyone',
      "text": 'Anyone'
  });
 let newItem={
    "dataField":'new',
    "text": 'Subtask',

  }
  let tasknewItem={
    "dataField":'task',
    "text": 'Task',

  }


   let results2 = [tasknewItem,newItem,...results];
  //let results2 = [newItem,taskItem, ...results];

    this.employeeData=employeeData;
    this.employeeList =results2;
 this.kanbanThreeColumns=this.employeeList;
//  this.kanbanOneColumns=tasknewItem;

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

       if(args.data[0]['assigned_empid']=='Anyone' || args.data[0]['assigned_empid']==user_info['id']){
       }else{
        this.toastr.error('Only Assignee is able to change the task status', undefined,{
          positionClass: 'toast-top-center'
     });
       }

}


    constructor(private projectService:ProjectService,private taskService:TaskService,private toastr:ToastrService,private spinner:NgxSpinnerService,private employee:EmployeeService,private quotationService:QuotationService, public histSer: HistoryService) {
      this.options={
        placeholder: { id: '', text: 'Select Milestone' },
        width:'100%'
      }
      this.empoptions={
        placeholder: { id: '', text: 'Select Employee' },
        width:'100%'
      }

    }

    public getString(assignee: string) {
        return assignee.match(/\b(\w)/g).join('').toUpperCase();
    }
    public goBack(){
      window.history.go(-1);
    }


    public changedActTask(e){
      this.activListValue=e.value;
      if(e.value!=''){
        this.FindByProjectActivityID(e.value)

      }
    }
    FindByProjectActivityID(id){
      let postData={
        id:id,
      }
      this.projectService.FindByProjectActivityID(postData).subscribe(

          (data:any) => {
           if(data.length!=0){


  this.reassigned_empid=data[0].emp_id
  this.empValue=data[0].emp_id

           }
           else{
  this.empValue=null;
  this.reassigned_empid=null;


           }
          }
        )
    }
    public changedEmployee(e){
      this.empValue=e.value;

    }
    changedProjEmployee(e){
      this.projempValue=e.value;

    }
    AssignMilest(){
      this.assgnMilestClick=true;
      if( this.activListValue!='' && this.empValue!=''){
        console.log('AssignMilestValid')
        let postData={
          id:this.activListValue,
          empid:this.empValue
        }
        this.projectService.AssignEmpployeeToMilestoneID(postData).subscribe(

            (data:any) => {
             if(data.status=="200"){
      this.assgnMilestClick=false;
               this.getAllTaskByActId(this.activListValue)
               this.milestoneTabValue=this.activListValue;
               this.selectedActivitityId=this.activListValue;
              this.toastr.success(data['desc'], undefined,{
                  positionClass: 'toast-top-center'
                })
                this.activListValue='';
                this.empValue='';

                let sendData = {
                  entity_id: localStorage.getItem('project_id'),
                  event_type: "Assign Milestone",
                  event_desc: "Successfully Assigned Milestone",
                };
                console.log(sendData)
                this.histSer.AddEntityHistoryLog(sendData).subscribe((data)=> {
                  console.log(data)
                });

             }else{
              this.toastr.error(data['desc'], undefined,{
                positionClass: 'toast-top-center'
              })
             }
            }
          )
      }
    }
    ReassignMilest(){
      this.assgnMilestClick=true;
      if( this.activListValue!='' && this.empValue!=''){
        console.log('AssignMilestValid')
        let postData={
          id:this.activListValue,
          empid:this.empValue
        }
        this.projectService.ReassignEmployeeToMilestoneID(postData).subscribe(

            (data:any) => {
             if(data.status=="200"){
      this.assgnMilestClick=false;
               this.getAllTaskByActId(this.activListValue)
               this.milestoneTabValue=this.activListValue;
               this.selectedActivitityId=this.activListValue;
              this.toastr.success(data['desc'], undefined,{
                  positionClass: 'toast-top-center'
                })
                this.activListValue='';
                this.empValue='';

                let sendData = {
                  entity_id: localStorage.getItem('project_id'),
                  event_type: "Reassign Milestone",
                  event_desc: "Successfully reassigned Milestone",
                };
                console.log(sendData)
                this.histSer.AddEntityHistoryLog(sendData).subscribe((data)=> {
                  console.log(data)
                });

             }else{
              this.toastr.error(data['desc'], undefined,{
                positionClass: 'toast-top-center'
              })
             }
            }
          )
      }
    }
    AssignProj(){
      this.assgnProjClick=true;
      if(this.projempValue!=''){
        let postData={
          id:localStorage.getItem('project_id'),
          empid:this.projempValue
        }
        this.projectService.AssignEmpployeeToProjectID(postData).subscribe(

          (data:any) => {
           if(data.status=="200"){
             this.GetProjectActivityByProjectID()
         this.projReAssgn=true;
            this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
              })
              this.projempValue='';
    this.assgnProjClick=false;

    let sendData = {
      entity_id: localStorage.getItem('project_id'),
      event_type: "Assign Project",
      event_desc: "Successfully Assigned Project",
    };
    this.histSer.AddEntityHistoryLog(sendData).subscribe((data)=> {
      console.log(data)
    });

           }else{
         this.projReAssgn=false;
            this.toastr.error(data['desc'], undefined,{
              positionClass: 'toast-top-center'
            })
           }
          }
        )

      }
    }
    ReassignProj(){
      this.assgnProjClick=true;
      if(this.projempValue!=''){
        this.spinner.show();
        let postData={
          id:localStorage.getItem('project_id'),
          empid:this.projempValue
        }
        this.projectService.ReassignEmpployeeTProjectID(postData).subscribe(

          (data:any) => {
           if(data.status=="200"){
             this.GetProjectActivityByProjectID()
        this.spinner.hide();

            this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
              })
              this.projempValue='';
    this.assgnProjClick=false;

    let sendData = {
      entity_id: localStorage.getItem('project_id'),
      event_type: "Reassign Project",
      event_desc: "Successfully reassigned Project",
    };
    this.histSer.AddEntityHistoryLog(sendData).subscribe((data)=> {
      console.log(data)
    });

           }else{
            this.toastr.error(data['desc'], undefined,{
              positionClass: 'toast-top-center'
            })
           }
          }
        )

      }
    }
  template: string =
  '<div class="jqx-kanban-item" id="">'
  + '<div class="jqx-kanban-item-color-status"></div>'
  + '<div style="display: none;" class="jqx-kanban-item-avatar"></div>'
  + '<div class="jqx-icon jqx-icon-close jqx-kanban-item-template-content jqx-kanban-template-icon"></div>'
  + '<div class="jqx-kanban-item-text"></div>'
  + '<div style="display: none;" class="jqx-kanban-item-footer"></div>'
  + '</div>';

    public resourcesAdapterFunc  () {
      let resourcesSource =
          {
              localData:
              [
                  { id: 0, name: 'No name',  common: true },
                  { id: 1, name: 'Andrew Fuller' },
                  { id: 2, name: 'Janet Leverling' },
                  { id: 3, name: 'Steven Buchanan' },
                  { id: 4, name: 'Nancy Davolio' },
                  { id: 5, name: 'Michael Buchanan' },
                  { id: 6, name: 'Margaret Buchanan' },
                  { id: 7, name: 'Robert Buchanan' },
                  { id: 8, name: 'Laura Buchanan' },
                  { id: 9, name: 'Laura Buchanan' }
              ],
              dataType: 'array',
              dataFields:
              [
                  { name: 'id', type: 'number' },
                  { name: 'name', type: 'string' },
                   { name: 'image', type: 'string' },
                  { name: 'common', type: 'boolean' }
              ]
          }
          let resourcesDataAdapter = new jqx.dataAdapter(resourcesSource);
          return resourcesDataAdapter;
        }
        // kanbanOneColumns: any[] =
        // [
        //     { text: 'Task', dataField: 'task', maxItems: 10 }
        // ];
        // kanbanOneColumnRenderer: any = (element: any, collapsedElement: any, column: any): void => {
        //     if (this.myKanbanOne && element[0]) {
        //         let headerStatus = element[0].getElementsByClassName('jqx-kanban-column-header-status')[0];
        //         let columnItems = this.myKanbanOne.getColumnItems(column.dataField).length;
        //         headerStatus.innerHTML = ' - '  + columnItems ;
        //     }
        // }
        kanbanTwoColumns: any[] =
        [
            { text: 'Ready', dataField: '3', maxItems: 10 }
        ];
        // kanbanTwoColumnRenderer: any = (element: any, collapsedElement: any, column: any): void => {
        //     if (this.myKanbanTwo && element[0]) {
        //         let headerStatus = element[0].getElementsByClassName('jqx-kanban-column-header-status')[0];
        //         let columnItems = this.myKanbanTwo.getColumnItems(column.dataField).length;
        //         headerStatus.innerHTML = ' (' + columnItems + '/' + column.maxItems + ')';
        //     }
        // }
        kanbanThreeColumns: any[] =
        [

        ];
        kanbanThreeColumnRenderer: any = (element: any, collapsedElement: any, column: any): void => {
             if (this.myKanbanThree && element[0]) {
                let columnItems = this.myKanbanThree.getColumnItems(column.dataField).length;
                let headerStatus = element[0].getElementsByClassName('jqx-kanban-column-header-status')[0];
               // headerStatus.innerHTML = ' (' + columnItems + '/' + column.maxItems + ')';
               headerStatus.innerHTML = ' - '  + columnItems ;


                let collapsedHeaderStatus = collapsedElement[0].getElementsByClassName('jqx-kanban-column-header-status')[0];
               // collapsedHeaderStatus.innerHTML = ' (' + columnItems + '/' + column.maxItems + ')';
            }
        }
        subTaskItemRenderer = (element: any, item: any, resource: any): void => {

if(this.myKanbanThree && element[0]) {
        //  element[0].getElementsByClassName('jqx-kanban-item-color-status')[0].innerHTML = '<span style="line-height: 23px; margin-left: 5px;">' + resource.name + '</span>';
          let taskText='';
           let itemStatus = element[0].getElementsByClassName('jqx-kanban-item-text')[0];


           let taskDesc=item.content.split(',')
           if(item.status!='task'){
            taskText='Task';
           }else{
            taskText='Milestone';

           }
          // element[0].getElementsByClassName('jqx-kanban-item-color-status')[0].innerHTML = '<div class="subTaskHeader" style="line-height: 23px; margin-left: 5px;">' + taskDesc[2] + '</div>';

          //  itemStatus.insertAdjacentHTML = ' <div> - ZX'  + columnText +  ' </div>' ;
           itemStatus.insertAdjacentHTML('beforeend', '<div class="task_name"> '+taskText+'-'+taskDesc[0]+'</div><div class="status_text">'+taskDesc[1]+'</div>');
        };
      }
      taskItemRenderer= (element: any, item: any, resource: any): void => {

        if(this.myKanbanThree && element[0]) {
                //  element[0].getElementsByClassName('jqx-kanban-item-color-status')[0].innerHTML = '<span style="line-height: 23px; margin-left: 5px;">' + resource.name + '</span>';
                  let columnText='saasaa';
                   let itemStatus = element[0].getElementsByClassName('jqx-kanban-item-text')[0];

        console.log('item.content',item.content);
        let taskDesc=item.content.split(',')
        console.log('item.content',taskDesc[0]);

                  //  itemStatus.insertAdjacentHTML = ' <div> - ZX'  + columnText +  ' </div>' ;
                   itemStatus.insertAdjacentHTML('beforeend', '<div class="task_name">Milestone - '+taskDesc[0]+'</div>');
                };
              }

        mainSplitterPanels: any[] = [{ size: 250, min: 100 }, { min: 250 }];
        rightSplitterPanels: any[] = [{ min: 200, size: 350, collapsible: false }, { min: 200 }];
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
      this.primaryContactEmail=data.email;
      this.primaryContactName=data.cst_name;
      this.primaryContactPhone=data.phone;
    this.GetProjectActivityRatioByProjectID();
    this.GetProjectActivityTaskRatioByProjectID();
this.selectedValue=data.project_name;
    this.projectName=data.project_name;
    this.project_start_date=data.start_date;
    this.project_end_date=data.end_date;
    this.project_desc=data.project_desc;
    this.projectPrefix=data.project_prefix;


    if(data.projectAttribute!=null){
      this.projectAttribute=data.projectAttribute;
    }
    if(data.is_assigned==true){
this.projReAssgn=true;
    }else{
      this.projReAssgn=false;

    }

    this.spinner.hide();
    if(data.entityCustomer!=null){


      this.cstName=data.entityCustomer.cst_name;

    }else{

      this.cstName='';


    }
    if(data.entityLocation!=null){
      if(data.entityLocation.lat!="" && data.entityLocation.lang!="" ){

        //  this.searchElementRef.nativeElement.value=data.entityLocation.formatted_address;
        this.nearbyAddress=data.entityLocation.formatted_address;



    }
  }


  for(var i=0;i<data.entityContact.length;i++){
    if(data.entityContact[i].is_primary==true){
      this.primaryContact=data.entityContact[i]
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
      taskchart.data=data;
      // let dataObj = JSON.parse(data['token']);
    //





    }
  )}

  GetProjectActivityByProjectID(){
    let postData={
      id:localStorage.getItem('project_id')
    }
    this.projectService.GetProjectActivityByProjectID(postData).subscribe(

      (data:any) => {
        this.projActivityCount=data.length;
        this.milestoneData=data;
        if(data.length!=0){
          this.milestoneTabValue=data[0].id;
          this.selectedActivitityId=data[0].id;
          this.getAllTaskByActId(data[0].id);
        }else{
          this.milestoneTabValue=''
        }
        // this.dataSource=data;

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

    public GetAllTaskByProjectID (){
      let postData={
        id:localStorage.getItem('project_id')
      }

      this.projectService.GetAllTaskForAssignByProjectID(postData).subscribe(

        (data:any) => {
          if(data!=null && data.length!=0){
          this.taskDataSource=data;
          let taskList=[]
          let milestList=[]
for(var i=0;i<this.taskDataSource.length;i++){
  let color='#5dc3f0'
  if(data[i].status_name=='Open'){
color='red';
  }else if(data[i].status_name=='Inprogress'){
    color='yellow';

  }else{
    color='green';
  }
    taskList.push({
      state: data[i].TaskTeamMember.length!=0?data[i].TaskTeamMember[0].empid:'new',
       label: data[i].task_name,
        hex: color,
        resourceId: data[i].task_id,
        common:data[i].status_name,
        statusName:data[i].task_name,
    })
    if( data[i].TaskTeamMember.length==0){
      milestList.push({
        label: data[i].task_name,
        id: data[i].task_id,
        activity_name:data[i].activity_name,
        priority_name:data[i].priority_name,
        due_date:data[i].due_date,

     })

    }


}

// this.milestList=milestList;
// this.taskList=milestList;
// this.dataAdapter=taskList;
// this.dataAdapter3=assignedEmpList;


let openTask: any =
{
    localData:
    taskList,
    dataType: 'array',
    dataFields: this.fields
};
let assignedEmpTask: any =
{
    localData:
    taskList,

};
// this.dataAdapter = new jqx.dataAdapter(sourceAb);
 //this.dataAdapter3 = new jqx.dataAdapter(openTask);
  this.myKanbanThree.source(new jqx.dataAdapter(openTask));

  this.kanbanThreeColumns=this.employeeList;


}else{
this.taskDataSource=[];
let openTask: any =
{
    localData:
    this.taskDataSource,
    dataType: 'array',
    dataFields: this.fields
};

// this.dataAdapter = new jqx.dataAdapter(sourceAb);
// this.dataAdapter3 = new jqx.dataAdapter(sourceCD);
  this.myKanbanThree.source(new jqx.dataAdapter(openTask));
}
        }
      )
        }
        getAllTaskByActId(id){
         this.selectedActivitityId = id;
       this.spinner.show();
          let postData={
            id:id
          }
          this.projectService.GetAllTaskByActivityID(postData).subscribe(

            (data:any) => {
              if(data!=null && data.length!=0){
               // this.taskDataSource=data;
            this.spinner.hide();
  this.taskList=data;
                let taskList=[]
                let milestList=[]
      for(var i=0;i<data.length;i++){
        let color='#5dc3f0'
        if(data[i].status_name=='Open'){
      color='red';
        }else if(data[i].status_name=='Inprogress'){
          color='yellow';

        }else{
          color='green';
        }
        let subtaskDesc=[]
        // subtaskDesc.push(data[i].task_name)
        //  subtaskDesc.push(data[i].task_name)
        //  subtaskDesc.push(data[i].task_name)
        //  subtaskDesc.push(data[i].task_name)

         subtaskDesc.push(data[i].activity_name)
          subtaskDesc.push(data[i].assignedto)
         subtaskDesc.push(data[i].priority_name)
         subtaskDesc.push(data[i].due_date)
          taskList.push({
             state: 'task',
            //state:'new',
           // state: data[i].TaskTeamMember.length!=0?data[i].TaskTeamMember[0].empid:'task'
             label: data[i].task_name,
              hex: color,
              resourceId: data[i].id,
              common:data[i].task_name,
              statusName:subtaskDesc,
          })


      }
      this.mainTaskList=taskList;
//  this.getAssigneeList('isd');

      // this.dataAdapter=taskList;
      // this.dataAdapter3=assignedEmpList;


      let openTask: any =
      {
          localData:
          taskList,
          dataType: 'array',
          dataFields: this.fields
      };
      let assignedEmpTask: any =
      {
          localData:
          taskList,

      };
      // this.dataAdapter = new jqx.dataAdapter(sourceAb);
      // this.dataAdapter3 = new jqx.dataAdapter(sourceCD);
      //  this.myKanbanOne.source(new jqx.dataAdapter(openTask));

        // this.myKanbanOne.source(new jqx.dataAdapter(openTask));
        //this.kanbanThreeColumns=this.employeeList;
        this.getAssigneeList(data[0].id)

       this.selectedTaskId=data[0].id;

      }else{
            this.spinner.hide();

      this.taskDataSource=[];
      let openTask: any =
      {
          localData:
          this.taskDataSource,
          dataType: 'array',
          dataFields: this.fields
      };
      this.myKanbanThree.source(new jqx.dataAdapter(openTask));

      // this.dataAdapter = new jqx.dataAdapter(sourceAb);
      // this.dataAdapter3 = new jqx.dataAdapter(sourceCD);
        //this.myKanbanOne.source(new jqx.dataAdapter(openTask));
      }
              if(data!=null && data.length!=0){
             this.taskList=data;


            //  for(var i=0;i<data.length;i++){
            //  }

    }
            }
          )
        }
        GetMainTaskByProjectID(){
          let postData={
            id:localStorage.getItem('project_id')
          }

          this.projectService.GetAllTaskByProjectID(postData).subscribe(

            (data:any) => {
              if(data!=null && data.length!=0){
               // this.taskDataSource=data;
            this.spinner.hide();
  this.taskList=data;
                let taskList=[]
                let milestList=[]
      for(var i=0;i<data.length;i++){
        let color='#5dc3f0'
        if(data[i].status_name=='Open'){
      color='red';
        }else if(data[i].status_name=='Inprogress'){
          color='yellow';

        }else{
          color='green';
        }
        let subtaskDesc=[]
        subtaskDesc.push(data[i].activity_name)
         subtaskDesc.push(data[i].task_name)
         subtaskDesc.push(data[i].priority_name)
         subtaskDesc.push(data[i].due_date)
          taskList.push({
             state: 'task',
            //state:'new',
           // state: data[i].TaskTeamMember.length!=0?data[i].TaskTeamMember[0].empid:'task'
             label: data[i].task_name,
              hex: color,
              resourceId: data[i].task_id,
              common:data[i].status_name,
              statusName:subtaskDesc,
          })


      }
      this.mainTaskList=taskList;
//  this.getAssigneeList('isd');

      // this.dataAdapter=taskList;
      // this.dataAdapter3=assignedEmpList;


      let openTask: any =
      {
          localData:
          taskList,
          dataType: 'array',
          dataFields: this.fields
      };
      let assignedEmpTask: any =
      {
          localData:
          taskList,

      };
      // this.dataAdapter = new jqx.dataAdapter(sourceAb);
      // this.dataAdapter3 = new jqx.dataAdapter(sourceCD);
      //  this.myKanbanOne.source(new jqx.dataAdapter(openTask));

        // this.myKanbanOne.source(new jqx.dataAdapter(openTask));
        //this.kanbanThreeColumns=this.employeeList;
        this.getAssigneeList(data[0].task_id)

       this.selectedTaskId=data[0].task_id;

      }else{
      this.taskDataSource=[];
      let openTask: any =
      {
          localData:
          this.taskDataSource,
          dataType: 'array',
          dataFields: this.fields
      };

      // this.dataAdapter = new jqx.dataAdapter(sourceAb);
      // this.dataAdapter3 = new jqx.dataAdapter(sourceCD);
        //this.myKanbanOne.source(new jqx.dataAdapter(openTask));
      }
              if(data!=null && data.length!=0){
             this.taskList=data;


            //  for(var i=0;i<data.length;i++){
            //  }

    }
            }
          )
            }
            getContactList(id) {
              // this.countryData = []
              // this.countryValue=''
            let entityId={
            entityID:localStorage.getItem('project_id'),
            cstID:localStorage.getItem('project_id')

            }

              return this.quotationService.GetAllEntityContactByEntityIDAndCstID(entityId).subscribe(
                (data: any) => {
                  // let dataObj = JSON.parse(data['token']);


                  var results = [{ id: '  ', text: 'Select' }]

                  // let dataObj = JSON.parse(data['token']);
                  //

                  for (var i = 0; i < data.length; i++) {
                    // logik to create new items

                    results.push({
                      "id": data[i].id,
                      "text": data[i].name
                    });


                  }


                  this.entityContactData = results;
                  // this.entityContactVal=id;
                  this.showBranchList=true;

                  this.branchDataSource=data;
                  for(var i=0;i<data.length;i++){
                    if(data[i]['is_primary']==true){
                      this.primaryContact=data[i]
                    }
                  }
                },
                error => {
                  Swal.fire(
                    'Error!',
                    'Error.',
                    'error'
                  ).then(
                    //used Arrow function here
                    (result) => {

                      //  this.router.navigate(['/dashboard']);
                    })


                }

              )
            }
        public getAssigneeList(id){
          this.selectedItem=id;
          this.spinner.show();
          let postData={"milestoneID":this.selectedActivitityId,"taskID":id}
          // let postData={
          //   id:localStorage.getItem('project_id')
          // }
          this.projectService.GetAllSubTaskByMilestoneID(postData).subscribe(

            (data:any) => {
              console.log('GetAllSubTaskByTaskID',data);
              this.spinner.hide();
              if(data!=null && data.length!=0){
              this.taskDataSource=data;
          this.spinner.hide();

              let taskList=[]
              let milestList=[]
    for(var i=0;i<this.taskDataSource.length;i++){
      let color='#5dc3f0'
      if(data[i].status_name=='Open'){
    color='red';
      }else if(data[i].status_name=='Inprogress'){
        color='yellow';

      }else{
        color='green';
      }
      let subtaskDesc=[]
      subtaskDesc.push(data[i].task_name)
       subtaskDesc.push(data[i].status_name)
       subtaskDesc.push(data[i].milestone_name)
       subtaskDesc.push(data[i].due_date)
      subtaskDesc.push(data[i].task_id)

        taskList.push({
           state: data[i].TaskTeamMember!=null && data[i].TaskTeamMember.length!=0?data[i].TaskTeamMember[0].empid:'new',
          //state:'new',
           label: data[i].sub_task_name,
            hex: color,
            resourceId: data[i].id,
            common:data[i].status_name,
            statusName:subtaskDesc,
        })


    }

    // this.dataAdapter=taskList;
    // this.dataAdapter3=assignedEmpList;


    let openTask: any =
    {
        localData:
        taskList.concat(this.mainTaskList),
        dataType: 'array',
        dataFields: this.fields
    };

    // console.log('openTask',openTask);
    let assignedEmpTask: any =
    {
        localData:
        taskList,

    };
    // this.dataAdapter = new jqx.dataAdapter(sourceAb);
    // this.dataAdapter3 = new jqx.dataAdapter(sourceCD);
      this.myKanbanThree.source(new jqx.dataAdapter(openTask));

      // this.myKanbanOne.source(new jqx.dataAdapter(openTask));
      //this.kanbanThreeColumns=this.employeeList;


    }else{
    this.taskDataSource=[];
    let openTask: any =
    {
        localData:
        this.taskDataSource,
        dataType: 'array',
        dataFields: this.fields
    };

    // this.dataAdapter = new jqx.dataAdapter(sourceAb);
    // this.dataAdapter3 = new jqx.dataAdapter(sourceCD);
      this.myKanbanThree.source(new jqx.dataAdapter(openTask));
  }
            }
          )
        }

        ItemAttrClicked(event: any): void
        {

           //event.stopPropagation();
            // Do Something
            // this.toastr.success('Task has been assigned successfully', undefined,{
            //   positionClass: 'toast-top-center'
            // })
            console.log('ItemClick',event.args.item.status)
            for(var i=0;i<this.taskList.length;i++){
            if(event.args.item.resourceId==this.taskList[i].task_id){
              this.selectedKanbanItem=true;

            }else{
              this.selectedKanbanItem=false;

            }


            }
            if(event.args.item.status=='task'){
              this.getAssigneeList(event.args.item.resourceId)
              this.selectedTaskId=event.args.item.resourceId;


            }
            // let postData={
            //   id:event.args.item.resourceId,
            //   empid:event.args.itemData.status
            // }
            // var args = event.args;
            // var itemId = args.itemId;
            // var oldParentId = args.oldParentId;
            // var newParentId = args.newParentId;
            // var itemData = args.itemData;
            // var oldColumn = args.oldColumn;
            // var newColumn = args.newColumn;


            // if(newColumn != null) {

            // }

            // setTimeout(function() {
            //   // var items = $('#kanban').jqxKanban('getColumnItems', newColumn.dataField);
            //   //

            // }, 100);

            // this.projectService.AssignEmpployeeToTask(postData).subscribe(

            //   (data:any) => {
            //    if(data){
            //     this.toastr.success('Task has been assigned successfully', undefined,{
            //         positionClass: 'toast-top-center'
            //       })
            //    }
            //   }
            // )
        }
public  ItemMoved(event: any): void
{

  event.stopPropagation();
    // Do Something
    // this.toastr.success('Task has been assigned successfully', undefined,{
    //   positionClass: 'toast-top-center'
    // })
    let postData={
      id:event.args.itemData.resourceId,
      empid:event.args.itemData.status
    }
    var args = event.args;
    var itemId = args.itemId;
    var oldParentId = args.oldParentId;
    var newParentId = args.newParentId;
    var itemData = args.itemData;
    var oldColumn = args.oldColumn;
    var newColumn = args.newColumn;


    if(newColumn != null) {

    }

    setTimeout(function() {
      // var items = $('#kanban').jqxKanban('getColumnItems', newColumn.dataField);
      //

    }, 100);

    // this.projectService.AssignEmpployeeToTask(postData).subscribe(

    //   (data:any) => {
    //    if(data){
    //     this.toastr.success('Task has been assigned successfully', undefined,{
    //         positionClass: 'toast-top-center'
    //       })
    //    }
    //   }
    // )
}
public AssignedItemMoved(event: any): void
{
  event.stopPropagation();

  var args = event.args;
  var itemId = args.itemId;
  var oldParentId = args.oldParentId;
  var newParentId = args.newParentId;
  var itemData = args.itemData;
  var oldColumn = args.oldColumn;
  var newColumn = args.newColumn;
 console.log('oldColumn',oldColumn,itemData);
 var output = itemData.content.split(/[, ]+/).pop();
 console.log('output',output);

  let postData={
    id:event.args.itemData.resourceId,
    empid:newColumn.dataField!='new'?newColumn.dataField:null
  }
console.log('newColumn',newColumn,event)


if(oldColumn.dataField=='task' && newColumn.dataField=='new' ){
  event.preventDefault();
  this.getAssigneeList(event.args.itemData.resourceId)
  this.toastr.error('Please select a valid column', undefined,{
    positionClass: 'toast-top-center'
  })

}else if(newColumn.dataField=='task'){
  event.preventDefault();
  this.getAssigneeList(this.selectedTaskId)
  this.toastr.error('Please select a valid column', undefined,{
    positionClass: 'toast-top-center'
  })
}
else if(oldColumn.dataField!='task' && oldColumn.dataField!='new' && newColumn.dataField=='new' && this.selectedTaskId!=output){
  event.preventDefault();
  this.getAssigneeList(this.selectedTaskId)
  this.toastr.error('Please select a valid subtask', undefined,{
    positionClass: 'toast-top-center'
  })
}else{
   event.preventDefault();
this.projectService.AssignEmpployeeToTask(postData).subscribe(

      (data:any) => {
       if(data){
        if(oldColumn.dataField=='task'){
          this.getAssigneeList(event.args.itemData.resourceId)
        }
        if(data.status=="200"){
          this.toastr.success(data['desc'], undefined,{
            positionClass: 'toast-top-center'
          })
        }else{
          this.toastr.error(data['desc'], undefined,{
            positionClass: 'toast-top-center'
          })
        }

       }

      let sendData = {
        entity_id: localStorage.getItem('project_id'),
        event_type: "Assign Task",
        event_desc: "Successfully Assigned task",
      };
      console.log(sendData)
      this.histSer.AddEntityHistoryLog(sendData).subscribe((data)=> {
        console.log(data)
      });
      }
    )

  if(newColumn != null) {

  }

  setTimeout(function() {


  }, 100);

  // this.toastr.success('Task has been assigned successfully', undefined,{
  //   positionClass: 'toast-top-center'
  // })
}

    // Do Something
}
public TaskMoved(event: any): void
{

  var args = event.args;

  var itemId = args.itemId;
  var oldParentId = args.oldParentId;
  var newParentId = args.newParentId;
  var itemData = args.itemData;
  var oldColumn = args.oldColumn;
  var newColumn = args.newColumn;

console.log('newColumn',newColumn,event)

    // this.projectService.AssignEmpployeeToTask(postData).subscribe(

    //   (data:any) => {
    //    if(data){
    //     this.toastr.success(data['desc'], undefined,{
    //         positionClass: 'toast-top-center'
    //       })
    //    }
    //   }
    // )
  // if(newColumn != null) {
  //
  // }
  //
  // setTimeout(function() {

  //
  // }, 100);

  // this.toastr.success('Task has been assigned successfully', undefined,{
  //   positionClass: 'toast-top-center'
  // })
    // Do Something
}
GetProjectMilestByProjectID(){
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

    }
  )
    }

  ngOnInit() {
this.getAllEmp();
 //this.GetAllTaskByProjectID();
//this.GetMainTaskByProjectID();
this.GetProjectMilestByProjectID();
this.empDataSource=this.data;
this.FindByProjectID();
this.ProjectPropertyByProjectID();
this.ProjectTaskCountByProjectID();
this.GetProjectActivityByProjectID();
this.getAllStatus();
this.GetPriorityByOrgID();
 this.getContactList('');
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
  }

}
