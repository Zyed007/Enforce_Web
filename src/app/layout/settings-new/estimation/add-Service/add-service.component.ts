import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { settingsService } from '../../../../services/settings.service';
import { costEstimationService } from '../../../../services/costEstimation.service';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import moment = require('moment');
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as _ from "lodash";
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
//js
declare var $: any;

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})

export class AddServiceComponent implements OnInit {
  userInfo:any = JSON.parse(localStorage.getItem('user_info'));
  orgID =  this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id');
  @ViewChild('serviceGrid' , {static: false}) public serviceGrid: GridComponent;
  employeeGridToolItems: ToolbarItems[];
  serviceListing = true;
  formSubmitAttemptForMilestone = false;
  formSubmitAttemptForService: boolean | null = null;
  addMilestoneNameForm: FormGroup;
  addServiceForm: FormGroup;
  addTaskServiceForm: FormGroup;

  addCostInfltForm: FormGroup;
  isCostInflt = false;
  infltUnit = 'sq ft';
  existCostInflt = [];


  commonFields: Object = { text: "value", value: "id"};
  newMilestone = false;
  showMilestoneTaskTable = false;
  ruleData = [
    {
      id:'Floors',
      value:'Floors'
    },{
      id:'Project',
      value:'Project'
    },{
      id:'Unit',
      value:'Unit'
    }
  ]
  serviceTableData;
  milestoneSameNameError = false;
  serviceMilestones = [];
  milestoneDropDownData;
  allMilestoneDropDownData;
  @ViewChild('allTaskGrid' , {static: false}) public allTaskGrid: GridComponent;

  @ViewChild('copyTaskDropdown',{static:false}) public copyTaskDropdown: DropDownListComponent;
  allTaskData;
  showAllTaskTable = false;
  isWrapForMile = false;
  currentMileStoneId = null;
  currentServiceID = null;
  selectTaskToCopy = [];
  selectedTaskToCopy;

  costinflatorDropDownData = [
   
    {
      id:'Plot Size',
      value:'Plot Size'
    },{
      id:'Build up area',
      value:'Build up area'
    },{
      id:'Floors',
      value:'Floors'
    }
  ]

  constructor(
    public Router :Router,
    public settingService: settingsService,
    public costEstimationService: costEstimationService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
  ) {}


  ngOnInit(){
    this.spinner.show();
    this.employeeGridToolItems = ['Search'];
    this.addMilestoneNameFormInputs();
  
    this.addCostInfltFormInputs();
    this.GetEstimationServiceByOrgId();
  }

  GetEstimationServiceByOrgId(){
    this.settingService.GetEstimationServiceByOrgId().subscribe((data: any) => {
      let serviceData = _.values(_.groupBy(data, 'id'));
      let serviceDataProcess = [];
      serviceData.map((elm) => {
        let milestone = [];
        let checkDefault = [];
        elm.map((elm2) => {
          if(elm2.is_default){
            checkDefault.push(elm2.is_default)
          }

          milestone.push({
            id: elm2.milestone_id,
            value: elm2.milestoneName,
          });
          let serviceObj = {
            createdBy: elm2.createdBy,
            createdDate: elm2.createdDate,
            id: elm2.id,
            org_id: elm2.org_id,
            serviceName: elm2.serviceName,
            milestone: milestone,
            isDefault: checkDefault.length === 0 ? false : true
          }
          serviceDataProcess.push(serviceObj);
        });
      });
      this.serviceTableData = _.uniqBy(serviceDataProcess, 'id');
      this.spinner.hide();
    });
  }

  //add services
  addServiceDiv(){
    this.addServiceFormInputs();
    this.currentServiceID = null;
    this.serviceListing = false;
    this.newMilestone = true;
  }

