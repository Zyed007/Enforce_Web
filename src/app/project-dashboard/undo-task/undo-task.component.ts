import { Component, OnInit, ViewChild } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { ProjectService } from '../../services/project.service';
import  Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import * as _ from "lodash";
declare var $: any;
import { TimeSheetService } from '../../services/timesheet.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-undo-task',
  templateUrl: './undo-task.component.html',
  styleUrls: ['./undo-task.component.scss']
})
export class UndoTaskComponent implements OnInit {

  @ViewChild('employeeTaskGrid' , {static: false}) public employeeTaskGrid: GridComponent;
  public availableMilestoneData: Array<Select2OptionData>;
  public availableTaskData: Array<Select2OptionData>;
  public deptOptions:Select2Options;
  projectName = localStorage.getItem('ProjectName');
  projectID = localStorage.getItem('project_id');
  storedMilestoneID;
  subTaskGridData;
  previousTaskId

  checkAnyTaskThere = true;
  selectedTaskToUndo = [];

  public data: Object[];

  constructor(
    private projectService: ProjectService,
    private TimeSheetService: TimeSheetService,
    public spinner: NgxSpinnerService,
    private toastr:ToastrService

  ) {
    this.deptOptions={
      placeholder:"Select",
      width: "100%",
    }
   }

  public goBack(){
    window.history.go(-1);
  }

  ngOnInit() {
    this.fetchMilestActByProjectID()
  }

  public fetchMilestActByProjectID(){
    let project_id={
      "id": this.projectID
    }
    this.projectService.GetMilestoneByProjectID(project_id).subscribe((data:any) => {
      var actFilter=[{ id: '', text: 'Milestone' }]
      if(data){
        data.map((elm)=>{
          actFilter.push({
            id: elm.milestoneId,
            text: elm.milestoneName
          });
        });
      }
      this.availableMilestoneData = actFilter;
    },error  => {
        Swal.fire(
          'Error!',
          error,
          'error'
        )
    })
  }

  changedMilestone(e:{ value: ''}): void{
    if(e.value !== ""){
      this.storedMilestoneID = e.value
      this.getTaskByMilestoneID(e.value)
    }
  }

  //list task based on Milestone - projectID
  getTaskByMilestoneID(id){
    let sendData = {id}
    this.projectService.GetTaskByMilestoneID(sendData).subscribe((data: any)=>{
      //console.log(data)
      var results=[{ id: '', text: 'Select' , }]
      if(data){
        data.map((elm)=>{
          results.push({
            "id": elm.taskId,
            "text": elm.taskName
          });
        });
      }
      this.availableTaskData = results;
    },error  => {
      Swal.fire(
      'Error!',
      error,
      'error'
      )
    })
  }

  changedTask(e:{ value: ''}): void{
    if(e.value !== ""){
      this.getalltaskbyJob(e.value)
      this.previousTaskId = e.value;
    }
  }

  getalltaskbyJob(id){
    this.spinner.show();
    let postData={
      "projectID": localStorage.getItem('project_id'),
      "milestoneID": this.storedMilestoneID,
    }
    this.projectService.GetAllSubTaskByMilestone(postData).subscribe((data:any)  => {
      console.log('project List value', data)
      let selectedData = []
      data.map((elm) => {
        if(elm.TaskId === id && elm.EmployeeId !== null && elm.StatusName === 'Completed'){
          selectedData.push(elm)
        }
      })
      this.subTaskGridData = selectedData;
      this.spinner.hide();
    })
  }

  rowSelected(){
    this.selectedTaskToUndo = [];
    this.selectedTaskToUndo = this.employeeTaskGrid.getSelectedRecords();
    console.log(this.selectedTaskToUndo)
    if(this.selectedTaskToUndo.length === 0){
      this.checkAnyTaskThere = true
    }else{
      this.checkAnyTaskThere = false
    }
  }

  openConfirmationModel(){
    $('#confirmationModal').modal('show');
  }

  finalConv(){
    this.spinner.show();
    let finalSend = [];
    this.selectedTaskToUndo.map((elm) => {
      finalSend.push(elm.SubtaskId)
    })
    let postData = {
      "taskID": finalSend
    }
    console.log(postData)
    this.TimeSheetService.AdminReopenTasks(postData).subscribe((data: any) => {
      console.log(data);
      if(data.status === "200"){
        this.toastr.success(data.desc);
        this.getalltaskbyJob(this.previousTaskId)
      }else{
        this.toastr.error('Something went wrong');
      }
      this.closeConfirmationModel();
    });
  }

  closeConfirmationModel(){
    $('#confirmationModal').modal('hide');
    this.spinner.hide();
  }

}
