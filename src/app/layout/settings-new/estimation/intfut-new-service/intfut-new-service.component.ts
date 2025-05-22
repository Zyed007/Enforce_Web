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
  selector: 'app-intfut-new-service',
  templateUrl: './intfut-new-service.component.html',
  styleUrls: ['./intfut-new-service.component.scss']
})

export class IntfutNewServiceComponent implements OnInit {
  userInfo: any = JSON.parse(localStorage.getItem('user_info'));
  orgID = this.userInfo.org_id !== null ? this.userInfo.org_id : localStorage.getItem('org_id');
  @ViewChild('serviceGrid', { static: false }) public serviceGrid: GridComponent;
  employeeGridToolItems: ToolbarItems[];
  serviceListing = true;
  checkBoxVal = false;
  formSubmitAttemptForMilestone = false;
  formSubmitAttemptForService: boolean | null = null;
  addIntfutServMilestoneNameForm: FormGroup;
  addintfutServiceForm: FormGroup;
  addTaskServiceForm: FormGroup;

  addRelatedItemForm: FormGroup;

  addQstItemForm: FormGroup;


  addCostInfltForm: FormGroup;
  isCostInflt = false;
  infltUnit = 'sq ft';
  existCostInflt = [];

  frmVals = [];


  commonFields: Object = { text: "value", value: "id" };
  newMilestone = false;
  showMilestoneTaskTable = false;
  ruleData = [
    {
      id: 'Slave Item',
      value: 'Slave Item'
    }, {
      id: 'Project',
      value: 'Project'
    }, {
      id: 'Unit',
      value: 'Unit'
    }
  ]
  serviceTableData;
  milestoneSameNameError = false;
  serviceMilestones = [];
  milestoneDropDownData;
  allMilestoneDropDownData;
  @ViewChild('allTaskGrid', { static: false }) public allTaskGrid: GridComponent;

  @ViewChild('copyTaskDropdown', { static: false }) public copyTaskDropdown: DropDownListComponent;
  allTaskData;
  showAllTaskTable = false;
  isWrapForMile = false;
  currentMileStoneId = null;


  currentSequenceNum = "";

  currentServiceID = null;
  selectTaskToCopy = [];
  selectedTaskToCopy;

  addItemsDropDownData = [

    {
      id: 'Standalone',
      value: 'Standalone'
    }, {
      id: 'Realtional',
      value: 'Realtional'
    }
  ]

  constructor(
    public Router: Router,
    public settingService: settingsService,
    public costEstimationService: costEstimationService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
  ) { }


  ngOnInit() {
    this.spinner.show();
    this.employeeGridToolItems = ['Search'];
    this.addMilestoneNameFormInputs();
    this.addRelatedItemFormInputs();
    this.addQstnAireFormInputs();

    //this.addCostInfltFormInputs();
    this.GetEstimationServiceByOrgId();
  }

  GetEstimationServiceByOrgId() {



    this.settingService.GetServiceMainCategorybyOrgId().subscribe((data: any) => {
      let serviceData = data;
      let serviceDataProcess = [];
      serviceData.map((elm) => {
        let milestone = [];
        let checkDefault = [];

        let serviceObj = {
          createdBy: elm.createdby,
          createdDate: elm.created_date,
          id: elm.id,
          org_id: elm.org_id,
          serviceName: elm.serviceCategoryName,
          addtoBOQ: elm.addtoBOQ,
          // milestone: milestone,
          //isDefault: checkDefault.length === 0 ? false : true
        }
        serviceDataProcess.push(serviceObj);
        // elm.map((elm2) => {
        //   let serviceObj = {
        //     createdBy: elm2.createdBy,
        //     createdDate: elm2.createdDate,
        //     id: elm2.id,
        //     org_id: elm2.org_id,
        //     serviceName: elm2.serviceName,
        //     milestone: milestone,
        //     isDefault: checkDefault.length === 0 ? false : true
        //   }
        //   serviceDataProcess.push(serviceObj);
        // });
      });
      console.log("serviceDataProcess--->", serviceDataProcess);
      this.serviceTableData = serviceDataProcess;
      // this.serviceTableData = _.uniqBy(serviceDataProcess, 'id');
      this.spinner.hide();
    });
  }