  getAllMilestoneByOrg(){
    let allMilestoneData = [];
    this.settingService.GetEstimationServiceByOrgId().subscribe((data: any) => {
      if(data.length !== 0){
        data.map((elm, i) => {
          allMilestoneData.push({
            id: elm.milestone_id,
            value: elm.milestoneName+' - ('+elm.serviceName+')'
          });

          if(data.length === i+1){
            this.allMilestoneDropDownData = allMilestoneData;
          }
        });
      }else{
        this.allMilestoneDropDownData = allMilestoneData;
      }
    });
  }

  changeMileStone(data){
    if(data.value !== null){
      this.spinner.show();
      (this.addServiceForm.get('taskList') as FormArray).clear();
      this.currentMileStoneId = data.value;
      this.getTaskForCurrentMileStone(this.currentMileStoneId)
    }
  }

  addNewTask() {
    let newMem = this.addTaskListFormInput();
    this.taskList.push(newMem);
  }

  deleteTaskRow(i: number) {
    this.taskList.removeAt(i);
  }

  checkRowToDisable(){
    let formValue = this.addServiceForm.controls['taskList'].value;
    if(formValue.length === 1){
      return true
    }else{
      return false
    }
  }

  saveService(){
    this.formSubmitAttemptForService = false;
    if(this.addServiceForm.invalid){
      return;
    }

    

    //check Inflator Present

    let cstInfltrVal =    this.addCostInfltForm.getRawValue();
   
    if(cstInfltrVal.inflateby != null) {


      if( cstInfltrVal.maxMeasur != null && cstInfltrVal.perIncMet != null && cstInfltrVal.perIncPer != null) {


        if(this.existCostInflt.length === 0) {

          let pstData = {
            "org_id": this.orgID,
            "serviceId": this.currentServiceID, 
            "measurementMetric": "sq ft",
            "minMeasure": "0",
            "maxMeasure": cstInfltrVal.maxMeasur.toString(),
            "perAddtionalMetric": cstInfltrVal.perIncMet.toString(),
             "perPercentIncrement": cstInfltrVal.perIncPer.toString(),
             "createdDate": moment().format('L'),
             "modifiedDate": moment().format('L'),
             "createdBy": this.userInfo.full_name,
             "createdByEmpId": this.userInfo.id,
             "isDeleted": false,
             "description": cstInfltrVal.inflateby.toString()
  
          }
          //Call the Add Function
           
          this.settingService.AddCostInfltrService(pstData).subscribe((data:any) => {
            console.log(data);
            if(data.status === '200'){
                console.log('Cost Inflator Added')
            } else {
              console.log('Cost Inflator Not Added')
            }
    
          }); 


        } else {
          console.log("EXISTING CST",this.existCostInflt);
          //Update Existing Cost Inflator
          let pstData = {
            "id" : this.existCostInflt[0].id,
            "org_id": this.orgID,
            "serviceId": this.currentServiceID, 
            "measurementMetric": "sq ft",
            "minMeasure": "0",
            "maxMeasure": cstInfltrVal.maxMeasur.toString(),
            "perAddtionalMetric": cstInfltrVal.perIncMet.toString(),
             "perPercentIncrement": cstInfltrVal.perIncPer.toString(),
             "createdDate": moment().format('L'),
             "modifiedDate": moment().format('L'),
             "createdBy": this.userInfo.full_name,
             "createdByEmpId": this.userInfo.id,
             "isDeleted": false,
             "description": cstInfltrVal.inflateby.toString()

          }
          //Call the Add Function
           
          this.settingService.UpdateCostInfltrService(pstData).subscribe((data:any) => {
            console.log(data);
            if(data.status === '200'){
                console.log('Cost Inflator Added')
            } else {
              console.log('Cost Inflator Not Added')
            }
    
          }); 


        }

       


      }

            

    }


    

    let formValue = this.addServiceForm.getRawValue();
    this.serviceMilestones.map((msd) => {
      if(msd.id === formValue.milestone){
        let taskArray = []
        formValue.taskList.map((tsk, i) => {
          let taskData = {
            id: this.generateId(15),
            org_id: this.orgID,
            milestone_id: formValue.milestone,
            task_name: tsk.taskName,
            task_description: tsk.taskDescription,
            task_sequence: i+1,
            unit: tsk.rules,
            qty: tsk.timeConverted,
            actual_avg_hrs: 0,
            created_date: moment().format('L'),
            createdby: this.userInfo.full_name
          }
          taskArray.push(taskData)

          if(formValue.taskList.length === i+1){
            let milestoneData = {
              id: msd.id,
              org_id: this.orgID,
              milestone_name: msd.milestone_name,
              alias_name: msd.milestone_name,
              isWrap: msd.isWrap,
              created_date: moment().format('L'),
              createdby: this.userInfo.full_name,
              staticTasks: taskArray
            }

            let serviceData:any = {
              org_id: this.orgID,
              serviceName: formValue.serviceName,
              is_default: formValue.isDefault,
              createdBy: this.userInfo.full_name,
              createdDate: moment().format('L'),
              serviceMilestones: [milestoneData]
            }

            if(this.currentServiceID !== null){
              serviceData.id = this.currentServiceID;
              serviceData.milestone_id = msd.id;
              serviceData.milestoneName = msd.milestone_name;
            }

            this.settingService.NewUpdateEstimationService(serviceData).subscribe((data:any) => {
              if(data.status === '200'){
                this.spinner.show();
                this.addServiceForm.reset();
                (this.addServiceForm.get('taskList') as FormArray).clear();
                this.formSubmitAttemptForService = true;
                this.currentServiceID = data.desc;
                this.getSavedServiceData(data.desc, msd.id)
                this.toast.success('Service Saved')
              }else{
                this.toast.error('Something went wrong')
              }
            });
          }
        });
      }
    });
  }

