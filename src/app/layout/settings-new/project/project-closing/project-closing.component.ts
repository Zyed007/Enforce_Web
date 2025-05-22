import { Component, OnInit , ViewChild } from '@angular/core';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids'
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ProjectService } from '../../../../services/project.service';
import { ModuleSetupService } from '../../../../services/moduleSetup.service';
import Swal from 'sweetalert2';
import { Select2OptionData, Select2TemplateFunction } from 'ng2-select2';
import moment = require('moment');
import { E } from '@angular/cdk/keycodes';
declare var $: any;

@Component({
  selector: 'app-project-closing',
  templateUrl: './project-closing.component.html',
  styleUrls: ['./project-closing.component.scss']
})
export class ProjectClosingComponent implements OnInit {

    currentClsID : '';
    prjtListing = true;
    addClosingStepFrm: FormGroup;
    editClosingStepSrvId;
    currentUser = JSON.parse(localStorage.getItem('user_info'));
    orgID = this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id');
    // addMilestoneNmeFrm: FormGroup;
    newMilestone = false;
    showMilestoneTaskTable = false;
    @ViewChild('closingServGrid' , {static: false}) public closingServGrid: GridComponent;
    public roleData:Array<Select2OptionData>;
    public approverDt:Array<Select2OptionData>;
    public deptOptions:Select2Options;
    //rolesData = [];
    // [{ id: '', text: 'Select Role' }];

    closingStepsServ = [
        // {
        //     id: "jgasjdasdsakdhkk1212121jl",
        //     closingstepName : "Interior Project Closing Plan",
        //     numberofSteps : 5,
        //     createdDate : new Date(),
        //     createdBy : "Sazid Khan",
        // },

    ]
    employeeGridToolItems: ToolbarItems[];
    editMdSelected = false;
    deletedTsk = [];




  constructor(
    public Router :Router,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private moduleSetupService:ModuleSetupService
  ) { }

  ngOnInit() {

    this.deptOptions={
      placeholder: { id: '  ', text: 'Select Role' }, 
      allowClear: true,
      width:'100%'
    }
    //this.addMilestoneNmeFrmInputs();
    this.employeeGridToolItems = ['Search'];
    //this.fetchRolesData();
   // this.fetchApprovesDt();
    this.fetchExistingClosingSteps();
  }


  addProjectClsSteps(){
        this.addClosingServFormInputs();
        this.currentClsID = null;
        this.prjtListing = false;
        this.newMilestone = true;
  }



  
  //Add milestone Model all function
  addMilestoneModel(){
    $("#Add_Mlstn_modal").modal('show');
   // this.getAllMilestoneByOrg();
  }



  addClosingServFormInputs(){
    this.addClosingStepFrm = this.formBuilder.group({
      serTermName: ['', Validators.required],
    //   isDefault: [false],
    //  milestone: ['', Validators.required],
      taskList: this.formBuilder.array([],[Validators.required])
    });
  }



  backToProject(){
    this.Router.navigate(['settings-new/project']);
    this.editMdSelected = false;
  }

  closeAddEditListing() {
    this.prjtListing = true;
    this.editMdSelected = false;
  }


  addNewTask() {
    let newMem = this.addTaskListFrmInput();
    this.taskList.push(newMem);
  }

  deleteTaskRow(i: number) {
    if(this.editMdSelected) {
       
        let tskList = this.addClosingStepFrm.get('taskList') as FormArray;

        console.log(tskList.value[i]);
        this.deletedTsk.push({...tskList.value[i],  isDeleted:true });
        this.taskList.removeAt(i);
       
    }else {
      this.taskList.removeAt(i);
    }

  }

  get taskList(): FormArray {
    return this.addClosingStepFrm.get('taskList') as FormArray;
  }

  addTaskListFrmInput(){
    return this.formBuilder.group({
      taskName: ['', [Validators.required]],
      taskDescription: [''],
      // assignRoleId: ['', [Validators.required]],
      // accessType: ['fullAccess'],
      // approverlvlone: [''],
      // approverlvltwo: [''],
    });
  }


