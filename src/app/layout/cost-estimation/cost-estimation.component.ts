import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { costEstimationService } from '../../services/costEstimation.service';
import { UserService } from '../../services/user.service';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import moment = require('moment');
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxSelectionService } from '@syncfusion/ej2-angular-dropdowns';
import { settingsService } from '../../services/settings.service';
import { ProjectService } from '../../services/project.service';
import { CostService } from '../../services/cost.service';
import Swal from 'sweetalert2';
import * as _ from "lodash";
declare var $: any;

@Component({
  selector: 'app-cost-estimation',
  templateUrl: './cost-estimation.component.html',
  styleUrls: ['./cost-estimation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CheckBoxSelectionService]
})
export class CostEstimationComponent implements OnInit {

  showEstimationList = false;
  showEstimationAddBtn = false;
  showEstimationEditBtn = false;
  showEstimationDeleteBtn = false;
  showEstimationConvertBtn = false;

  showList: boolean;
  showAddBtn: boolean;
  showEditBtn: boolean;
  showDeleteBtn: boolean;
  showConvertBtn: boolean;
  savedContactPh: boolean;

  user_info = JSON.parse(localStorage.getItem('user_info'));

  isProjectMarketing = false;
  isProjectComplimentary = false;

  public toolbar: ToolbarItems[];
  public mileTaskToolbar : ToolbarItems[];
  commonFields: Object = { text: "value", value: "id"};
  areaData = [
    {
      id: 'sq ft',
      value: 'sq ft'
    },
    {
      id: 'sq m',
      value: 'sq m'
    },
  ]

  @ViewChild('estimationProjectGrid' , {static: false}) public estimationProjectGrid: GridComponent;
  @ViewChild('scopeOfWrkDropDown',{static:false}) public scopeOfWrkDropDown: DropDownListComponent;
  @ViewChild('serviceDropDown',{static:false}) public serviceDropDown: DropDownListComponent;
  @ViewChild('mileTaskDataTableGrid',{static:false}) public mileTaskDataTableGrid: GridComponent;

  estimationProjectData;
  editEstimationDiv = false;
  leadToEstimationData;
  estimationID;
  estimateIDs;
  projectTypeDropDown;
  unitDropDown;
  estimationForm: FormGroup;
  estimationDisForm: FormGroup;
  formSubmitErrorCheck = false;
  customerEntityContact;
  milestoneAndTaskDestails;
  currentTag = null;
  selectAtagError = false;
  tagIsRequired = false;
  tagDuplicateError = false;
  tagDuplicateName;
  taskListDropDown;
  currentTask = null;
  noCurrentTaskError = false;
  tagArrayEmpty = false;

  tagListDropDown;
  anyOnetagIsRequired = false;

  showMileStoneandTaskTable = true;
  costPerHourData;
  vatNumber = 5;
  projectCalculationAmt;
  serviceSelected;
  showSaveBtn = false;
  finalEstimationData;
  prefixString
  convertProjId;
  wrapMilestone;
  allMileStoneTask;
  originalProjectData
  showExtensionDiv = false;


  ismarktSelected = true;
  isComplimentrySelcted = true;
  addntlDtlsExist = false;
  estAddntlData:any;

  constructor(
    public costEstimationService: costEstimationService,
    public settingService: settingsService,
    public userService: UserService,
    public projectService: ProjectService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private router: Router,
    private costService: CostService,
  ) { }

  ngOnInit(){
    this.toolbar = ['Search', 'ExcelExport', 'PdfExport'];
    this.mileTaskToolbar = ['Search'];
    //this.checkUserRights();
    this.FetchAllCostProjectByOrgID();
    this.estimationFormInputs();
    this.estimationDisFormInputs();
    this.checkLocalStorage();
    this.scopeOfWork.valueChanges.subscribe(() => {
      let formValue = this.scopeOfWork.value;
      const uniqueValues = new Set(formValue.map(v => v.tags));
      if(uniqueValues.size < formValue.length) {
        this.tagDuplicateError = true;
      }else{
        this.tagDuplicateError = false;
      }
      this.callTagListing();
      this.showMileStoneandTaskTable = false
      this.showSaveBtn = false;
    });

    this.service.valueChanges.subscribe(() => {
      this.showMileStoneandTaskTable = false;
      this.showSaveBtn = false;
    });


    this.estimationForm.valueChanges.subscribe(() => {
      this.showMileStoneandTaskTable = false;
      this.showSaveBtn = false;
    })

    if(JSON.parse(localStorage.getItem('userRights')).length!=0){
      console.log('if')
      let userRights= JSON.parse(localStorage.getItem('userRights'));
      for(var i=0;i<userRights.length;i++){
        if(userRights[i].module_name=='Estimation'){

         // console.log(userRights[i].module_name)
          if(userRights[i].section_name=='View List' && userRights[i].is_allow==true ){
            this.showEstimationList=true
          }
        else if(userRights[i].section_name=='View List' && userRights[i].is_allow==false ){
          this.showEstimationList=false

        }
        if(userRights[i].section_name=='Add' && userRights[i].is_allow==true ){
          this.showEstimationAddBtn=true
        }
      else if(userRights[i].section_name=='Add' && userRights[i].is_allow==false ){
        this.showEstimationAddBtn=false

      }
      if(userRights[i].section_name=='Edit' && userRights[i].is_allow==true ){
        this.showEstimationEditBtn=true
      }
    else if(userRights[i].section_name=='Edit' && userRights[i].is_allow==false ){
      this.showEstimationEditBtn=false

    }
    if(userRights[i].section_name=='Delete' && userRights[i].is_allow==true ){
      this.showEstimationDeleteBtn=true
    }
    else if(userRights[i].section_name=='Delete' && userRights[i].is_allow==false ){
    this.showEstimationDeleteBtn=false

    }
    if(userRights[i].section_name=='Convert Estimation' && userRights[i].is_allow==true ){
      this.showEstimationConvertBtn=true
    }
    else if(userRights[i].section_name=='Convert Estimation' && userRights[i].is_allow==false ){
    this.showEstimationConvertBtn=false

    }
    console.log('userRights',userRights[i].section_name)

      }

      // else{
      //   this.showEstimationList=true
      //   this.showEstimationAddBtn=true
      //   this.showEstimationEditBtn=true
      //   this.showEstimationDeleteBtn=true
      //   this.showEstimationConvertBtn=true
      // }


    }

    }else{
      console.log('else')
      // this.showEstimationList=true
      //   this.showEstimationAddBtn=true
      //   this.showEstimationEditBtn=true
      //   this.showEstimationDeleteBtn=true
      //   this.showEstimationConvertBtn=true




    }


  }

  checkUserRights(){
    if(this.user_info.is_superadmin){
      this.showEstimationList = true;
      this.showEstimationAddBtn = true;
      this.showEstimationEditBtn = true;
      this.showEstimationDeleteBtn = true;
      this.showEstimationConvertBtn = true;
    }else{
      let postData = { id : this.user_info.role_id };
      this.userService.GetAccessRightsbyRole(postData).subscribe((data:any)=>{
        data.map((item) => {
          item.module_name = item.module_name.replace(/\s+/g, '');;
          return item;
        });
        let commonModuleName = _.groupBy(data, 'module_name');

        console.log(data);
        if(commonModuleName.Estimation){
          commonModuleName.Estimation.map((elm) => {
            if(elm.section_name === 'View List'){
              this.showEstimationList = true
            }
            if(elm.section_name === 'Add'){
              this.showEstimationAddBtn = true
            }
            if(elm.section_name === 'Edit'){
              this.showEstimationEditBtn = true
            }
            if(elm.section_name === 'Delete'){
              this.showEstimationDeleteBtn = true
            }
            if(elm.section_name === 'Convert Estimation'){
              this.showEstimationConvertBtn = true
            }
          });
        }else{
          this.showEstimationList = false;
          this.showEstimationAddBtn = false;
          this.showEstimationEditBtn = false;
          this.showEstimationDeleteBtn = false;
          this.showEstimationConvertBtn = false;
        }
      });
    }
  }

  checkLocalStorage(){
    //reload the page to remove pre design flaw
    setTimeout(() =>{
      if(sessionStorage.getItem('reload')){
        sessionStorage.removeItem('reload');
        window.location.reload();
      }
    }, 3000)

    if(sessionStorage.getItem('Estimation-ID')){
      this.estimationID = sessionStorage.getItem('Estimation-ID');
      this.editEstimation(this.estimationID);
    }
  }


  GetProjectAddtionalDetailsByCstId(estimationID) {
    console.log("this.estimationID--->",estimationID);
    let reqObj = {
        id:estimationID
    }
    this.costEstimationService.GetProjectAddtionalDetailsByCstId(reqObj).subscribe((data: any) => {
      console.log("Project Addtional Details Exist--->",data);
      if(data.length > 0) {
          this.addntlDtlsExist =true;
          this.estAddntlData = data[0];
          this.isProjectComplimentary = data[0].isComplimentary === "true" ? true : false;
          this.isProjectMarketing = data[0].isMarketing === "true" ? true : false;
      } else {
        this.addntlDtlsExist =false;
      }
     // this.estimationProjectData = data;
    });
  }

  //estimation table listing
  FetchAllCostProjectByOrgID() {
    this.costEstimationService.FetchAllCostProjectByOrgID().subscribe((data: any) => {
      this.estimationProjectData = data;
    });
  }

  //edit starts
  editEstimation(estimationID){
    this.estimationID = estimationID;
    this.spinner.show();
    this.GetExtensionsLead(estimationID);
    this.GetProjectTypeByOrgID();
    this.FetchAllUnitDescriptionByOrgID();
    this.FetchCostPerHourOrgID();
    this.editEstimationDiv = true;
    this.costEstimationService.CalculateCostProject({id: estimationID}).subscribe((data: any) => {
      this.leadToEstimationData = data;
      this.GetProjectEstimationService(estimationID);
      
      this.GetProjectAddtionalDetailsByCstId(estimationID);
      this.patchValues();
    });
  }

  GetExtensionsLead(id){
    this.projectService.GetExtensionsLead({id}).subscribe((leaddata: any) => {
      if(leaddata.length !== 0){
        this.projectService.GetExtensionsLeadId({id: leaddata[0].lead_id}).subscribe((data: any) => {
          console.log(data)
          this.originalProjectData = {
            project_id: data[0].project_id,
            projectName: data[0].projectName
          }
          this.showExtensionDiv = true;
        });
      }else{
        this.showExtensionDiv = false;
      }
    });
  }

  patchValues(){
    this.customerEntityContact = this.leadToEstimationData.EntityContact;
    this.estimationForm.patchValue({
      projectName: this.leadToEstimationData.project_name,
      customerName: this.leadToEstimationData.customer_name,
      projectType: this.leadToEstimationData.project_type_id,
      noOfFloors: this.leadToEstimationData.no_of_floors,
      plotSize: this.leadToEstimationData.plot_size,
      plotSizeSq: this.leadToEstimationData.plot_size_unit,
      builtUpArea: this.leadToEstimationData.buildup_area,
      builtUpAreaSq: this.leadToEstimationData.buildup_area_unit,
    });
    this.patchUnitAndTask();
  }

  patchUnitAndTask(){
    if(this.leadToEstimationData.ProjectUnit !== null){
      (this.estimationForm.get('scopeOfWork') as FormArray).clear();
      let scopeOfWorkFormData = this.estimationForm.get('scopeOfWork') as FormArray;
      this.leadToEstimationData.ProjectUnit.map((elm) => {
        elm.ProjectTags.map((elm2) => {
          scopeOfWorkFormData.push(this.formBuilder.group({
            id: elm.unit_id,
			      description: elm.unit_name,
            costUp: elm.unit_qty,
			      notes: elm.note,
            tags: elm2.tags,
          }));
        });
      });
    }

    if(this.leadToEstimationData.ProjectUnitExtra !== null){
      (this.estimationForm.get('service') as FormArray).clear();
      let serviceFormData = this.estimationForm.get('service') as FormArray;
      this.leadToEstimationData.ProjectUnitExtra.map((elm) => {
        let tags = [];
        elm.ProjectTags.map((elm2, indelm2) => {
          tags.push(elm2.tags);

          if(elm.ProjectTags.length === indelm2+1){
            serviceFormData.push(this.formBuilder.group({
              id: elm.unit_id,
              description: elm.unit_name,
              costUp: elm.unit_qty,
              notes: elm.note,
              tags: [tags],
            }));
          }
        });
      });
    }
  }

  changeScopeofWork(event){
    this.currentTag = event.itemData;
    this.selectAtagError = false;
  }

  addTagRow(){
    if(this.currentTag !== null){
      let formData = this.estimationForm.get('scopeOfWork') as FormArray;
      let formValue = formData.value;
      if(formValue.length !== 0){
        let similarTags = [];
        formValue.map((elm, index) => {
          if(elm.id === this.currentTag.id){
            similarTags.push(elm.tags);
          }
          if(formValue.length === index + 1){
            if(similarTags.length !== 0){
              let numberData = [];
              similarTags.map((sim, isim) => {
                let value = isNaN(parseInt(sim.slice(-1))) ? 0 : parseInt(sim.slice(-1));
                numberData.push(value);

                if(similarTags.length === isim+1){
                  let addNum = Math.max(...numberData)
                  let incNum = addNum+1;
                  this.createUnitRow(this.currentTag, incNum);
                }
              });
            }else{
              this.createUnitRow(this.currentTag, 1);
            }
          }
        });
      }else{
        this.createUnitRow(this.currentTag, 1);
      }
    }else{
      this.selectAtagError = true;
    }
  }

  addTagRowSide(tagsData, i){
    if(this.tagIsRequired || this.tagDuplicateError){
      return
    }
    let selectedRowValue = tagsData.value;
    let formData = this.estimationForm.get('scopeOfWork') as FormArray;
    let formValue = formData.value;
    let numberData = [];
    let allUnitTags = []
    formValue.map((elm, index) => {
      allUnitTags.push(elm.tags)
      if(elm.tags.slice(0, -4) === selectedRowValue.description){
        numberData.push(parseInt(elm.tags.slice(-1)));
      }

      if(formValue.length === index + 1){
        if(selectedRowValue.tags.slice(0, -4) === selectedRowValue.description){
          //if description and tags are same
          let addNum = Math.max(...numberData)
          let incNum = addNum+1;
          let patchAt = i + 1;
          let firstObj = {
            id: selectedRowValue.id,
            description: selectedRowValue.description,
            costUp: '',
            notes: '',
            tags: selectedRowValue.description+' -'+' '+incNum
          };
          formValue.splice(patchAt, 0, firstObj);
          this.resetUnitRow(formValue);

          let serviceformData = this.estimationForm.get('service') as FormArray;
          let serviceformValue = serviceformData.value;
          if(serviceformValue.length !== 0){
            this.addTagToService(selectedRowValue.description, incNum)
          }
        }else{
          //if description and tags are different
          numberData = [];
          let tagNotNum = isNaN(parseInt(selectedRowValue.tags.slice(-1)));
          if(tagNotNum){
            allUnitTags.map((elm2, index2) => {
              if(elm2 === selectedRowValue.tags){
                numberData.push(0)
              }else if(elm2.slice(0, -4) === selectedRowValue.tags){
                numberData.push(parseInt(elm2.slice(-1)))
              }

              if(allUnitTags.length === index2 + 1){
                let addNum = Math.max(...numberData);
                let incNum = addNum+1;
                let patchAt = i + 1;
                let firstObj = {
                  id: selectedRowValue.id,
                  description: selectedRowValue.description,
                  costUp: '',
                  notes: '',
                  tags: selectedRowValue.tags+' -'+' '+incNum
                };
                formValue.splice(patchAt, 0, firstObj);
                this.resetUnitRow(formValue);

                let serviceformData = this.estimationForm.get('service') as FormArray;
                let serviceformValue = serviceformData.value;
                if(serviceformValue.length !== 0){
                  this.addTagToService(selectedRowValue.tags, incNum)
                }
              }
            });
          }else{
            allUnitTags.map((elm2, index2) => {
              if(elm2.slice(0, -4) === selectedRowValue.tags.slice(0, -4)){
                numberData.push(parseInt(elm2.slice(-1)))
              }

              if(allUnitTags.length === index2 + 1){
                let addNum = Math.max(...numberData);
                let incNum = addNum+1;
                let patchAt = i + 1;
                let firstObj = {
                  id: selectedRowValue.id,
                  description: selectedRowValue.description,
                  costUp: '',
                  notes: '',
                  tags: selectedRowValue.tags.slice(0, -4)+' -'+' '+incNum
                };
                formValue.splice(patchAt, 0, firstObj);
                this.resetUnitRow(formValue);

                let serviceformData = this.estimationForm.get('service') as FormArray;
                let serviceformValue = serviceformData.value;
                if(serviceformValue.length !== 0){
                  this.addTagToService(selectedRowValue.tags.slice(0, -4), incNum)
                }
              }
            });
          }
        }
      }
    });
  }

  createUnitRow(currentTag, number){
    let formData = this.estimationForm.get('scopeOfWork') as FormArray;
    if(formData.value.length === 0){
      formData.push(this.formBuilder.group({
        id: currentTag.id,
        description: currentTag.value,
        costUp: '',
        notes: '',
        tags: currentTag.value+' -'+' '+number
      }));
      this.scopeOfWrkDropDown.value = null;
    }else{
      let firstObj = [{
        id: currentTag.id,
        description: currentTag.value,
        costUp: '',
        notes: '',
        tags: currentTag.value+' -'+' '+number
      }];
      let finalArray = firstObj.concat(formData.value);
      this.resetUnitRow(finalArray)
    }
    let serviceformData = this.estimationForm.get('service') as FormArray;
    let serviceformValue = serviceformData.value;
    if(serviceformValue.length !== 0){
      this.addTagToService(currentTag.value, number)
    }
  }

  resetUnitRow(value){
    let formData = this.estimationForm.get('scopeOfWork') as FormArray;
    (formData).clear();
    value.map((elm) => {
      formData.push(this.formBuilder.group({
        id: elm.id,
        description: elm.description,
        costUp: elm.costUp,
        notes: elm.notes,
        tags: elm.tags,
      }));
    });
    this.scopeOfWrkDropDown.value = null;
  }

  addTagToService(currentTagValue, num){
    let serviceformData = this.estimationForm.get('service') as FormArray;
    let serviceformValue = serviceformData.value;
    if(serviceformValue.length !== 0){
      serviceformValue.map((elm) => {
        let duplicateTag = elm.tags.filter((dup) => dup === currentTagValue+' -'+' '+num)
        if(duplicateTag.length === 0){
          elm.tags.push(currentTagValue+' -'+' '+num)
        }
      });
    }
  }

  deleteTagRow(data, i){
    let serviceformData = this.estimationForm.get('service') as FormArray;
    let serviceformValue = serviceformData.value;
    if(serviceformValue.length){
      serviceformValue.map((elm, ind) => {
        const index = elm.tags.indexOf(data.tags);
        if(index > -1) {
          elm.tags.splice(index, 1);
        }
        if(serviceformValue.length === ind+1){
          this.scopeOfWork.removeAt(i);
          this.callTagListing();
        }
      });
    }else{
      this.scopeOfWork.removeAt(i);
      this.callTagListing();
    }
  }

  callTagListing(){
    let scopeOfWkformData = this.estimationForm.get('scopeOfWork') as FormArray;
    let scopeOfWkformValue = scopeOfWkformData.value;
    let result = [];
    scopeOfWkformValue.map((elm) => {
      if(elm.tags !== ''){
        result.push({
          id: elm.tags,
          value: elm.tags
        });
      }
    });
    this.tagListDropDown = result;
  }

  returnTagError(data){
    if(data.tags === ''){
      this.tagIsRequired = true;
      return 'Tag name is required'
    }else{
      this.tagIsRequired = false;
    }
  }

  //service task fun
  changeTaskService(event){
    this.currentTask = event.itemData;
    this.noCurrentTaskError = false;
  }

  addTaskRow(){
    this.noCurrentTaskError = false;
    this.tagArrayEmpty = false;
    let scopeOfWorkForm = (this.estimationForm.get('scopeOfWork') as FormArray).value;
    if(scopeOfWorkForm.length === 0){
      this.tagArrayEmpty = true;
    }else if(this.currentTask === null){
      this.noCurrentTaskError = true;
    }else{
      let checkForWrap = this.wrapMilestone.filter((mil) => mil.id === this.currentTask.id);
      if(checkForWrap.length === 0){
        this.addTaskRowContinue();
      }else{
        let mileStoneId = checkForWrap[0].id;
        this.proceedToWrap(mileStoneId)
      }
    }
  }

  proceedToWrap(mileStoneId){
    let serviceformValue = (this.estimationForm.get('service') as FormArray).value;
    let scopeOfWorkForm = (this.estimationForm.get('scopeOfWork') as FormArray).value;
    let tags = [];
    scopeOfWorkForm.map((elm, ind) => {
      tags.push(elm.tags)
      if(scopeOfWorkForm.length === ind+1){
        this.settingService.GetStaticMilestoneTasksByMilestoneID(mileStoneId).subscribe((taskData:any) => {
          taskData.map((task) => {
            let checkDupService = serviceformValue.filter((service) => service.id === task.id);
            if(checkDupService.length === 0){
              this.currentTask = {
                id: task.id,
                value: task.task_name
              }
              this.createServiceRow(this.currentTask, tags)
            }else{
              this.toast.error(task.task_name+' already added')
            }
          });
        });
      }
    });
  }

  addTaskRowContinue(){
    let scopeOfWorkForm = (this.estimationForm.get('scopeOfWork') as FormArray).value;
    let serviceformValue = (this.estimationForm.get('service') as FormArray).value;
    let tags = [];
    scopeOfWorkForm.map((elm, ind) => {
      tags.push(elm.tags)
      if(scopeOfWorkForm.length === ind+1){
        if(serviceformValue.length !== 0){
          let similarTask = []
          serviceformValue.map((ser, indSer) =>{
            if(ser.id === this.currentTask.id){
              similarTask.push(ser.description)
            }
            if(serviceformValue.length === indSer+1){
              if(similarTask.length === 0){
                this.createServiceRow(this.currentTask, tags)
              }else{
                let numberData = [];
                similarTask.map((num, indNum) => {
                  let value = isNaN(parseInt(num.slice(-1))) ? 0 : parseInt(num.slice(-1));
                  numberData.push(value);
                  if(similarTask.length === indNum+1){
                    let addNum = Math.max(...numberData)
                    let incNum = addNum+1;
                    this.createServiceRowWithNum(this.currentTask, tags, incNum)
                  }
                });
              }
            }
          });
        }else{
          this.createServiceRow(this.currentTask, tags)
        }
      }
    });
  }

  addTaskRows(tagsData, i){
    let rowValue = tagsData.value;
    let description = this.allMileStoneTask.filter(elm => elm.id === rowValue.id);
    let patchAt = i + 1;
    let scoOfWkFormValue = (this.estimationForm.get('scopeOfWork') as FormArray).value;
    let tags = [];
    let serviceformValue = (this.estimationForm.get('service') as FormArray).value;
    let similarTask = [];
    scoOfWkFormValue.map((elm, ind) => {
      tags.push(elm.tags)
      if(scoOfWkFormValue.length === ind+1){
        serviceformValue.map((ser, indSer) =>{
          if(ser.id === rowValue.id){
            similarTask.push(ser.description)
          }

          if(serviceformValue.length === indSer+1){
            let numberData = [];
            similarTask.map((num, indNum) => {
              let value = isNaN(parseInt(num.slice(-1))) ? 0 : parseInt(num.slice(-1));
              numberData.push(value);
              if(similarTask.length === indNum+1){
                let addNum = Math.max(...numberData)
                let incNum = addNum+1;
                let firstObj = {
                  id: rowValue.id,
                  description: description[0].value+' - '+incNum,
                  costUp: rowValue.costUp,
                  notes: rowValue.notes,
                  tags: tags
                };
                serviceformValue.splice(patchAt, 0, firstObj);
                this.resetServiceRow(serviceformValue)
              }
            });
          }
        });
      }
    });

  }

  createServiceRow(currentTag, tags){
    let serviceform = this.estimationForm.get('service') as FormArray;
    let serviceformValue = serviceform.value;
    if(serviceformValue.length === 0){
      serviceform.push(this.formBuilder.group({
        id: currentTag.id,
        description: currentTag.value,
        costUp: '',
        notes: '',
        tags: [tags]
      }));
    }else{
      let firstObj = [{
        id: currentTag.id,
        description: currentTag.value,
        costUp: '',
        notes: '',
        tags: tags
      }];
      let finalArray = firstObj.concat(serviceformValue);
      this.resetServiceRow(finalArray)
    }
    this.serviceDropDown.value = null;
  }

  createServiceRowWithNum(currentTag, tags, num){
    let serviceform = this.estimationForm.get('service') as FormArray;
    let serviceformValue = serviceform.value;
    let firstObj = [{
      id: currentTag.id,
      description: currentTag.value+'-'+num,
      costUp: '',
      notes: '',
      tags: tags
    }];
    let finalArray = firstObj.concat(serviceformValue);
    this.resetServiceRow(finalArray)
    this.serviceDropDown.value = null;
  }

  resetServiceRow(value){
    let serviceform = this.estimationForm.get('service') as FormArray;
    (serviceform).clear();
    value.map((elm) => {
      serviceform.push(this.formBuilder.group({
        id: elm.id,
        description: elm.description,
        costUp: elm.costUp,
        notes: elm.notes,
        tags: [elm.tags],
      }));
    });
    this.scopeOfWrkDropDown.value = null;
  }

  //keyup
  tagChangeValue(){
    this.callTagListing();
    let scopeOfWkformValue = (this.estimationForm.get('scopeOfWork') as FormArray).value;
    let serviceformValue = (this.estimationForm.get('service') as FormArray).value;
    let newTags = []
    scopeOfWkformValue.map((elm, ind) => {
      newTags.push(elm.tags)
      if(scopeOfWkformValue.length === ind+1){
        if(serviceformValue.length !== 0){
          serviceformValue.map((elm) => {
            let newValue = newTags.filter(x => !elm.tags.includes(x));
            let oldValue = elm.tags.filter(x => !newTags.includes(x));
            let index = _.findIndex(elm.tags, (e) => {
              return e === oldValue[0];
            }, 0);
            if(index >= 0){
              elm.tags[index] = newValue[0];
            }
          });
        }
      }
    });
  }

  deleteServiceRow(i){
    this.service.removeAt(i);
  }

  returnAnyTagError(data){
    if(data.tags.length === 0){
      this.anyOnetagIsRequired = true;
      return 'At least one Tag is required'
    }else{
      this.anyOnetagIsRequired = false;
    }
  }

  //task deletion
  taskDelete(data){
    console.log(data)
    let postData={
      id:data
    }
    this.costService.RemoveCostProjectByID(postData).subscribe(
      (data:any)  => {
        // let dataObj = JSON.parse(data['token']);
      if(data.status==200){
        this.FetchAllCostProjectByOrgID();
        this.toast.success(data['desc']);
         }
      },
      error  => {
        this.toast.error("Something Went Wrong");
      }
      )
  }

  //calculate btn
  calculateEstimation(){
    this.formSubmitErrorCheck = true;
    if(this.estimationForm.valid){
      this.spinner.show();
      this.formSubmitErrorCheck = false;
      let formValue = this.estimationForm.value;
      let unit = parseFloat(formValue.scopeOfWork.map(item => item.costUp).reduce((prev, next) => prev + next));
      let service = parseFloat(formValue.service.map(item => typeof(item.costUp) === 'string' ?  parseInt(item.costUp) :  item.costUp ).reduce((prev, next) => prev + next));
      let unit_qty_all = (isNaN(unit) ? 0 : unit) + (isNaN(service) ? 0 : service);
      let projectUnit = [];
      console.log("unit",unit);
      console.log("service",service);
      console.log("unit_qty_all)",unit_qty_all);

      formValue.scopeOfWork.map((scpWr, indscpWr) => {
        let scopeObj = {
          id: null,
          org_id: this.leadToEstimationData.org_id,
          project_id: null,
          unit_id: scpWr.id,
          unit_name: scpWr.description,
          no_of_unit: 1,
          unit_qty: scpWr.costUp !== '' ? scpWr.costUp : null,
          unit_qty_all: unit_qty_all,
          note: scpWr.notes,
          is_extra: false,
          modified_date: moment().format('L'),
          modifiedby: this.user_info.id,
          projectDesignType_ID: null,
          projectTags: [
            {
              id: null,
              project_id: null,
              tags: scpWr.tags,
              modified_date: moment().format('L'),
              modifiedby: this.user_info.id
            }
          ]
        }
        projectUnit.push(scopeObj);

        if(formValue.scopeOfWork.length === indscpWr+1){
          formValue.service.map((ser, indser) => {
            let scopeObj = {
              id: null,
              org_id: this.leadToEstimationData.org_id,
              project_id: null,
              unit_id: ser.id,
              unit_name: ser.description,
              no_of_unit: 1,
              unit_qty: ser.costUp !== '' ? ser.costUp : null,
              unit_qty_all: unit_qty_all,
              note: ser.notes,
              total_unit: ser.tags.length,
              is_extra: true,
              modified_date: moment().format('L'),
              modifiedby: this.user_info.id,
              projectDesignType_ID: null
            }

            let projectTags = []
            ser.tags.map((tag, indtag) => {
              projectTags.push({
                id: null,
                project_id: null,
                tags: tag,
                modified_date: moment().format('L'),
                modifiedby: this.user_info.id
              });

              if(ser.tags.length === indtag+1){
                scopeObj['projectTags'] = projectTags;
                projectUnit.push(scopeObj);
              }
            });

            if(formValue.service.length === indser+1){
              let postData = {
                id: this.leadToEstimationData.id,
                user_id: this.leadToEstimationData.user_id,
                org_id: this.leadToEstimationData.org_id,
                cst_id: this.leadToEstimationData.cst_id,
                service_id: this.estimateIDs.serviceId,
                project_type_id: formValue.projectType,
                project_name: formValue.projectName,
                project_prefix: this.leadToEstimationData.project_prefix,
                no_of_floors: formValue.noOfFloors,
                total_unit: formValue.scopeOfWork.length,
                plot_size: formValue.plotSize,
                plot_size_unit: formValue.plotSizeSq,
                buildup_area: formValue.builtUpArea,
                buildup_area_unit: formValue.builtUpAreaSq,
                gross_total_amount: this.projectCalculationAmt.gross_total_amount,
                profit_margin_amount: this.projectCalculationAmt.profit_margin_amount,
                discount_amount: this.projectCalculationAmt.discount_amount,
                total_amount: this.projectCalculationAmt.total_amount,
                vat_amount: this.projectCalculationAmt.vat_amount,
                net_total_amount: this.projectCalculationAmt.net_total_amount,
                createdby: this.user_info.full_name,
                projectUnit: projectUnit,
                entityContact: this.leadToEstimationData.EntityContact
              }
              this.callFinalNewUpdateCostProject(postData)
            }
          });
        }
      });
    }
  }

  callFinalNewUpdateCostProject(postData){
    this.costEstimationService.NewUpdateCostProject(postData).subscribe((data:any) => {
      this.formReset();
      if(data.id){
        this.editEstimation(data.id);
        this.toast.success('Calculated successfully');
      }else{
        this.toast.error('Something went wrong')
      }
    });
  }

  //save
  saveEstimation(){
    this.spinner.show();
    this.costEstimationService.CalculateCostProject({id: this.leadToEstimationData.id}).subscribe((data: any) => {
      let sendObj = {
        "id": data.id,
        "user_id": data.user_id,
        "org_id": data.org_id,
        "cst_id": data.cst_id,
        "project_type_id": data.project_type_id,
        "package_id": data.package_id,
        "project_name": data.project_name,
        "project_prefix": data.project_prefix,
        "no_of_floors": data.no_of_floors,
        "plot_size": data.plot_size,
        "plot_size_unit": data.plot_size_unit,
        "buildup_area": data.buildup_area,
        "buildup_area_unit": data.buildup_area_unit,
        "modifiedby": this.user_info.full_name,
        "typeOfDesign": data.TypeOfDesign,
        "entityContact": data.EntityContact,
        "projectUnit":null,
        "costProjectMilestone":null,
        "total_hours": this.projectCalculationAmt.total_hours,
        "gross_total_amount": data.gross_total_amount,
        "profit_margin_amount": data.profit_margin_amount,
        "discount_amount": data.discount_amount,
        "total_amount": data.total_amount,
        "vat_amount": data.vat_amount,
        "net_total_amount": data.net_total_amount
      }
      this.AddtionalDetailsProj();
      this.costEstimationService.UpdateCostProjectDetails(sendObj).subscribe((resp:any)=>{
        if(resp.id){
          this.NewAddProjectTask(resp.id, data);
          this.editEstimationDiv = false;
          this.formReset();
        }
      });
    });

  }

  //CheckAddtionalDetails 
  AddtionalDetailsProj() {
    //Check the GetFunction  
    //Dont Run this if both (Comp,Marketing) are false
    if(this.addntlDtlsExist) {
      //Call the Update function
      let rqObj =  {
        "id": this.estAddntlData.id,
        "org_id": this.leadToEstimationData.org_id,
        "cost_projectId": this.leadToEstimationData.id,
        "isMarketing": this.isProjectMarketing.toString(),
        "isComplimentary": this.isProjectComplimentary.toString(),
        "createdDate": moment().format('L'),
        "modifiedDate":moment().format('L'),
        "createdByEmpId": this.user_info.id,
        "createdBy": this.user_info.full_name,
        "isDeleted": false
      }
      this.costEstimationService.UpdateProjectAdditionalDetails(rqObj).subscribe((data:any)=>{
        if(data.status === 200) {
          console.log(data.status);
        }
      });
    } else if( (this.isProjectComplimentary != false || this.isProjectMarketing != false) && this.addntlDtlsExist === false) {
      //Add Addtional Details
    let rqObj =  {
      "org_id": this.leadToEstimationData.org_id,
      "cost_projectId": this.leadToEstimationData.id,
      // "projectId": "string",
      "isMarketing": this.isProjectMarketing.toString(),
      "isComplimentary": this.isProjectComplimentary.toString(),
      "createdDate": moment().format('L'),
      "modifiedDate":moment().format('L'),
      "createdByEmpId": this.user_info.id,
      "createdBy": this.user_info.full_name,
      "isDeleted": false
    }
      this.costEstimationService.AddProjectAdditionalDetails(rqObj).subscribe((data:any)=>{
          if(data.status === 200) {
            console.log(data.status);
          }
    });
     }
  }

  //create task at backend
  NewAddProjectTask(estID, data){
    let postData = {
      id: estID,
      org_id: data.org_id,
      project_name: data.project_name,
      project_prefix: data.project_prefix,
      modifiedby: this.user_info.full_name,
      projectUnit: data.ProjectUnit,
      projectUnitExtra: data.ProjectUnitExtra
    }
    this.costEstimationService.NewAddProjectTask(postData).subscribe((data:any) => {
      if(data.status === '200'){
        this.toast.success('Estimation saved');
      }else{
        this.toast.success('Something went wrong');
      }
      this.spinner.hide();
    });
  }

  //get serviceID
  GetProjectEstimationService(estimationID){
    this.costEstimationService.GetProjectEstimationService({id:estimationID}).subscribe((data: any) => {
      this.estimateIDs = data[0];
      this.GetStaticTasksByEstimationId(this.estimateIDs.serviceId);
      this.GetEstimationServiceByOrgId(this.estimateIDs.serviceId)
      this.GetEstimationServiceById(this.estimateIDs.serviceId)
    });
  }

  GetEstimationServiceByOrgId(serviceID){

    this.costEstimationService.GetEstimationServiceByOrgId().subscribe((data: any) => {
      let uniqueService = _.uniqBy(data, 'id');
      let serviceSelected = uniqueService.filter(service => service.id === serviceID);
      this.serviceSelected = serviceSelected[0].serviceName;
    });
  }

  //get sub task by org
  FetchAllUnitDescriptionByOrgID(){
    this.costEstimationService.FetchAllUnitDescriptionByOrgID().subscribe((data: any) => {
      let results = [];
      data.map((elm) => {
        results.push({
          id: elm.id,
          value: elm.unit_name
        });
      });
      this.unitDropDown = results;
    });
  }

  //get task by org
  GetStaticTasksByEstimationId(serviceId){
    this.costEstimationService.GetStaticTasksByEstimationId({id:serviceId}).subscribe((serviceTask: any) => {
      this.costEstimationService.GetWrappedMilestoneByService({id:serviceId}).subscribe((wrapMile: any) =>{
        let taskAndWrapMilestone = [];
        let wrapMilestone = [];
        let allTask = [];

        serviceTask.map((task, t) => {
          allTask.push({
            id: task.id,
            value: task.task_name
          });

          let selectedTask = wrapMile.filter((mil) => mil.id === task.milestone_id)
          if(selectedTask.length === 0){
            taskAndWrapMilestone.push({
              id: task.id,
              value: task.task_name
            });
          }

          if(serviceTask.length === t+1){
            wrapMile.map((mil, m) => {
              taskAndWrapMilestone.push({
                id: mil.id,
                value: mil.milestoneName+' (Milestone - Bundle)'
              });

              wrapMilestone.push({
                id: mil.id,
                value: mil.milestoneName
              });

              if(wrapMile.length === m+1){
                this.allMileStoneTask = allTask;
                this.wrapMilestone = wrapMilestone;
                this.taskListDropDown = taskAndWrapMilestone;
              }
            });
          }
        });
      });
    });
  }

  // Get Serive Milestone Order
  GetEstimationServiceById(serviceID){
    this.costEstimationService.GetEstimationServiceById({id:serviceID}).subscribe((data: any) => {
      let properOrderArr = [];
      this.leadToEstimationData.CostProjectMilestone.map((el, indel) =>{
        const index = data.findIndex(object => {
          return object.milestoneName === el.milestone_name;
        });
        properOrderArr.splice(index, 0, el);

        if(this.leadToEstimationData.CostProjectMilestone.length === indel+1){
          this.leadToEstimationData.CostProjectMilestone = properOrderArr;

          this.leadToEstimationData.CostProjectMilestone.map((elm, indelm) => {
            if(elm.CostProjectTask.length !== 0){
              let qtyArr = [];
              let taskCost = [];
              elm.CostProjectTask.map((elm2, indelm3) => {
                elm2.total_cost_amount = parseFloat(elm2.qty) * this.costPerHourData.cost_per_hour;
                qtyArr.push(parseFloat(elm2.qty));
                taskCost.push(elm2.total_cost_amount);
                if(elm.CostProjectTask.length === indelm3+1){
                  elm.totalHours = qtyArr.reduce((partialSum, a) => partialSum + a, 0);
                  elm.totalCost = taskCost.reduce((partialSum, a) => partialSum + a, 0);
                }
              });
            }else{
              elm.totalHours = 0;
              elm.totalCost = 0;
            }

            if(this.leadToEstimationData.CostProjectMilestone.length === indelm+1){
              let discountValue = this.leadToEstimationData.discount_amount === '' || this.leadToEstimationData.discount_amount === null ? 0 : parseFloat(this.leadToEstimationData.discount_amount);
              let grossAmt = parseFloat(this.leadToEstimationData.CostProjectMilestone.map(item => item.totalCost).reduce((prev, next) => prev + next));

              let discount = discountValue;
              let vat = (this.vatNumber/100) * ((grossAmt * 2) + discount);

              this.projectCalculationAmt = {
                id: this.estimationID,
                createdby: this.user_info.full_name,
                discount_amount: discountValue === 0 ? '' : discountValue,
                total_hours: parseFloat(this.leadToEstimationData.CostProjectMilestone.map(item => item.totalHours).reduce((prev, next) => prev + next)),
                gross_total_amount: grossAmt,
                profit_margin_amount: grossAmt,
                total_amount: (grossAmt * 2) + discount,
                vat_amount: (grossAmt * 2) + discount === 0 ? 0 : vat,
                net_total_amount: ((grossAmt * 2) + discount) + ((grossAmt * 2) + discount === 0 ? 0 : vat)
              }
              this.UpdateCostProjectFinalValueByCostProjectID(this.projectCalculationAmt);
              this.estimationDisForm.patchValue({
                discount_amount: this.projectCalculationAmt.discount_amount
              });

              this.milestoneAndTaskDestails = this.leadToEstimationData.CostProjectMilestone;
              this.showMileStoneandTaskTable = true;
              if(this.leadToEstimationData.ProjectUnit !== null){
                this.showSaveBtn = true;
              }
              this.spinner.hide();
            }
          });
        }
      });
    });
  }

  addDiscount(){
    let discountForm = this.estimationDisForm.value;
    let discountValue = discountForm.discount_amount === null ? '' : discountForm.discount_amount;
    let grossAmt = parseFloat(this.leadToEstimationData.CostProjectMilestone.map(item => item.totalCost).reduce((prev, next) => prev + next));
    let grossHrs = parseFloat(this.leadToEstimationData.CostProjectMilestone.map(item => item.totalHours).reduce((prev, next) => prev + next))

    let discount = discountValue !== '' ? ((grossAmt * 2) + discountValue >= 0 ? discountValue : 0) : 0;
    let totalAmt = (grossAmt * 2) + discount;
    let vat = (this.vatNumber/100) * totalAmt;

    this.projectCalculationAmt = {
      id: this.estimationID,
      createdby: this.user_info.full_name,
      discount_amount: discount,
      total_hours: grossHrs,
      gross_total_amount: grossAmt,
      profit_margin_amount: grossAmt,
      total_amount: totalAmt,
      vat_amount: vat,
      net_total_amount: totalAmt + vat
    }
    this.UpdateCostProjectFinalValueByCostProjectID(this.projectCalculationAmt);

    if(!((grossAmt * 2) + discountValue >= 0)){
      this.toast.error('Discount can not be greater than total amount')
      this.estimationDisForm.patchValue({
        discount_amount: 0
      });
    }
  }

  UpdateCostProjectFinalValueByCostProjectID(postData){
    this.costEstimationService.UpdateCostProjectFinalValueByCostProjectID(postData).subscribe((data:any) => {
      if(data.status === '200'){
        if(this.projectCalculationAmt.discount_amount !== ''){
          this.UpdateCostProjectDiscountAndProfitMarginByProjectID();
        }
      }else{
        this.toast.error('Value Not Updated')
      }
    });
  }

  UpdateCostProjectDiscountAndProfitMarginByProjectID(){
    let postData = {
      id: this.estimationID,
      discount_amount: this.projectCalculationAmt.discount_amount,
      profit_margin_amount: this.projectCalculationAmt.profit_margin_amount,
      createdby: this.user_info.full_name,
    }
    this.costEstimationService.UpdateCostProjectDiscountAndProfitMarginByProjectID(postData).subscribe((data:any) => {
      if(data.status !== '200'){
        this.toast.error('Discount Not Updated')
      }
    });
  }

  GetProjectTypeByOrgID() {
    this.costEstimationService.GetProjectTypeByOrgID().subscribe((data: any) => {
      let results = [];
      data.map((elm) => {
        results.push({
          id: elm.id,
          value: elm.type_name
        });
      });
      this.projectTypeDropDown = results;
    });
  }

  FetchCostPerHourOrgID(){
    this.costEstimationService.FetchCostPerHourOrgID().subscribe((data:any) => {
      data[0].cost_per_hour = parseFloat(data[0].cost_per_hour);
      this.costPerHourData = data[0];
    });
  }

  goBackToListing(){
    if(this.editEstimationDiv){
      this.editEstimationDiv = false;
      this.formReset();
      this.showExtensionDiv = false;
    }else{
      window.history.go(-1);
      sessionStorage.clear();
    }
  }

  formReset(){
    this.estimationDisForm.reset();
    this.estimationForm.reset();
    (this.estimationForm.get('scopeOfWork') as FormArray).clear();
    (this.estimationForm.get('service') as FormArray).clear();
    this.currentTag = null;
    this.selectAtagError = false;
    this.tagIsRequired = false;
    this.tagDuplicateError = false;
    this.anyOnetagIsRequired = false;
    this.showMileStoneandTaskTable = true;
    this.currentTask = null;
    this.noCurrentTaskError = false;
    this.tagArrayEmpty = false;
    this.formSubmitErrorCheck = false;
    sessionStorage.removeItem('Estimation-ID');
    this.FetchAllCostProjectByOrgID();
  }

  /* taskDelete(data){
    console.log(data)

    let postData={
      id:deptId
    }
    this.costService.RemoveCostProjectByID(postData).subscribe(
      (data:any)  => {
        // let dataObj = JSON.parse(data['token']);

      if(data.status==200){
        this.GetPriorityByOrgID();

        this.toastr.error(data['desc'], undefined,{
          positionClass: 'toast-top-center'
     });
    }
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
  } */

  ConvertToQtn(id){
    this.spinner.show();
    $('#confirm_Convert_modal').modal('show');
    this.convertProjId = id;
    this.costEstimationService.FindByCostProjectID({id: id}).subscribe((data: any) => {
      data.gross_total_amount = parseFloat(data.gross_total_amount);
      data.profit_margin_amount = parseFloat(data.profit_margin_amount);
      this.finalEstimationData = data;
      this.spinner.hide();
    });
  }

  convertEstimationToOtn(){
    this.spinner.show();
    this.costEstimationService.GetLastAddedQuotationPrefixByOrgID().subscribe((data: any) => {
      if(data.code === ""){
        this.costEstimationService.GetAllPrefixByOrgID().subscribe((newData:any) => {
          newData.map((elm, indElm1)=>{
            if(elm.type === "qtn"){
              let prefix_name = elm.prefix_name;
              let splittable =  prefix_name.split('/');
              if(parseInt(splittable[3]).toString().length == 1) {
                let jobNo = '0000'
                this.prefixString = splittable[0] +'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
              }
            }

            if(newData.length === indElm1+1){
              this.AddQtn();
            }
          });
        });
      }else{
        let lastAddedprefix = data.code;
        let lastAddprefixSplit = lastAddedprefix.split('/').pop();
        this.costEstimationService.GetAllPrefixByOrgID().subscribe((newData:any) => {
          newData.map((elm, indElm2)=>{
            if(elm.type === "qtn"){
              let prefix_name = elm.prefix_name;
              let splittable =  prefix_name.split('/');
              if(parseInt(lastAddprefixSplit).toString().length == 1) {
                let jobNo = '000' + (parseInt(lastAddprefixSplit) + 1)
                this.prefixString = splittable[0] +'/'+moment().format('YY')+'/'+ moment().format('MM') + '/' +jobNo ;
              }else if (parseInt(lastAddprefixSplit).toString().length == 2) {
                let jobNo = '00' + (parseInt(lastAddprefixSplit) + 1)
                this.prefixString = splittable[0] +'/'+ moment().format('YY')+'/'+ moment().format('MM') + '/' + jobNo;
              }else if (parseInt(lastAddprefixSplit).toString().length == 3) {
                let jobNo = '0' + (parseInt(lastAddprefixSplit) + 1)
                this.prefixString = splittable[0] +'/'+ moment().format('YY')+'/'+  moment().format('MM') + '/' + jobNo;
              }else {
                let jobNo = (parseInt(lastAddprefixSplit) + 1)
                this.prefixString = splittable[0] +'/'+ moment().format('YY')+'/'+  moment().format('MM') + '/' + jobNo;
              }
            }

            if(newData.length === indElm2+1){
              this.AddQtn();
            }
          });
        });
      }
    });
  }

  AddQtn(){
    let postData = {
      org_id: this.user_info.org_id,
      lead_id: this.convertProjId,
      quotation_prefix: this.prefixString,
      quotation_date: moment().format('L'),
      customer_id: this.finalEstimationData.entityCustomer.id,
      project_name: this.finalEstimationData.project_name,
      createdby: this.user_info.full_name,
    }

    this.costEstimationService.AddQuotation(postData).subscribe((data: any) =>{
      if(data.status === '200'){
        this.updateQtnStatus(this.convertProjId);
      }
      this.closeConvertToQtn();
    })
  }

  updateQtnStatus(id){
    let postData={
      id: id,
      is_quotation: true,
      createdby: this.user_info.full_name
    }
    this.costEstimationService.UpdateIsQuotationByCostProjectID(postData).subscribe((data:any) => {
      if(data.status === '200')
      this.toast.success('Added to quotation');
      this.router.navigate(['/quotation']);
    })
  }

  closeConvertToQtn(){
    $('#confirm_Convert_modal').modal('hide');
  }

  estimationFormInputs(){
    this.estimationForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      projectType: [''],
      noOfFloors: ['', Validators.required],
      plotSize: [''],
      builtUpArea: [''],
      plotSizeSq: [''],
      builtUpAreaSq: [''],
      customerName: [{ value: '', disabled: true }],
      scopeOfWork: this.formBuilder.array([], [Validators.required]),
      service: this.formBuilder.array([], [Validators.required])
    });
  }

  get scopeOfWork(): FormArray {
		return this.estimationForm.get('scopeOfWork') as FormArray;
	}

  get service(): FormArray {
		return this.estimationForm.get('service') as FormArray;
	}

  estimationDisFormInputs(){
    this.estimationDisForm = this.formBuilder.group({
      discount_amount: ['']
    });
  }

  estPrjTableToolbarClick(args: ClickEventArgs): void {
    switch (args.item.text) {
      case 'PDF Export':
          this.estimationProjectGrid.pdfExport();
          break;
      case 'Excel Export':
          this.estimationProjectGrid.excelExport();
          break;
      case 'CSV Export':
          this.estimationProjectGrid.csvExport();
      break;
    }
  }

  estPrjTableSearchKeyUp(): void {
    document.getElementById(this.estimationProjectGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.estimationProjectGrid.search((event.target as HTMLInputElement).value)
    });
  }

  mileTaskSearchKeyUp(): void {
    document.getElementById(this.mileTaskDataTableGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.mileTaskDataTableGrid.search((event.target as HTMLInputElement).value)
    });
  }

  toProjectLayout(id){
    localStorage.setItem('project_id',id);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/project-layout-new'])
    );
    window.open(url, "_blank");
  }

  onMarketingAdded(e) {
    console.log(e.srcElement.checked)

   // isProjectMarketing = false;
   // isProjectComplimentary = false;
   if(e.srcElement.checked) {
    //Display Sweet Alert
    Swal.fire({
      title: 'Are you sure ?',
      text: 'Click Confirm to add Project as Marketing Project',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        ' Confirm',
      cancelButtonText:
        'Cancel',
    }).then((result) => {
      if(result.value === true){
        this.isProjectMarketing = true;
        this.isProjectComplimentary = this.isProjectComplimentary === true ?  false : this.isProjectComplimentary 
        this.estimationDisForm.patchValue({
          discount_amount: -(this.projectCalculationAmt.gross_total_amount * 2)
        });
       this.addDiscount();

    
      } else if(result.dismiss != undefined)  {
        this.isProjectMarketing = false;
        e.srcElement.checked = false;
        this.estimationDisForm.patchValue({
          discount_amount: 0
        });
       this.addDiscount();
      }
    });
   } else {
    this.isProjectMarketing = false;
    this.estimationDisForm.patchValue({
      discount_amount: 0
    });
   this.addDiscount();
   }
   

  }

  onComplimentryAdded(e) {
    //console.log(e);

    if(e.srcElement.checked) {
      //Display Sweet Alert
      Swal.fire({
        title: 'Are you sure ?',
        text: 'Click Confirm to add Project as Complimentary',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
          ' Confirm',
        cancelButtonText:
          'Cancel',
      }).then((result) => {

      
        if(result.value === true){
          this.isProjectComplimentary = true; // isProjectMarketing
          this.isProjectMarketing = this.isProjectMarketing === true ?  false : this.isProjectMarketing;
          this.estimationDisForm.patchValue({
            discount_amount: -(this.projectCalculationAmt.gross_total_amount * 2)
          });
         this.addDiscount();
        } else if(result.dismiss != undefined)  {
          this.isProjectComplimentary = false;
          this.estimationDisForm.patchValue({
            discount_amount: 0
          });
          this.addDiscount();
          e.srcElement.checked = false;
        }
      });
     } else {
      this.estimationDisForm.patchValue({
        discount_amount: 0
      });
      this.addDiscount();
      this.isProjectComplimentary = false;
     }








  }

}