  //edit service
  editSingleService(editServiceData){
    this.addServiceFormInputs();
    this.spinner.show();
    this.currentServiceID = editServiceData.id;
    this.getSavedServiceData(this.currentServiceID, editServiceData.milestone[0].id)
    this.serviceListing = false;
    this.showMilestoneTaskTable = true;
  }

  getSavedServiceData(serviceID, milestoneID){
    this.currentMileStoneId = milestoneID;
    let serviceMilestones = [];
    let mileStoneDropDown = [];
    let defaultArray = [];
    this.costEstimationService.GetEstimationServiceById({id:serviceID}).subscribe((mileData:any) => {
      mileData.map((mil, i1) => {
        let milestoneData:any = {
          id: mil.milestone_id,
          org_id: mil.org_id,
          milestone_name: mil.milestoneName,
          alias_name: mil.milestoneName,
          isWrap: mil.isWrap,
          created_date: mil.createdDate,
          createdby: mil.createdBy,
        }

        mileStoneDropDown.push({
          id: mil.milestone_id,
          value: mil.milestoneName
        });

        if(mil.is_default){
          defaultArray.push(mil.is_default);
        }

        this.settingService.GetStaticMilestoneTasksByMilestoneID(mil.milestone_id).subscribe((taskData:any) => {
          let staticTasks = [];
            taskData.map((taskD, i2) => {
            let taskObj = {
              id: taskD.id,
              org_id: mil.milestone_id,
              milestone_id: taskD.milestone_id,
              task_name: taskD.task_name,
              unit: taskD.unit,
              qty: taskD.qty,
              actual_avg_hrs: taskD.actual_avg_hrs,
              task_description: taskD.task_description,
              task_sequence: taskD.task_sequence,
              created_date: taskD.created_date,
              createdby: taskD.createdby,
            }
            staticTasks.push(taskObj);

            if(taskData.length === i2 + 1){
              milestoneData.staticTasks = staticTasks;
              serviceMilestones.push(milestoneData);
              if(mileData.length === i1 + 1){
                this.milestoneDropDownData = mileStoneDropDown;
                this.serviceMilestones = serviceMilestones;
                this.addServiceForm.patchValue({
                  serviceName: mileData[0].serviceName,
                  isDefault: defaultArray.length !== 0 ? true : false,
                  milestone: this.currentMileStoneId
                });
              }
            }
          });
        });
      });
    });
    //Get Cost Inflator Information
    this.costEstimationService.GetCostInflatorbyServiceById({id:serviceID}).subscribe((infData:any)=>{
        //Build up Area
        if(infData.length > 0) {
          this.addCostInfltForm.reset();
          this.isCostInflt = true;
          this.existCostInflt = infData;
          this.addCostInfltForm.patchValue({
            inflateby: infData[0].description ,
            maxMeasur: parseInt(infData[0].maxMeasure),
            perIncMet: parseInt(infData[0].perAddtionalMetric),
            perIncPer: parseInt(infData[0].perPercentIncrement),
          });
        } else {
          this.addCostInfltForm.reset();
        }
    });


  }