  retureHrsMinConvertedDecimal(item: any, i){
    let getValue = item.value;
    let hours = getValue.taskHours === '' || getValue.taskHours === null ? 0 : parseFloat(getValue.taskHours);
    let minutes = getValue.taskMinutes === '' || getValue.taskMinutes === null ? 0 : parseFloat(getValue.taskMinutes);
    let totalMinutes = (hours * 60) + minutes;
    let timeConverted = parseFloat((totalMinutes / 60).toFixed(2));
    // console.log("timeConverted--->",timeConverted);
    this.taskList.at(i).patchValue({
      timeConverted: timeConverted
    });
  }

  checkRowToDisable(){
    let formValue = this.addClosingStepFrm.controls['taskList'].value;
    if(formValue.length === 1){
      return true
    }else{
      return false
    }
  }


  serviceSearchKeyUp(): void {
    document.getElementById(this.closingServGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.closingServGrid.search((event.target as HTMLInputElement).value)
    });
  }

  saveMileStone(){
    console.log("Milestone Saved");
  }


  public fetchApprovesDt() {
    this.moduleSetupService.GetAllSectionApproversByOrgID().subscribe((data: any) => {
         var filtDt = data.filter(el => el.module_id === 'ae3c96f7-cd3c-4796-a5c1-81067d8a7b78'  && el.section_id === 'a71b7687-0c30-45a4-aa0e-e9d281f0e351');
        var aprvDt =    [{ id: '', text: 'Select Role' }];
          console.log('filtDt--->',filtDt);
          for (var i = 0; i < filtDt.length; i++) {
            // logik to create new items
    
            aprvDt.push({
                "id": filtDt[i].id,
                "text": filtDt[i].role_name
            });
    
            }
          //  console.log('aprvDt--->',aprvDt);
            this.approverDt = aprvDt;

        
          if(this.approverDt.length === 0) {
            console.log("Show An Error Message in Case No Approvers Are Present");
          }
    });
  }


  selectAccessType(selValue,index) {
    let tskList = this.addClosingStepFrm.get('taskList').value;
    console.log( ' Selected Value--->',tskList);
  }

  public fetchRolesData(){
    this.moduleSetupService.GetAllRoleModulesByOrgID().subscribe(
      (data:any)  => {
        var results = [{ id: '', text: 'Select Role' }];
            
        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          results.push({
              "id": data[i].id,
              "text": data[i].role_name
          });
          }
          this.roleData =results;
      }
      )
  }


  saveClosingSteps() {

  

    let frmValue =  this.addClosingStepFrm.value;
    
 


      let reqObj = {};
      let tskArr = [];

      reqObj['tempName'] = frmValue.serTermName;
      reqObj['description'] = frmValue.serTermName;
      reqObj['org_id'] = this.orgID;
      reqObj['createdDate'] =  moment().format('L');
      reqObj['modifiedDate'] = moment().format('L');
      reqObj['createdByEmpId'] = this.currentUser.id;
      reqObj['createdBy'] = this.currentUser.full_name;
      reqObj['isDeleted'] = false;
     

      if(frmValue.taskList.length > 0) {
        frmValue.taskList.map((el:any) =>{
              tskArr.push({
                "id":el.id ? el.id : null,
                 "name": el.taskName,
                "description": el.taskName,
                // "accessType": el.accessType,
                // "assignRoleId": el.assignRoleId,
                // "approverlvlone": el.approverlvlone.length > 0 ?  el.approverlvlone : null,
                // "approverlvltwo":  el.approverlvltwo.length > 0 ?  el.approverlvltwo : null,
                "createdDate":  moment().format('L'),
                "modifiedDate":  moment().format('L'),
                "createdbyEmpId": this.currentUser.id,
                "modifiedbyEmpId": this.currentUser.id,
                 "isDeleted": false
                })
        })
      }

    

     // console.log('Request object-->',reqObj);

     if(this.editMdSelected === true) {
      reqObj['id'] = this.editClosingStepSrvId;
      //tskArr.concat(this.deletedTsk);
      this.deletedTsk.map((el)=>{
        tskArr.push(el)
      })
      
      
      reqObj['closingTaskDetails'] = tskArr;
     
     
    // console.log('reqObj --->',reqObj);
     //UpdateProjectClosingTsk

     this.projectService.UpdateProjectClosingTsk(reqObj).subscribe((data:any) => {
      if(data.status === '200'){
       // this.GetAllPrefixByOrgID();
       this.fetchExistingClosingSteps();
       this.closeAddEditListing();
        this.toast.success(data.desc)
      }else{
        this.toast.error('Something went wrong')
      }
     });

    } else {
      reqObj['closingTaskDetails'] = tskArr;
      this.projectService.AddProjectClosingTsk(reqObj).subscribe((data:any) => {
        if(data.status === '200'){
         // this.GetAllPrefixByOrgID();
         this.closeAddEditListing();
          this.toast.success(data.desc)
        }else{
          this.toast.error('Something went wrong')
        }
       });
    }


  }

  assigntskRl(value,index) {
    console.log(value,index);
    let tskList = this.addClosingStepFrm.get('taskList') as FormArray;
    tskList.at(index).patchValue({
      assignRoleId:value.value
    })
  }


  levelOneAssign(value,index) {
   // console.log('value,index',value,index);
    let tskList = this.addClosingStepFrm.get('taskList') as FormArray;
    if( tskList.value[index].accessType === "dual" &&    tskList.value[index].approverlvltwo === value.value) {
      Swal.fire(
        'Error!',
        "Same Role Cannot be assigned to Level 1 & Level 2",
        'error'
      ).then(
        //used Arrow function here
        (result)=> {
            if(result.value) {
              console.log(result);
              tskList.at(index).patchValue({
                approverlvlone:""
                })
            }
          
        }
        )
    } else {
      tskList.at(index).patchValue({
        approverlvlone:value.value
      })
    }
    
  }

  levelTwoAssign(value,index) {
   
    let tskList = this.addClosingStepFrm.get('taskList') as FormArray;
    if( tskList.value[index].accessType === "dual" &&  tskList.value[index].approverlvlone === value.value) {
      Swal.fire(
        'Error!',
        "Same Role Cannot be assigned to Level 1 & Level 2",
        'error'
      ).then(
        //used Arrow function here
        (result)=> {
           
            if(result.value) {
              console.log(result);
              tskList.at(index).patchValue({
                  approverlvltwo:""
                })
            }
          
        }
        )
       
    } else {
      tskList.at(index).patchValue({
        approverlvltwo:value.value
      })
    }

  }



  fetchExistingClosingSteps() {
    this.projectService.GetAllClosingStepsByOrgID().subscribe((data:any) => {
        if(data != null) {
          this.closingStepsServ = data;
        } else {
          this.closingStepsServ = [];
        }
    });
  }



   //edit service
   editTmplt(editServiceData){
    //this.addClosingStepFrm.reset();
    this.addClosingServFormInputs();
   this.addTaskListFrmInput();
  
    this.spinner.show();
    this.editClosingStepSrvId = editServiceData.id;
    var tskArr = [];


    let tskList = this.addClosingStepFrm.get('taskList') as FormArray;
    


    this.addClosingStepFrm.patchValue({
      serTermName: editServiceData.tempName ,
    });


    
    editServiceData.closingTaskDetails.map((el,i)=>{
     

      tskList.push(this.formBuilder.group({
        id:el.id,
        taskName: el.name,
         taskDescription: el.description,
         assignRoleId: el.assignRoleId,
         accessType: el.accessType,
         approverlvlone: el.approverlvlone ? el.approverlvlone  : "" ,
        approverlvltwo: el.approverlvltwo ? el.approverlvltwo  : "",

      }));

    //   let tskList = this.addClosingStepFrm.get('taskList') as FormArray;
    tskList.at(i).patchValue({
      assignRoleId: el.assignRoleId
    })




    })



    //console.log(taskList.controls[i].get('assignRoleId'))
    this.prjtListing = false;
    this.editMdSelected = true;
    this.spinner.hide();
  }


}