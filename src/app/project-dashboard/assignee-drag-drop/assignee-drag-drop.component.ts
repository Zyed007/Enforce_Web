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
import * as _ from "lodash";
import { jqxKanbanComponent } from 'jqwidgets-ng/jqxkanban';
import { EmployeeService } from '../../services/employee.service';
import { QuotationService } from '../../services/quotation.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HistoryService } from '../../services/history.service';

am4core.useTheme(am4themes_animated);
let chart;
let taskchart;

@Component({
  selector: 'app-assignee-drag-drop',
  templateUrl: './assignee-drag-drop.component.html',
  styleUrls: ['./assignee-drag-drop.component.scss'],
  encapsulation: ViewEncapsulation.None
})





export class AssigneeDragDropComponent implements OnInit {

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

  selectedEmployee;
  commonFields: Object = { text: "text", value: "id"};
  selectEmps: FormGroup;
  allTaskList : any[];
  existnEmpList : any[];

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
  projectReassignList: any=[];

  //ProjectReassign Validation Varaibles
  assignedTskList: any=[];
  assignedEmp: any=[];
  warningText = "";
  unassignedTskList: any=[];
  empFalse = false;



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





createNewEmpList() {
  

 // this.milestoneTabValue=data[0].milestoneId;
   //       this.selectedActivitityId=data[0].milestoneId;
     //     this.getAllTaskByActId(data[0].milestoneId);

console.log("this.kanbanThreeColumns.length-->",this.kanbanThreeColumns.length);
 let startTime = this.selectEmps.get('selEmp').value;
 if(startTime.length > 0) {


        if(startTime.length > (this.kanbanThreeColumns.length - 2)) {
          startTime.map((itm:any)=>{

            //if not part of the Knbn list then Add
            if(this.kanbanThreeColumns.filter((el:any)=> el.dataField === itm).length === 0) {
                var newSelc = this.employeeData.filter((elm:any) => elm.id === itm);  
                var addtoKnb =  {
                  "dataField":newSelc[0].id,
                  "text": newSelc[0].text
                }
               this.kanbanThreeColumns = [...this.kanbanThreeColumns, addtoKnb];
              }



          })
        } else {
           
            //Delete the ones which are not present
            this.kanbanThreeColumns.map((elm:any)=>{

              if(startTime.filter((el:any)=>  el === elm.dataField).length === 0) {
                console.log(elm);
                if(elm.dataField.length === 36) {
                    
                  this.kanbanThreeColumns = this.kanbanThreeColumns.filter((itm:any)=> itm.dataField != elm.dataField)
                  

                }
              }


            });

        }

       // let empCls = this.kanbanThreeColumns;

      //  localStorage.setItem("exstEmp", JSON.stringify(this.kanbanThreeColumns));
      //this.existnEmpList = [];
      this.existnEmpList =  this.kanbanThreeColumns;


     
    


  } else {
      //Give an Toast Error Here


      this.toastr.error('Please Select Employees', undefined,{
        positionClass: 'toast-top-center'
    });
  }




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

  // let dummynewItem={
  //   "dataField":'null',
  //   "text": 'Please Select Employee',
  // }

   //let results2 = [tasknewItem,newItem,...results];
   let results2 = [tasknewItem,newItem];
  
  
   //let results2 = [newItem,taskItem, ...results];

    this.employeeData=employeeData;
    this.employeeList =results2;
   // console.log("this.employeeList---> 1",this.employeeList)
    this.kanbanThreeColumns= this.employeeList;
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
      this.projectService.FindAssigneeByMilestoneId(postData).subscribe(

          (data:any) => {
           if(data.length!=0){


  this.reassigned_empid=data.employeeId
  this.empValue=data.employeeId

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

    closeSwAlrtBtn() {
      console.log('HERE');
      Swal.close();
    }


    AssignMilest(){



      this.assgnMilestClick=true;
      if( this.activListValue!='' && this.empValue!=''){
        console.log('AssignMilestValid');

        this.assignedTskList = this.allTaskList.filter((lm:any)=> lm.EmployeeId != null &&  lm.StatusId == "bddb1fb7-387c-482d-8623-1f8815a13d42" &&  lm.MilestoneId == this.activListValue);
        this.unassignedTskList = this.allTaskList.filter((lm:any)=> lm.EmployeeId == null  &&  lm.MilestoneId == this.activListValue);


        var selectedEmpName = this.employeeData.filter((fl)=> fl.id ===  this.empValue)[0].text; 

        if(this.assignedTskList.length > 0) {

          const unique = this.assignedTskList
          .map((item) => item.EmployeeName)
          .filter((value, index, self) => self.indexOf(value) === index);
           this.assignedEmp = unique;
           
          if(this.unassignedTskList.length == 0) {
            this.warningText = this.assignedTskList.length + " Tasks is already Assigned to  <b>" + this.assignedEmp.toString()  +
            "</b> Do you want to Re-Assign Tasks. <br/>  <span class='swlText'>   Click <b>Confirm</b> to Reassign all Tasks to  <b> " +   selectedEmpName + "</b>   </span>" ;
  
            Swal.fire({
              title: 'Are you sure ?',
              html:  this.warningText,
              showCloseButton: true,
              showCancelButton: true,
              focusConfirm: false,
              confirmButtonColor: '#e91e63',
              confirmButtonText:
                'Confirm',
              cancelButtonText:
                'Cancel',
            }).then((result) => {
              console.log(result);
              if(result.value === true) {
                this.assignAllMilCmFun();
              } else {
                console.log("Close the Modal");
              }
            
            });
  
          } 
          else {

         this.warningText = this.assignedTskList.length + " Tasks are already Assigned to <b> " + 
                        this.assignedEmp.toString()  + "</b> and " + this.unassignedTskList.length + 
                                " Tasks pending to be Assigned. <br/>  <span class='swlText'>    Click  <b> Assign </b> to Assign All tasks to <b>"
                                   + selectedEmpName + "</b> or <br/> Click  <b>Assign Pending</b> to Assign Un Assigned tasks to selected Individual <br/> </span> ";
                                  
            Swal.fire({
              title: 'Are you sure ?',
              html:  this.warningText,
              showCloseButton: true,
              showConfirmButton:true,
              showCancelButton: true,
              focusConfirm: false,
              confirmButtonColor: '#e91e63',
              confirmButtonText:
                'Assign',
              cancelButtonText:
                'Assign Pending',
                footer: "<button  type='button' id='mdlClose'   class='modalClsBtn'>Cancel</button>"
            }).then((result) => {
                  console.log(result) 
                 if(result.value === true) {
                  this.assignAllMilCmFun();
                } else {
                  this.assignunAssignMilTasks();
                }
            });
            

          document.getElementById('mdlClose').onclick = () => {
            Swal.close();
          }

          }
        } else {

            
        let postData={
          milestoneId:this.activListValue,
          empid:this.empValue,
          projectId:localStorage.getItem('project_id')
        }

        //employeeData
       var selectedEmp =   this.employeeData.filter(el => el.id === this.empValue);
         var addtoKnb = 
        {
          "dataField":selectedEmp[0].id,
          "text": selectedEmp[0].text
        }
       
         this.kanbanThreeColumns.push(addtoKnb);


        this.projectService.AssignEmployeeTaskByMilestoneID(postData).subscribe(

            (data:any) => {
             if(data.status=="200"){
              this.assgnMilestClick=false;
               this.getAllTaskByActId(this.activListValue)
               this.milestoneTabValue=this.activListValue;
               this.selectedActivitityId=this.activListValue;
              this.toastr.success(data['desc'], undefined,{
                  positionClass: 'toast-top-center'
                })
                this.GetAllTasksByProjectID();
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
    }

   


    assignAllMilCmFun() {

      let postData={
        milestoneId:this.activListValue,
        empid:this.empValue,
        projectId:localStorage.getItem('project_id')
      }

      //employeeData
     var selectedEmp =   this.employeeData.filter(el => el.id === this.empValue);
       var addtoKnb = 
      {
        "dataField":selectedEmp[0].id,
        "text": selectedEmp[0].text
      }
     
       this.kanbanThreeColumns.push(addtoKnb);


      this.projectService.AssignEmployeeTaskByMilestoneID(postData).subscribe(

          (data:any) => {
           if(data.status=="200"){
            this.assgnMilestClick=false;
             this.getAllTaskByActId(this.activListValue)
             this.milestoneTabValue=this.activListValue;
             this.selectedActivitityId=this.activListValue;
            this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
              })
              this.GetAllTasksByProjectID();
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



    assignunAssignMilTasks() {

      let postData={
        milestoneId:this.activListValue,
        empid:this.empValue,
        projectId:localStorage.getItem('project_id')
      }

      //employeeData
     var selectedEmp =   this.employeeData.filter(el => el.id === this.empValue);
       var addtoKnb = 
      {
        "dataField":selectedEmp[0].id,
        "text": selectedEmp[0].text
      }
     
       this.kanbanThreeColumns.push(addtoKnb);


      this.projectService.ReunAssignEmployeeTaskByMilestoneID(postData).subscribe(

          (data:any) => {
           if(data.status=="200"){
            this.assgnMilestClick=false;
             this.getAllTaskByActId(this.activListValue)
             this.milestoneTabValue=this.activListValue;
             this.selectedActivitityId=this.activListValue;
            this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
              })
              this.GetAllTasksByProjectID();
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
    ReassignMilest(){
      this.assgnMilestClick=true;
      if( this.activListValue!='' && this.empValue!=''){
        console.log('AssignMilestValid')
        //this.assignunAssignMilTasks();

        this.assignedTskList = this.allTaskList.filter((lm:any)=> lm.EmployeeId != null &&  lm.StatusId == "bddb1fb7-387c-482d-8623-1f8815a13d42" &&  lm.MilestoneId == this.activListValue);
        this.unassignedTskList = this.allTaskList.filter((lm:any)=> lm.EmployeeId == null  &&  lm.MilestoneId == this.activListValue);

        if(this.assignedTskList.length > 0) {
          //If a Milestone is Already Assigned to Someone
          const unique = this.assignedTskList
          .map((item) => item.EmployeeName)
          .filter((value, index, self) => self.indexOf(value) === index);
           this.assignedEmp = unique;
          
          
         
         var selectedEmpName = this.employeeData.filter((fl)=> fl.id ===  this.empValue)[0].text; 
        
          if(this.unassignedTskList.length == 0) {
            this.warningText = this.assignedTskList.length + " Tasks is already Assigned to  <b>" + this.assignedEmp.toString()  +
                   "</b> Do you want to Re-Assign Tasks. <br/>  <span class='swlText'>   Click <b>Confirm</b> to Reassign all Tasks to  <b> " +   selectedEmpName + "</b>   </span>" ;
           
           
            Swal.fire({
              title: 'Are you sure ?',
              html:  this.warningText,
              showCloseButton: true,
              showCancelButton: true,
              focusConfirm: false,
              confirmButtonColor: '#e91e63',
              confirmButtonText:
                ' Confirm',
              cancelButtonText:
                'Cancel',
            }).then((result) => {
              console.log(result) 
              if(result.value === true) {

                var selectedEmp =   this.employeeData.filter(el => el.id === this.empValue);
                var addtoKnb = 
               {
                 "dataField":selectedEmp[0].id,
                 "text": selectedEmp[0].text
              }
               this.kanbanThreeColumns.push(addtoKnb);
       
           
               let postData={
                 milestoneId:this.activListValue,
                 empid:this.empValue,
                 projectId:localStorage.getItem('project_id')
               }
               this.projectService.ReAssignEmployeeTaskByMilestoneID(postData).subscribe(
       
                   (data:any) => {
                    if(data.status=="200"){
             this.assgnMilestClick=false;
                      this.getAllTaskByActId(this.activListValue);
                      this.GetAllTasksByProjectID();
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
       
       




              } else {

                console.log("JUST CLOSE THE MODAL");

              }
            });
          } else {
            this.warningText = this.assignedTskList.length + " Tasks are already Assigned to <b> " + 
            this.assignedEmp.toString()  + "</b> and " + this.unassignedTskList.length + 
                    " Tasks pending to be Assigned. <br/> <span class='swlText'>    Click  <b> Assign </b> to Assign All tasks to <b>"
                       + selectedEmpName + "</b> or <br/ >Click  <b>Assign Pending</b> to Assign Un Assigned tasks to selected Individual </span>";
                       
            Swal.fire({
              title: 'Are you sure ?',
              html:  this.warningText,
              showCloseButton: true,
              showConfirmButton:true,
              showCancelButton: true,
              focusConfirm: false,
              confirmButtonColor: '#e91e63',
              confirmButtonText:
                'Assign',
              cancelButtonText:
                'Assign Pending',
                footer: "<button  type='button' id='mdlClose'   class='modalClsBtn'>Cancel</button>"
            }).then((result) => {
                 if(result.value === true) {

                  var selectedEmp =   this.employeeData.filter(el => el.id === this.empValue);
                  var addtoKnb = 
                 {
                   "dataField":selectedEmp[0].id,
                   "text": selectedEmp[0].text
                }
                 this.kanbanThreeColumns.push(addtoKnb);
         
             
                 let postData={
                   milestoneId:this.activListValue,
                   empid:this.empValue,
                   projectId:localStorage.getItem('project_id')
                 }
                 this.projectService.ReAssignEmployeeTaskByMilestoneID(postData).subscribe(
         
                     (data:any) => {
                      if(data.status=="200"){
               this.assgnMilestClick=false;
                        this.getAllTaskByActId(this.activListValue);
                        this.GetAllTasksByProjectID();
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
         
         




                  } else {

                    this.assignunAssignMilTasks();
                  }
                  document.getElementById('mdlClose').onclick = () => {
                    Swal.close();
                  }
            });
          }


          

        } 
        else {

        //employeeData
       var selectedEmp =   this.employeeData.filter(el => el.id === this.empValue);
         var addtoKnb = 
        {
          "dataField":selectedEmp[0].id,
          "text": selectedEmp[0].text
       }
        this.kanbanThreeColumns.push(addtoKnb);

    
        let postData={
          milestoneId:this.activListValue,
          empid:this.empValue,
          projectId:localStorage.getItem('project_id')
        }
        this.projectService.ReAssignEmployeeTaskByMilestoneID(postData).subscribe(

            (data:any) => {
             if(data.status=="200"){
      this.assgnMilestClick=false;
               this.getAllTaskByActId(this.activListValue);
               this.GetAllTasksByProjectID();
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
    }






    AssignProj(){
      this.assignedTskList = this.allTaskList.filter((lm:any)=> lm.EmployeeId != null &&  lm.StatusId == "bddb1fb7-387c-482d-8623-1f8815a13d42");
      this.unassignedTskList = this.allTaskList.filter((lm:any)=> lm.EmployeeId == null);
      

      if(this.assignedTskList.length > 0 ) {

        const unique = this.assignedTskList
        .map((item) => item.EmployeeName)
        .filter((value, index, self) => self.indexOf(value) === index);
         this.assignedEmp = unique;

        var selectedEmpName = this.employeeData.filter((fl)=> fl.id ===  this.empValue)[0].text; 

        if(this.unassignedTskList.length == 0) {
          this.warningText = this.assignedTskList.length + " Tasks is already Assigned to  <b>" + this.assignedEmp.toString()  +
          "</b> Do you want to Re-Assign Tasks. <br/> Click <b>Confirm</b> to Reassign all Tasks to  <b> " +   selectedEmpName + "</b>  " ;

          Swal.fire({
            title: 'Are you sure ?',
            html:  this.warningText,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonColor: '#e91e63',
            confirmButtonText:
              ' Confirm',
            cancelButtonText:
              'Cancel',
          }).then((result) => {
            console.log(result)
            if(result.value == true) {
              this.assignEntireProjTasks();
            } else {
                console.log("JUST CLOSE THE CONFIRMATION MODAL");
            }
          });
        } 
        else 
        {
          this.warningText = this.assignedTskList.length + " Tasks are already Assigned to <b> " + 
          this.assignedEmp.toString()  + "</b> and " + this.unassignedTskList.length + 
                  " Tasks pending to be Assigned. <br/>   <span class='swlText'>  Click  <b> Assign </b> to Assign All tasks to <b>"
                     + selectedEmpName + "</b> or <br/>Click  <b>Assign Pending</b> to Assign Un Assigned tasks to selected Individual </span>";
                   
          Swal.fire({
            title: 'Are you sure ?',
            html:  this.warningText,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonColor: '#e91e63',
            confirmButtonText:
            'Assign',
          cancelButtonText:
            'Assign Pending',
            footer: "<button  type='button' id='mdlClose'   class='modalClsBtn'>Cancel</button>"
          }).then((result) => {
            console.log(result) 
            if(result.value == true) {
              this.assignEntireProjTasks();
            } else {
              this.assignEntireUnProjTasks();
            }
          });
          document.getElementById('mdlClose').onclick = () => {
            Swal.close();
          }
        }
      } else {
        this.assgnProjClick=true;
        if(this.projempValue!=''){
          let postData={
            id:localStorage.getItem('project_id'),
            empid:this.projempValue
          }
  
          var selectedEmp =   this.employeeData.filter(el => el.id === this.projempValue);
          var addtoKnb = 
           {
             "dataField":selectedEmp[0].id,
             "text": selectedEmp[0].text
            }
          
         this.kanbanThreeColumns.push(addtoKnb);
  
  
          this.projectService.AssignEmployeeTaskByProjectID(postData).subscribe(
  
            (data:any) => {
             if(data.status=="200"){
               this.GetProjectActivityByProjectID();

               this.GetAllTasksByProjectID();

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

     
    }

    assignEntireProjTasks() {
      this.assgnProjClick=true;
      if(this.projempValue!=''){
        let postData={
          id:localStorage.getItem('project_id'),
          empid:this.projempValue
        }

        var selectedEmp =   this.employeeData.filter(el => el.id === this.projempValue);
        var addtoKnb = 
         {
           "dataField":selectedEmp[0].id,
           "text": selectedEmp[0].text
          }
        
       this.kanbanThreeColumns.push(addtoKnb);


        this.projectService.AssignEmployeeTaskByProjectID(postData).subscribe(

          (data:any) => {
           if(data.status=="200"){
             this.GetProjectActivityByProjectID();

             this.GetAllTasksByProjectID();

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

    assignEntireUnProjTasks() {
      this.assgnProjClick=true;
      if(this.projempValue!=''){
        let postData={
          id:localStorage.getItem('project_id'),
          empid:this.projempValue
        }

        var selectedEmp =   this.employeeData.filter(el => el.id === this.projempValue);
        var addtoKnb = 
         {
           "dataField":selectedEmp[0].id,
           "text": selectedEmp[0].text
          }
        
       this.kanbanThreeColumns.push(addtoKnb);


        this.projectService.ReUnAssignEmployeeTaskByProjectID(postData).subscribe(

          (data:any) => {
           if(data.status=="200"){
             this.GetProjectActivityByProjectID();

             this.GetAllTasksByProjectID();

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
      this.assignedTskList = this.allTaskList.filter((lm:any)=> lm.EmployeeId != null &&  lm.StatusId == "bddb1fb7-387c-482d-8623-1f8815a13d42" );
      this.unassignedTskList = this.allTaskList.filter((lm:any)=> lm.EmployeeId == null);
     //Check if Already Employees have Task Assigned to them
      //If yes Ask confirm Reassignment
      if(this.assignedTskList.length > 0 ) {
        const unique = this.assignedTskList
        .map((item) => item.EmployeeName)
        .filter((value, index, self) => self.indexOf(value) === index);
         this.assignedEmp = unique;
        var selectedEmpName = this.employeeData.filter((fl)=> fl.id ===  this.empValue)[0].text; 

        //Display Modal
        if(this.unassignedTskList.length == 0) {
          this.warningText = this.assignedTskList.length + " Tasks is already Assigned to  <b>" + this.assignedEmp.toString()  +
          "</b> Do you want to Re-Assign Tasks. <br/>  <span class='swlText'>   Click <b>Confirm</b> to Reassign all Tasks to  <b> " +   selectedEmpName + "</b>   </span>" ;
          Swal.fire({
            title: 'Are you sure ?',
            html:  this.warningText,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonColor: '#e91e63',
            confirmButtonText:
              ' Confirm',
            cancelButtonText:
              'Cancel',
          }).then((result) => {

            if(result.value === true){
              //Assign all
              if(this.projempValue!=''){
                this.spinner.show();
                let postData={
                  id:localStorage.getItem('project_id'),
                  empid:this.projempValue
                }

        
          //employeeData
            var selectedEmp =   this.employeeData.filter(el => el.id === this.projempValue);
            var addtoKnb = 
              {
                "dataField":selectedEmp[0].id,
                "text": selectedEmp[0].text
              }
            
            this.kanbanThreeColumns.push(addtoKnb);



          this.projectService.ReAssignEmployeeTaskByProjectID(postData).subscribe(

            (data:any) => {
            if(data.status=="200"){
              this.GetProjectActivityByProjectID()
              this.GetAllTasksByProjectID(); 
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

            } else {
            
            console.log("Cancel button Clicked");
            }

          });
        } else {
          this.warningText = this.assignedTskList.length + " Tasks are already Assigned to <b> " + 
          this.assignedEmp.toString()  + "</b> and " + this.unassignedTskList.length + 
                  " Tasks pending to be Assigned. <br/>  <span class='swlText'>   Click  <b> Assign </b> to Assign All tasks to <b>"
                     + selectedEmpName + "</b> or <br/> Click  <b>Assign Pending</b> to Assign Un Assigned tasks to selected Individual </span>  ";
                   

          Swal.fire({
            title: 'Are you sure ?',
            html:  this.warningText,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonColor: '#e91e63',
            confirmButtonText:
            'Assign',
          cancelButtonText:
            'Assign Pending',
            footer: "<button  type='button' id='mdlClose'   class='modalClsBtn'>Cancel</button>",
          }).then((result) => {
            console.log(result) 


            if(result.value === true){

              //Assign all
              if(this.projempValue!=''){
                this.spinner.show();
                let postData={
                  id:localStorage.getItem('project_id'),
                  empid:this.projempValue
                }

        
          //employeeData
            var selectedEmp =   this.employeeData.filter(el => el.id === this.projempValue);
            var addtoKnb = 
              {
                "dataField":selectedEmp[0].id,
                "text": selectedEmp[0].text
              }
            
            this.kanbanThreeColumns.push(addtoKnb);



          this.projectService.ReAssignEmployeeTaskByProjectID(postData).subscribe(

            (data:any) => {
            if(data.status=="200"){
              this.GetProjectActivityByProjectID()
              this.GetAllTasksByProjectID(); 
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

            } else {
                console.log("Call the Unassigned API");
                this.assignEntireUnProjTasks();
            }
            
          });

          document.getElementById('mdlClose').onclick = () => {
            Swal.close();
          }
        }
      } else {


        // else Directly Assign keep it as is

             if(this.projempValue!=''){
                    this.spinner.show();
                    let postData={
                      id:localStorage.getItem('project_id'),
                      empid:this.projempValue
                    }

            
              //employeeData
                var selectedEmp =   this.employeeData.filter(el => el.id === this.projempValue);
                var addtoKnb = 
                  {
                    "dataField":selectedEmp[0].id,
                    "text": selectedEmp[0].text
                  }
                
                this.kanbanThreeColumns.push(addtoKnb);



              this.projectService.ReAssignEmployeeTaskByProjectID(postData).subscribe(

                (data:any) => {
                if(data.status=="200"){
                  this.GetProjectActivityByProjectID()
                  this.GetAllTasksByProjectID(); 
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

this.selectedValue=data.project_name;
    this.projectName=data.project_name;
    this.project_start_date=data.start_date;
    this.project_end_date=data.end_date;
    this.project_desc=data.project_desc;
    this.projectPrefix=data.project_prefix;


    if(data.projectAttribute!=null){
      this.projectAttribute=data.projectAttribute;
    }
//     if(data.is_assigned==true){
// this.projReAssgn=true;
//     }else{
//       this.projReAssgn=false;

//     }

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


  GetProjectActivityByProjectID(){
    let postData={
      id:localStorage.getItem('project_id')
    }
    this.projectService.GetAllMilestoneByProjectID(postData).subscribe(

      (data:any) => {
        this.projActivityCount=data.length;
        this.milestoneData=data;
        if(data.length!=0){
          this.milestoneTabValue=data[0].milestoneId;
          this.selectedActivitityId=data[0].milestoneId;
          this.getAllTaskByActId(data[0].milestoneId);
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

  console.log("this.employeeList---> 2",this.employeeList);

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
          this.existnEmpList = [];
         this.selectedActivitityId = id;
       this.spinner.show();
          let postData={
            'milestoneID':id,
            "projectID":localStorage.getItem('project_id')
          }
          this.projectService.GetAllTaskByMilestoneID(postData).subscribe(

            (data:any) => {
              if(data!=null && data.length!=0){
               // this.taskDataSource=data;
            this.spinner.hide();
  this.taskList=data;
                let taskList=[]
                let milestList=[]
      for(var i=0;i<data.length;i++){
        let color='#5dc3f0'
        if(data[i].StatusName=='Open'){
      color='red';
        }else if(data[i].StatusName=='Inprogress'){
          color='yellow';

        }else{
          color='green';
        }
        let subtaskDesc=[]
        // subtaskDesc.push(data[i].task_name)
        //  subtaskDesc.push(data[i].task_name)
        //  subtaskDesc.push(data[i].task_name)
        //  subtaskDesc.push(data[i].task_name)

         subtaskDesc.push(data[i].MilestoneName)
          subtaskDesc.push(data[i].StatusName)
          subtaskDesc.push(data[i].MilestoneName)//priority
          subtaskDesc.push(data[i].MilestoneName)//duedate
          taskList.push({
             state: 'task',
            //state:'new',
           // state: data[i].TaskTeamMember.length!=0?data[i].TaskTeamMember[0].empid:'task'
             label: data[i].TaskName,
              hex: color,
              resourceId: data[i].TaskId,
              common:data[i].TaskName,
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
        this.getAssigneeList(data[0].TaskId)

       this.selectedTaskId=data[0].TaskId;

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
          let postData={"milestoneID":this.selectedActivitityId,"taskID":id,"projectID":localStorage.getItem('project_id')}
          // let postData={
          //   id:localStorage.getItem('project_id')
          // }
          this.projectService.GetAllSubTaskByMilestone(postData).subscribe(

            (data:any) => {
              console.log('GetAllSubTaskByTaskID',data);
              this.spinner.hide();
              if(data!=null && data.length!=0){
              this.taskDataSource=data;
              this.spinner.hide();
              

              //console.log( 'BEFORE FILTER this.taskDataSource.length',this.taskDataSource.length);

              var empList = this.taskDataSource.filter((el:any)=> el.EmployeeId != null);
              

              //this.existnEmpList = [];
             
              
              this.kanbanThreeColumns = [this.kanbanThreeColumns[0],this.kanbanThreeColumns[1]]  
            
             
              console.log(this.kanbanThreeColumns);
            
              if(empList.length > 0) {
                var resArr = [];
                var frmVal = [];
                empList.filter(function(item:any){
                  var i = resArr.findIndex(x => (x.EmployeeId == item.EmployeeId));
                  if(i <= -1){
                        resArr.push(item);
                  }
                  return null;
                });
                if(resArr.length > 0) {
                  resArr.map((elm:any)=>{
                    // kanbanThreeColumns Filter and Check if already present if not then add
                    var checkAlreadyExist = this.kanbanThreeColumns.filter(el => el.dataField === elm.EmployeeId);
                    if(checkAlreadyExist.length === 0) {
                                var addtoKnb =  {
                                  "dataField":elm.EmployeeId,
                                  "text": elm.EmployeeName
                                }
                                frmVal.push(elm.EmployeeId);
                           this.kanbanThreeColumns.push(addtoKnb);
                    }
                    //console.log(existEmpList);



                    this.selectEmps.patchValue({
                      selEmp: frmVal
                    });
                  })   

                  console.log('existEmpList',this.existnEmpList,this.kanbanThreeColumns);
                 // this.createNewEmpList();
                  if(this.existnEmpList != undefined) {

                      this.existnEmpList.map((itm:any)=>{
                    var checkAlreadyExist = this.kanbanThreeColumns.filter(el => el.dataField === itm.dataField);
                    if(checkAlreadyExist.length === 0) {
                                var addtoKnb =  {
                                  "dataField":itm.dataField,
                                  "text": itm.text
                                }
                                
                               frmVal.push(itm.dataField);
                           this.kanbanThreeColumns.push(addtoKnb);
                    }
                      //console.log(frmVal);
                    this.selectEmps.patchValue({
                      selEmp: frmVal
                    });
                  })
                  }
                
                  
                  

                } 
              }  else {
                //if there are no employeesAdded
                this.selectEmps.reset();
              }
              
              
        
    
            //  console.log( 'After FILTER this.taskDataSource.length',this.taskDataSource.length);
             





              let taskList=[]
              let milestList=[]
    for(var i=0;i<this.taskDataSource.length;i++){
      let color='#5dc3f0'
      if(data[i].StatusName=='Open'){
    color='red';
      }else if(data[i].StatusName=='Inprogress'){
        color='yellow';

      }else{
        color='green';
      }
      let subtaskDesc=[]
      subtaskDesc.push(data[i].TaskName)
       subtaskDesc.push(data[i].StatusName)
       subtaskDesc.push(data[i].MilestoneName)
       subtaskDesc.push(data[i].MilestoneName)//due_date
      subtaskDesc.push(data[i].TaskId)
       // if(data[i].EmployeeId)


        taskList.push({
           state: (data[i].EmployeeId!=null && data[i].EmployeeId!='' && data[i].EmployeeId!='NULL')?data[i].EmployeeId:'new',
          //state:'new',
           label: data[i].SubtaskName,
            hex: color,
            resourceId: data[i].SubtaskId,
            common:data[i].StatusName,
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
              //this.getAssigneeList(event.args.item.resourceId)
              this.GetAllSubTaskListByTaskId(event.args.item.resourceId);
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

public GetAllSubTaskListByTaskId(id){
  console.log(id)
  this.selectedItem=id;
  this.spinner.show();
  let postData={"id":id}
    this.projectService.GetAllSubTaskListByTaskId(postData).subscribe((data:any) => {
      console.log('GetAllSubTaskByTaskID',data);
      this.spinner.hide();
      if(data!=null && data.length!=0){
        this.taskDataSource=data;
        this.spinner.hide();
        let taskList=[]
        let milestList=[]
          for(var i=0;i<this.taskDataSource.length;i++){
            let color='#5dc3f0'
              if(data[i].statusName=='Open'){
                color='red';
              }else if(data[i].statusName=='Inprogress'){
                color='yellow';
              }else{
                color='green';
              }
            let subtaskDesc=[]
            subtaskDesc.push(data[i].taskName)
            subtaskDesc.push(data[i].statusName)
            subtaskDesc.push(data[i].milestoneName)
            subtaskDesc.push(data[i].milestoneName)//due_date
            subtaskDesc.push(data[i].taskId)
            taskList.push({
              state: (data[i].employeeId!=null && data[i].employeeId!='' && data[i].employeeId!='NULL')?data[i].employeeId:'new',
              label: data[i].subtaskName,
              hex: color,
              resourceId: data[i].subtaskId,
              common:data[i].statusName,
              statusName:subtaskDesc,
            })
          }
          let openTask: any = {
            localData:
            taskList.concat(this.mainTaskList),
            dataType: 'array',
            dataFields: this.fields
          };

          let assignedEmpTask: any = {
            localData:
            taskList,
          };

          this.myKanbanThree.source(new jqx.dataAdapter(openTask));
      }else{
        this.taskDataSource=[];
        let openTask: any = {
          localData:
          this.taskDataSource,
          dataType: 'array',
          dataFields: this.fields
        };
      this.myKanbanThree.source(new jqx.dataAdapter(openTask));
    }
  });
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
this.projectService.AssignEmployeeToTaskSubTask(postData).subscribe(

      (data:any) => {
       if(data){
        if(oldColumn.dataField=='task'){
          this.getAssigneeList(event.args.itemData.resourceId)
        }
        if(data.status=="200"){  
          this.toastr.success(data['desc'], undefined,{
            positionClass: 'toast-top-center'
          })
          this.getAssigneeList(this.selectedTaskId);
         
         //console.log( "Employees in the Kanban--->", localStorage.getItem('exstEmp') );
        // let lcexstEmp =  JSON.parse(localStorage.getItem('exstEmp'));
         //console.log(lcexstEmp.length,lcexstEmp);
        // console.log(this.kanbanThreeColumns);
         //this.createNewEmpList();





        }else{
          this.getAssigneeList(this.selectedTaskId)
          this.toastr.error(data['desc'], undefined,{
            positionClass: 'toast-top-center'
          })
        }
        this.GetAllTasksByProjectID();
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
  this.projectService.GetAllMilestoneByProjectID(postData).subscribe(

    (data:any) => {
      this.projActivityCount=data.length;
      // this.dataSource=data;
      var results=[{ id: '', text: 'Select' }]

      // let dataObj = JSON.parse(data['token']);
    //

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
    "id": data[i].milestoneId,
    "text": data[i].milestoneName
});

}


this.activList =results;

    }
  )
    }

    // GetProjectAssigneeReassigneeList(){
    //   let postData={
    //     project_id:localStorage.getItem('project_id'),
    //     estimation_id:null
    //   }
    //   this.projectService.GetProjectAssigneeReassigneeList(postData).subscribe(

    //     (data:any) => {
    //    //   this.projActivityCount=data.length;
    //    this.projectReassignList=data;
    //    console.log('GetProjectAssigneeReassigneeList',data);

    //     }
    //   )
    //     }
    FindAssigneeByProjectID(){
      let postData={
        id:localStorage.getItem('project_id')
      }
      this.projectService.FindAssigneeByProjectID(postData).subscribe(

        (data:any) => {
      this.projReAssgn=data;

        }
      )
        }

  
        public GetAllTasksByProjectID(){
          let postData={
             id:localStorage.getItem('project_id')
          }
          this.projectService.GetAllProjectTaskListByProjectID(postData).subscribe(
            (data:any) => {
              console.log('data-->',data);
              this.allTaskList = data;
      
            }
          )
        }


 expndEmpList(e) {
    this.empFalse = ! this.empFalse;
    console.log(this.empFalse);
  }


  ngOnInit() {
this.getAllEmp();
 //this.GetAllTaskByProjectID();
this.GetProjectMilestByProjectID();
this.empDataSource=this.data;
this.FindByProjectID();
this.FindAssigneeByProjectID();
this.ProjectPropertyByProjectID();
this.ProjectTaskCountByProjectID();
this.GetProjectActivityByProjectID();
this.getAllStatus();
this.GetAllTasksByProjectID();
this.GetPriorityByOrgID();
//this.GetProjectAssigneeReassigneeList();
 this.getContactList('');

 this.selectEmps = new FormGroup({
  selEmp: new FormControl(''),
});



  }

}