  getTaskForCurrentMileStone(mileStoneID){
    let formData = this.addServiceForm.get('taskList') as FormArray;
    let singleMileStone = this.serviceMilestones.filter((elm) => elm.id === mileStoneID);
    if(singleMileStone[0].staticTasks){
      let singleMileStoneData = singleMileStone[0];
      singleMileStoneData.staticTasks.sort((a, b) => parseFloat(a.task_sequence) - parseFloat(b.task_sequence));
      this.isWrapForMile = singleMileStoneData.isWrap;
      singleMileStoneData.staticTasks.map((elm, i) => {
        let minutes = parseFloat(elm.qty) * 60
        let hrsMinFormat = this.toHoursAndMinutes(minutes).split(':');
        formData.push(this.formBuilder.group({
          taskName: elm.task_name,
          timeConverted: elm.qty,
          rules: elm.unit,
          taskDescription: elm.task_description,
          taskHours: hrsMinFormat[0],
          taskMinutes: hrsMinFormat[1]
        }));
        formData.at(i).get('timeConverted').disable();
      });
    }else{
      if(this.selectedTaskToCopy.length === 0){
        let newMem = this.addTaskListFormInput();
        this.taskList.push(newMem);
        this.isWrapForMile = true;
      }else{
        this.spinner.show();
        this.applyCopiedTask();
      }
    }
    this.spinner.hide();
  }