  //add services
  addServiceDiv() {
    this.addServiceFormInputs();
    this.addRelatedItemFormInputs();
    this.addQstnAireFormInputs();
    this.currentServiceID = null;
    this.serviceListing = false;
    this.newMilestone = true;
  }

  getAllMilestoneByOrg() {
    let allMilestoneData = [];
    this.settingService.GetEstimationServiceByOrgId().subscribe((data: any) => {
      if (data.length !== 0) {
        data.map((elm, i) => {
          allMilestoneData.push({
            id: elm.milestone_id,
            value: elm.milestoneName + ' - (' + elm.serviceName + ')'
          });

          if (data.length === i + 1) {
            this.allMilestoneDropDownData = allMilestoneData;
          }
        });
      } else {
        this.allMilestoneDropDownData = allMilestoneData;
      }
    });
  }
  handleCheckBox(e) {
    this.checkBoxVal = e.target.checked
  }
  changeMileStone(data) {
    if (data.value !== null) {
      this.spinner.show();
      (this.addintfutServiceForm.get('taskList') as FormArray).clear();
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

  checkRowToDisable() {
    let formValue = this.addintfutServiceForm.controls['taskList'].value;
    if (formValue.length === 1) {
      return true
    } else {
      return false
    }
  }

  saveService() {
    this.formSubmitAttemptForService = false;
    // debugger
    // if(this.addintfutServiceForm.invalid){
    //   return;
    // }


    let formValue = this.addintfutServiceForm.getRawValue();
    this.serviceMilestones.map((msd) => {
      if (msd.id === formValue.milestone) {
        let taskArray = []
        formValue.taskList.map((tsk, i) => {
          let taskData = {
            id: this.generateId(15),
            org_id: this.orgID,
            primaryCategoryId: msd.id,
            subCategoryName: tsk.taskName,
            subCategoryDescription: tsk.taskDescription,
            created_date: moment().format('L'),
            createdby: this.userInfo.full_name
          }
          taskArray.push(taskData)

          if (formValue.taskList.length === i + 1) {
            let milestoneData = {
              id: msd.id,
              org_id: this.orgID,
              primaryCategoryName: msd.milestone_name,
              sequence: msd.sequence,
              primaryCategoryDescription: msd.milestone_name,
              created_date: moment().format('L'),
              createdby: this.userInfo.full_name,
              serviceSubCategory: taskArray
            }

            let serviceData: any = {
              org_id: this.orgID,
              serviceCategoryName: formValue.serviceName,
              serviceCategoryDescription: formValue.serviceName,
              createdBy: this.userInfo.full_name,
              createdDate: moment().format('L'),
              servicePrimaryCategory: [milestoneData],
              addtoBOQ: this.checkBoxVal
            }

            if (this.currentServiceID !== null) {
              serviceData.id = this.currentServiceID;
              serviceData.milestone_id = msd.id;
              serviceData.milestoneName = msd.milestone_name;
            }


            console.log("serviceData--->", serviceData);

            // this.getSavedServiceData("data.desc", msd.id)


            this.settingService.UpdateServiceMainCategory(serviceData).subscribe((data: any) => {
              if (data.status === '200') {
                this.spinner.show();
                this.addintfutServiceForm.reset();
                (this.addintfutServiceForm.get('taskList') as FormArray).clear();
                this.formSubmitAttemptForService = true;
                this.currentServiceID = data.desc;
                this.getSavedServiceData(data.desc, msd.id, serviceData.serviceCategoryName)
                this.toast.success('Service Saved')
              } else {
                this.toast.error('Something went wrong')
              }
            });
          }
        });
      }
    });
  }

  //edit service
  editSingleService(editServiceData) {
    this.addServiceFormInputs();
    this.addRelatedItemFormInputs();
    this.addQstnAireFormInputs();
    this.spinner.show();
    this.currentServiceID = editServiceData.id;
    this.getSavedServiceDataNew(this.currentServiceID, editServiceData.serviceName)
    this.serviceListing = false;
    this.showMilestoneTaskTable = true;
  }

  getSavedServiceDataNew(serviceID, serviceName) {

    let serviceMilestones = [];
    let mileStoneDropDown = [];
    let defaultArray = [];

    //  let newSrv = "45ae9515-7b71-48fb-979e-cba31c4f40ce"


    //GetServicePrimaryCategoryByMain


    this.settingService.GetServicePrimaryCategoryByMain(serviceID).subscribe((mileData: any) => {


      console.log("mileData--->", mileData);

      this.currentMileStoneId = mileData[0].id;
      mileData.map((mil, i1) => {
        let milestoneData: any = {
          id: mil.id,
          org_id: mil.org_id,
          milestone_name: mil.primaryCategoryName,
          sequence: mil.sequence ? mil.sequence : 0,
          // alias_name: mil.milestoneName,
          // isWrap: mil.isWrap,
          created_date: mil.createdDate,
          createdby: mil.createdBy,
        }

        mileStoneDropDown.push({
          id: mil.id,
          value: mil.primaryCategoryName
        });


        this.settingService.GetServiceSubCategoryByMain(mil.id).subscribe((taskData: any) => {
          let staticTasks = [];
          taskData.map((taskD, i2) => {
            let taskObj = {
              id: taskD.id,
              org_id: mil.org_id,
              milestone_id: taskD.primaryCategoryId,
              task_name: taskD.subCategoryName,
              // unit: taskD.unit,
              // qty: taskD.qty,
              // actual_avg_hrs: taskD.actual_avg_hrs,
              task_description: taskD.subCategoryDescription,
              // task_sequence: taskD.task_sequence,
              created_date: taskD.created_date,
              createdby: taskD.createdby,
            }
            staticTasks.push(taskObj);

            if (taskData.length === i2 + 1) {
              milestoneData.staticTasks = staticTasks;
              serviceMilestones.push(milestoneData);
              if (mileData.length === i1 + 1) {
                this.milestoneDropDownData = mileStoneDropDown;
                console.log("this.milestoneDropDownData--->", this.milestoneDropDownData);
                this.serviceMilestones = serviceMilestones;
                this.addintfutServiceForm.patchValue({
                  serviceName: serviceName,
                  milestone: this.currentMileStoneId
                });
              }
            }
          });
        });
      });
    });


  }

  getSavedServiceData(serviceID, milestoneID, serviceName) {
    this.currentMileStoneId = milestoneID;
    let serviceMilestones = [];
    let mileStoneDropDown = [];
    let defaultArray = [];

    // let newSrv = "45ae9515-7b71-48fb-979e-cba31c4f40ce"


    //GetServicePrimaryCategoryByMain


    this.settingService.GetServicePrimaryCategoryByMain(serviceID).subscribe((mileData: any) => {
      mileData.map((mil, i1) => {
        let milestoneData: any = {
          id: mil.id,
          org_id: mil.org_id,
          milestone_name: mil.primaryCategoryName,
          sequence: mil.sequence ? mil.sequence : 0,
          // alias_name: mil.milestoneName,
          // isWrap: mil.isWrap,
          created_date: mil.createdDate,
          createdby: mil.createdBy,
        }

        mileStoneDropDown.push({
          id: mil.id,
          value: mil.primaryCategoryName
        });


        this.settingService.GetServiceSubCategoryByMain(mil.id).subscribe((taskData: any) => {
          let staticTasks = [];
          taskData.map((taskD, i2) => {
            let taskObj = {
              id: taskD.id,
              org_id: mil.org_id,
              milestone_id: taskD.primaryCategoryId,
              task_name: taskD.subCategoryName,
              // unit: taskD.unit,
              // qty: taskD.qty,
              // actual_avg_hrs: taskD.actual_avg_hrs,
              task_description: taskD.subCategoryDescription,
              // task_sequence: taskD.task_sequence,
              created_date: taskD.created_date,
              createdby: taskD.createdby,
            }
            staticTasks.push(taskObj);

            if (taskData.length === i2 + 1) {
              milestoneData.staticTasks = staticTasks;
              serviceMilestones.push(milestoneData);
              if (mileData.length === i1 + 1) {
                this.milestoneDropDownData = mileStoneDropDown;
                this.serviceMilestones = serviceMilestones;
                this.addintfutServiceForm.patchValue({
                  serviceName: serviceName,
                  milestone: this.currentMileStoneId
                });
              }
            }
          });
        });
      });
    });


  }

  getTaskForCurrentMileStone(mileStoneID) {
    let formData = this.addintfutServiceForm.get('taskList') as FormArray;
    let singleMileStone = this.serviceMilestones.filter((elm) => elm.id === mileStoneID);


    this.currentSequenceNum = singleMileStone[0].sequence;

    if (singleMileStone[0].staticTasks) {
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
    } else {
      if (this.selectedTaskToCopy.length === 0) {
        let newMem = this.addTaskListFormInput();
        this.taskList.push(newMem);
        this.isWrapForMile = true;
      } else {
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

  closeAddEditService() {
    this.GetEstimationServiceByOrgId();
    this.addintfutServiceForm.reset();
    (this.addintfutServiceForm.get('taskList') as FormArray).clear();
    this.serviceListing = true;
    this.formSubmitAttemptForService = true;
    this.showMilestoneTaskTable = false;
    this.serviceMilestones = [];
    this.spinner.hide();
  }

  //time calculation fun
  retureHrsMinConvertedDecimal(item: any, i) {
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
  addMilestoneModel() {
    $("#Add_Milestone_modal").modal('show');
    this.getAllMilestoneByOrg();
  }

  //copy a milestone function
  choseAMileStone(data) {
    if (data.itemData !== null) {
      let mainData = data.itemData
      this.settingService.GetStaticMilestoneTasksByMilestoneID(mainData.id).subscribe((taskData: any) => {
        this.allTaskData = taskData;
        this.showAllTaskTable = true;
      });
    }
  }

  rowSelected() {
    this.selectTaskToCopy = this.allTaskGrid.getSelectedRecords();
  }

  applyCopiedTask() {
    (this.addintfutServiceForm.get('taskList') as FormArray).clear();
    let formData = this.addintfutServiceForm.get('taskList') as FormArray;
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

  saveMileStone() {
    this.spinner.show();
    this.milestoneSameNameError = false;
    if (this.addIntfutServMilestoneNameForm.invalid) {
      this.formSubmitAttemptForMilestone = true;
      this.spinner.hide();
      return;
    }

    let formValue = this.addIntfutServMilestoneNameForm.value;
    if (this.serviceMilestones.length === 0) {
      this.contWithSaveMileStone();
    } else {
      this.serviceMilestones.map((elm, index) => {
        if (elm.milestone_name === formValue.mileStoneName) {
          this.milestoneSameNameError = true;
          this.spinner.hide();
        }

        if (this.serviceMilestones.length === index + 1) {
          if (!this.milestoneSameNameError) {
            this.contWithSaveMileStone();
          }
        }
      });
    }
  }

  contWithSaveMileStone() {
    this.selectedTaskToCopy = Array.from(this.selectTaskToCopy);
    let formValue = this.addIntfutServMilestoneNameForm.value;
    this.isWrapForMile = true;
    let milestoneData = {
      "id": this.generateId(10),
      "org_id": this.orgID,
      "milestone_name": formValue.mileStoneName,
      "alias_name": formValue.mileStoneName,
      "sequence": formValue.sequenceNum ? formValue.sequenceNum : 0,
      // "isWrap" : this.isWrapForMile,
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

      if (this.serviceMilestones.length === i + 1) {
        this.milestoneDropDownData = results;
        this.addintfutServiceForm.patchValue({
          milestone: milestoneData.id
        });
        this.changeMileStone({ value: milestoneData.id })
        this.toast.success('Milestone ' + formValue.mileStoneName + ' Added');
        this.showMilestoneTaskTable = true;
        this.newMilestone = false;
        this.closeaddMilestoneModel();
      }
    });
  }

  closeaddMilestoneModel() {
    $("#Add_Milestone_modal").modal('hide');
    this.addIntfutServMilestoneNameForm.reset();
    this.formSubmitAttemptForMilestone = false;
    this.milestoneSameNameError = false;
    this.showAllTaskTable = false;
    this.spinner.hide();
    //this.copyTaskDropdown.value = null;
  }



  //Add wrap to current milestone
  isWrapMi(e) {
    this.isWrapForMile = e.checked;
    let formValue = this.addintfutServiceForm.value;
    this.serviceMilestones.map((elm) => {
      if (elm.id === formValue.milestone) {
        elm.isWrap = this.isWrapForMile
      }
    });
  }

  //delete service
  deleteService(serviceData) {
    Swal.fire({
      title: 'Delete this Service - ' + serviceData.serviceName + ' ?',
      text: "Please Note you won't be able to revert this",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if (result.value === true) {
        this.spinner.show();

        this.settingService.GetServicePrimaryCategoryByMain(serviceData.id).subscribe((mileData: any) => {
          mileData.map((mil, mi) => {
            this.settingService.GetServiceSubCategoryByMain(mil.id).subscribe((taskData: any) => {
              let staticTasks = [];
              taskData.map((taskD, ti) => {
                let taskObj = {
                  id: taskD.id,
                  org_id: mil.org_id,
                  primaryCategoryId: taskD.primaryCategoryId,
                  subCategoryName: taskD.subCategoryName,
                  // unit: taskD.unit,
                  // qty: taskD.qty,
                  // actual_avg_hrs: taskD.actual_avg_hrs,
                  subCategoryDescription: taskD.subCategoryDescription,
                  // task_sequence: taskD.task_sequence,
                  is_deleted: true,
                  created_date: taskD.created_date,
                  createdby: taskD.createdby,
                }
                staticTasks.push(taskObj);
                // console.log('VAL___>',taskData.length, ti + 1);
                if (taskData.length === ti + 1) {
                  let sendData = {
                    id: serviceData.id,
                    org_id: serviceData.org_id,
                    serviceCategoryName: serviceData.serviceName,
                    // milestoneName: mil.milestoneName,
                    // milestone_id: mil.milestone_id,
                    createdby: serviceData.createdby,
                    created_date: serviceData.created_date,
                    is_deleted: true,
                    servicePrimaryCategory: [{
                      id: mil.id,
                      org_id: mil.org_id,
                      primaryCategoryName: mil.primaryCategoryName,
                      primaryCategoryDescription: mil.primaryCategoryDescription,

                      created_date: mil.createdDate,
                      createdby: mil.createdBy,
                      is_deleted: true,
                      serviceSubCategory: staticTasks
                    }]
                  }

                  console.log("sendData--->", sendData);
                  this.settingService.UpdateServiceMainCategory(sendData).subscribe((data: any) => {
                    if (data.status === '200') {
                      // this.toast.success(sendData.milestoneName+' milestone deleted successfully.')

                      this.toast.success('Service Deleted successfully')
                    }

                    //if(mileData.length === mi+1){
                    // this.toast.success(sendData.serviceName+' service deleted successfully')
                    this.GetEstimationServiceByOrgId();
                    //}
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

  changeCostInflator(data, i) {
    console.log("data.value--->", data.value)
    this.realtedItems.at(i).patchValue({
      typeOf: data.value
    });
    if (data.value === "Standalone") {
      this.realtedItems.controls[i].get('formula').disable()
    } else {
      this.realtedItems.controls[i].get('formula').enable()
    }


  }

  //form control
  addMilestoneNameFormInputs() {
    this.addIntfutServMilestoneNameForm = new FormGroup({
      mileStoneName: new FormControl('', [Validators.required]),
      sequenceNum: new FormControl('', [])
    })
  }



  addCostInfltFormInputs() {
    this.addCostInfltForm = new FormGroup({
      inflateby: new FormControl('', [Validators.required]),
      maxMeasur: new FormControl('', [Validators.required]),
      perIncMet: new FormControl('', [Validators.required]),
      perIncPer: new FormControl('', [Validators.required]),
    })
  }

  addServiceFormInputs() {
    this.addintfutServiceForm = this.formBuilder.group({
      serviceName: ['', Validators.required],
      // isDefault: [false],
      milestone: ['', Validators.required],
      taskList: this.formBuilder.array([],
        [Validators.required])
    });
  }

  addRelatedItemFormInputs() {
    this.addRelatedItemForm = this.formBuilder.group({
      realtedItems: this.formBuilder.array([], [Validators.required])
    });
  }

  addQstnAireFormInputs() {
    this.addQstItemForm = this.formBuilder.group({
      questionItmes: this.formBuilder.array([], [Validators.required])
    });
  }



  get serviceName() {
    return this.addintfutServiceForm.get('serviceName');
  }

  get milestone() {
    return this.addintfutServiceForm.get('milestone');
  }

  get taskList(): FormArray {
    return this.addintfutServiceForm.get('taskList') as FormArray;
  }

  get realtedItems(): FormArray {
    return this.addRelatedItemForm.get('realtedItems') as FormArray;
  }

  get questionItmes(): FormArray {
    return this.addQstItemForm.get('questionItmes') as FormArray;
  }

  addTaskListFormInput() {
    return this.formBuilder.group({
      taskName: ['', [Validators.required]],
      timeConverted: [{ value: '', disabled: true }],
      // taskQty: [''],
      taskMinutes: ['', [Validators.required]],
      taskDescription: [''],
      peopleReq:[''],
      costPerTime:[''],
      totalCost:[''],
      realtedItems: this.formBuilder.array([], []),
      rules: ['', [Validators.required]]
    });
  }


  addRelatedItemsFormInputs() {
    return this.formBuilder.group({
      itemName: ['', [Validators.required]],
      typeOf: ['', [Validators.required]],
      formula: [''],
    });
  }

  addQstnListFormInputs() {
    return this.formBuilder.group({
      questionDesc: ['', [Validators.required]],
      sequence: ['', [Validators.required]],
    });
  }




  //form control
  generateId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  serviceSearchKeyUp(): void {
    document.getElementById(this.serviceGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.serviceGrid.search((event.target as HTMLInputElement).value)
    });
  }

  backToEstimation() {
    this.Router.navigate(['settings-new/estimation']);
  }


  openSlvpup() {


    let existForm = this.addRelatedItemForm.getRawValue();

    this.frmVals = this.addintfutServiceForm.controls['taskList'].value;
    // let testArr = [];

    //  if(totalChildTsks.length > 0) {
    //   totalChildTsks.map((el)=>{
    //       let tempObj = {
    //         name:  el.taskName  + "=" + el.taskName.slice(0, 3)
    //       }
    //       testArr.push(tempObj);
    //   })
    //  }

    //console.log("testArr--->,",testArr);
    //this.frmVals = testArr;

    if (existForm.realtedItems.length === 0) {
      this.addRelatedItems();
    }

    $("#Add_RelativeItem_modal").modal('show');
  }

  closeRelativeItemModel() {
    $("#Add_RelativeItem_modal").modal('hide');
  }


  openQstnairModal() {

    let existForm = this.addQstItemForm.getRawValue();
    if (existForm.questionItmes.length === 0) {
      this.addQstArItems();
    }
    $("#Add_qstnaire_modal").modal('show');

  }

  closeQstnairModal() {

    $("#Add_qstnaire_modal").modal('hide');

  }





  addQstArItems() {
    let newMem = this.addQstnListFormInputs();
    this.questionItmes.push(newMem);
  }

  deleteQstAretems(i: number) {
    this.questionItmes.removeAt(i);
  }

  addSequenceVal(e) {
    // console.log("e.target.value--->",e.target.value);
    this.currentSequenceNum = e.target.value;
    this.serviceMilestones.map((el) => {
      if (el.id === this.currentMileStoneId) {
        console.log("e-->", el);
        el['sequence'] = e.target.value;
      }
    })

    console.log("this.serviceMilestones--->", this.serviceMilestones);


  }


  addRelatedItems() {
    let newMem = this.addRelatedItemsFormInputs();
    this.realtedItems.push(newMem);
  }

  deleteRelatedItems(i: number) {
    this.realtedItems.removeAt(i);
  }



  saveRelatedItems() {
    console.log("API for Saving the Related Items");
  }


}