  toHoursAndMinutes(totalMinutes) {
    const minutes = (totalMinutes % 60).toFixed(0);
    const hours = Math.floor(totalMinutes / 60);
    return `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}`;
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  closeAddEditService(){
    this.GetEstimationServiceByOrgId();
    this.addServiceForm.reset();
    (this.addServiceForm.get('taskList') as FormArray).clear();
    this.serviceListing = true;
    this.formSubmitAttemptForService = true;
    this.showMilestoneTaskTable = false;
    this.serviceMilestones = [];
    this.spinner.hide();
  }

  //time calculation fun
  retureHrsMinConvertedDecimal(item: any, i){
    let getValue = item.value;
    let hours = getValue.taskHours === '' || getValue.taskHours === null ? 0 : parseFloat(getValue.taskHours);
    let minutes = getValue.taskMinutes === '' || getValue.taskMinutes === null ? 0 : parseFloat(getValue.taskMinutes);
    let totalMinutes = (hours * 60) + minutes;
    let timeConverted = parseFloat((totalMinutes / 60).toFixed(2));
    this.taskList.at(i).patchValue({
      timeConverted: timeConverted
    });
  }
  //time calculation fun


  //Add milestone Model all function
  addMilestoneModel(){
    $("#Add_Milestone_modal").modal('show');
    this.getAllMilestoneByOrg();
  }

  //copy a milestone function
  choseAMileStone(data){
    if(data.itemData !== null){
      let mainData = data.itemData
      this.settingService.GetStaticMilestoneTasksByMilestoneID(mainData.id).subscribe((taskData:any) => {
        this.allTaskData = taskData;
        this.showAllTaskTable = true;
      });
    }
  }

  rowSelected(){
    this.selectTaskToCopy = this.allTaskGrid.getSelectedRecords();
  }

  applyCopiedTask(){
    (this.addServiceForm.get('taskList') as FormArray).clear();
    let formData = this.addServiceForm.get('taskList') as FormArray;
    this.selectedTaskToCopy.map((elm, i) => {
      let minutes = parseFloat(elm.qty) * 60
      let hrsMinFormat = this.toHoursAndMinutes(minutes).split(':');
      formData.push(this.formBuilder.group({
        taskName: elm.task_name,
        timeConverted: elm.qty,
        rules: elm.unit,
        taskDescription: elm.task_description,
        taskHours: hrsMinFormat[0],
        taskMinutes: hrsMinFormat[1]
      }));
      formData.at(i).get('timeConverted').disable();
    });
    this.spinner.hide();
  }
  //copy a milestone function

  saveMileStone(){
    this.spinner.show();
    this.milestoneSameNameError = false;
    if(this.addMilestoneNameForm.invalid){
      this.formSubmitAttemptForMilestone = true;
      this.spinner.hide();
      return;
    }

    let formValue = this.addMilestoneNameForm.value;
    if(this.serviceMilestones.length === 0){
      this.contWithSaveMileStone();
    }else{
      this.serviceMilestones.map((elm, index) =>{
        if(elm.milestone_name === formValue.mileStoneName){
          this.milestoneSameNameError = true;
          this.spinner.hide();
        }

        if(this.serviceMilestones.length === index + 1){
          if(!this.milestoneSameNameError){
            this.contWithSaveMileStone();
          }
        }
      });
    }
  }

  contWithSaveMileStone(){
    this.selectedTaskToCopy = Array.from(this.selectTaskToCopy);
    let formValue = this.addMilestoneNameForm.value;
    this.isWrapForMile = true;
    let milestoneData = {
      "id": this.generateId(10),
      "org_id": this.orgID,
      "milestone_name": formValue.mileStoneName,
      "alias_name": formValue.mileStoneName,
      "isWrap" : this.isWrapForMile,
      "created_date": moment().format('L'),
      "createdby": this.userInfo.full_name
    }
    this.serviceMilestones.push(milestoneData);

    let results = [];
    this.serviceMilestones.map((mileData, i) => {
      results.push({
        id: mileData.id,
        value: mileData.milestone_name
      });

      if(this.serviceMilestones.length === i+1){
        this.milestoneDropDownData = results;
        this.addServiceForm.patchValue({
          milestone: milestoneData.id
        });
        this.changeMileStone({value: milestoneData.id})
        this.toast.success('Milestone '+formValue.mileStoneName+' Added');
        this.showMilestoneTaskTable = true;
        this.newMilestone = false;
        this.closeaddMilestoneModel();
      }
    });
  }

  closeaddMilestoneModel(){
    $("#Add_Milestone_modal").modal('hide');
    this.addMilestoneNameForm.reset();
    this.formSubmitAttemptForMilestone = false;
    this.milestoneSameNameError = false;
    this.showAllTaskTable = false;
    this.spinner.hide();
    this.copyTaskDropdown.value = null;
  }

  //Add wrap to current milestone
  isWrapMi(e){
    this.isWrapForMile = e.checked;
    let formValue = this.addServiceForm.value;
    this.serviceMilestones.map((elm) => {
      if(elm.id === formValue.milestone){
        elm.isWrap = this.isWrapForMile
      }
    });
  }

  //delete service
  deleteService(serviceData){
    Swal.fire({
      title: 'Delete this Service - '+serviceData.serviceName+' ?',
      text: "Please Note you won't be able to revert this",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        this.spinner.show();
        this.costEstimationService.GetEstimationServiceById({id: serviceData.id}).subscribe((mileData:any) => {
          mileData.map((mil, mi) => {
            this.settingService.GetStaticMilestoneTasksByMilestoneID(mil.milestone_id).subscribe((taskData:any) => {
              let staticTasks = [];
              taskData.map((taskD, ti) => {
                let taskObj = {
                  id: taskD.id,
                  org_id: mil.milestone_id,
                  milestone_id: taskD.milestone_id,
                  task_name: taskD.task_name,
                  unit: taskD.unit,
                  qty: taskD.qty,
                  actual_avg_hrs: taskD.actual_avg_hrs,
                  task_description: taskD.task_description,
                  task_sequence: taskD.task_sequence,
                  is_deleted: true,
                  created_date: taskD.created_date,
                  createdby: taskD.createdby,
                }
                staticTasks.push(taskObj);

                if(taskData.length === ti + 1){
                  let sendData = {
                    id: serviceData.id,
                    org_id: serviceData.org_id,
                    serviceName: serviceData.serviceName,
                    milestoneName: mil.milestoneName,
                    milestone_id: mil.milestone_id,
                    createdBy: serviceData.createdBy,
                    createdDate: serviceData.createdDate,
                    is_deleted: true,
                    serviceMilestones: [{
                      id: mil.milestone_id,
                      org_id: mil.org_id,
                      milestone_name: mil.milestoneName,
                      alias_name: mil.milestoneName,
                      isWrap: mil.isWrap,
                      created_date: mil.createdDate,
                      createdby: mil.createdBy,
                      is_deleted: true,
                      staticTasks: staticTasks
                    }]
                  }
                  this.settingService.DeleteEstimationService(sendData).subscribe((data:any) => {
                    if(data.status === '200'){
                      this.toast.success(sendData.milestoneName+' milestone deleted successfully.')
                    }

                    if(mileData.length === mi+1){
                      this.toast.success(sendData.serviceName+' service deleted successfully')
                      this.GetEstimationServiceByOrgId();
                    }
                  });
                }
              });
            });
          });
        });
      }
    });
  }
  //delete service

  changeCostInflator(data){
    console.log(data.value)
    if(data.value === 'Floors') {
      this.infltUnit = 'Floors'
    } else {
      this.infltUnit = 'sq ft'
    }
    console.log("this.infltUnit-->",this.infltUnit);
  }

  //form control
  addMilestoneNameFormInputs(){
    this.addMilestoneNameForm = new FormGroup({
      mileStoneName: new FormControl('', [Validators.required])
    })
  }



  addCostInfltFormInputs(){
    this.addCostInfltForm = new FormGroup({
      inflateby: new FormControl('', [Validators.required]),
      maxMeasur: new FormControl('', [Validators.required]),
      perIncMet: new FormControl('', [Validators.required]),
      perIncPer: new FormControl('', [Validators.required]),
    })
  }

  addServiceFormInputs(){
    this.addServiceForm = this.formBuilder.group({
      serviceName: ['', Validators.required],
      isDefault: [false],
      milestone: ['', Validators.required],
      taskList: this.formBuilder.array([],
                [Validators.required])
    });
  }

  get serviceName() {
    return this.addServiceForm.get('serviceName');
  }

  get milestone() {
    return this.addServiceForm.get('milestone');
  }

  get taskList(): FormArray {
    return this.addServiceForm.get('taskList') as FormArray;
  }

  addTaskListFormInput(){
    return this.formBuilder.group({
      taskName: ['', [Validators.required]],
      timeConverted: [{ value: '', disabled: true }],
      taskHours: [''],
      taskMinutes: ['', [Validators.max(60)]],
      taskDescription: [''],
      rules: ['', [Validators.required]]
    });
  }

  //form control
  generateId(length){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ){
      result += characters.charAt(Math.floor(Math.random() * charactersLength ));
    }
    return result;
  }

  serviceSearchKeyUp(): void {
    document.getElementById(this.serviceGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.serviceGrid.search((event.target as HTMLInputElement).value)
    });
  }

  backToEstimation(){
    this.Router.navigate(['settings-new/estimation']);
  }
}
