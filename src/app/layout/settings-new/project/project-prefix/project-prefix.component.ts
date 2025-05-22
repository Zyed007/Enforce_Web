import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ProjectService } from '../../../../services/project.service';
import Swal from 'sweetalert2';
import moment = require('moment');
//js
declare var $: any;


@Component({
  selector: 'app-project-prefix',
  templateUrl: './project-prefix.component.html',
  styleUrls: ['./project-prefix.component.scss']
})
export class ProjectPrefixComponent implements OnInit {

  formattedPrefixDate = moment().format('YY/MM');
  formattedPrefix: string;
  inputType;
  mainProjectPrefListing = true;
  projectPrefixForm: FormGroup;
  editProjectPrefixDiv = false;
  currentUser = JSON.parse(localStorage.getItem('user_info'));
  prefixTxtError = false;
  sequenceNumberError = false;
  allProjectPrefixData;
  editProjectPrefixData;
  example;
  exampletxt;
  disableSeqNum = true;
  showInputOpt = true;
  type = 'project';
  projectPrefixActivities;
  projectActvits  = null;
  prefixhistDt = [];


  updateProjectprefix = false;
  updateCompProjectprefix = false;
  updateMarkProjectprefix = false;

   //For Complimentary Project
  compprojectPrefixForm: FormGroup;
  compformattedPrefix: string;
  compinputType;
  compdisableSeqNum =  true;
  compshowInputOpt = true;
  cmpprefixTxtError = false;
  cmpsequenceNumberError = false;
  existCompPrefix = [];
  exampleComp;
  exampletxtComp;
  projectActvitsCmp  = null;


  //For Marekting Project
  marprojectPrefixForm: FormGroup;
  marformattedPrefix: string;
  marinputType;
  marpdisableSeqNum =  true;
  marpshowInputOpt = true;
  marprefixTxtError = false;
  marsequenceNumberError = false;
  existMarkPrefix = [];
  exampleMRP;
  exampletxtMRP;
  projectActvitsMrp  = null;



  constructor(
    public Router :Router,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.projectPrefixFormInputs();
    this.compprojectPrefixFormInputs();
    this.marprojectPrefixFormInputs();
    this.setupCompPrefix();
    this.marCompPrefix();
    this.GetAllPrefixByOrgID();
  }

  setupCompPrefix() {
    this.compprojectPrefixForm.patchValue({
      compprefixFor: 'Default'
    });
    this.compchangePrefixFor();
    this.exampleComp = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
    this.exampletxtComp = 'Eg: ENQ/20/08/0001,ENQ/20/08/0002';



  }

  marCompPrefix() {
    this.marprojectPrefixForm.patchValue({
      marprefixFor: 'Default'
    });
    this.marchangePrefixFor();

    this.exampletxtMRP = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
    this.exampleMRP = 'Eg: ENQ/20/08/0001,ENQ/20/08/0002';
  }

  GetAllPrefixByOrgID(){
   this.existCompPrefix = [];
   this.existMarkPrefix = [];
    this.projectService.GetAllPrefixByOrgID().subscribe((data:any) => {
      let result = []
      data.map((elm, ind) => {
        if(elm.type === this.type ){
          result.push(elm)
        }
        // elm.type == 'project-complimentary'
        if(elm.type == 'project-complimentary') {
          this.existCompPrefix.push(elm);
        }
        if(elm.type == 'project-marketing') {
          this.existMarkPrefix.push(elm);
        }

        if(data.length === ind + 1){
          this.allProjectPrefixData = result;
        }
      });
    });
  }

  openProjectPrefix(){
    this.mainProjectPrefListing = false;
    this.projectPrefixForm.patchValue({
      prefixFor: 'Default'
    });
    this.formattedPrefix = this.formattedPrefixDate+'/0000';
    this.inputType = 'text';
    this.disableSeqNum = true;
    this.showInputOpt = true;
    this.exampletxt = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
    this.example = 'Eg: ENQ/20/08/0001,ENQ/20/08/0002';
    this.GetProjectPrefixActivitiesByOrgId();
  }



  openEditOption(type) {

    if(type === 'project') {
      this.updateProjectprefix = true;
    }   
    else if(type === 'project-comp') {
      this.updateCompProjectprefix = true;
    }
    else if(type === 'project-mar') {
      this.updateMarkProjectprefix = true;
    }


  }

  cancelEditOption(type) {

    if(type === 'project') {

      this.updateProjectprefix = false;
    }   
    else if(type === 'project-comp') {
      this.updateCompProjectprefix = false;
    }
    else if(type === 'project-mar') {
      this.updateMarkProjectprefix = false;
    }


  }


  editSingleProjectPre(data){
 
    this.spinner.show();
    this.GetProjectPrefixActivitiesByOrgId();
    this.updateProjectprefix = false;
    this.updateCompProjectprefix = false;
    this.updateMarkProjectprefix = false;

    this.editProjectPrefixDiv = true;
    this.editProjectPrefixData = data;
    this.mainProjectPrefListing = false;
    this.projectPrefixForm.patchValue({
      prefix: this.editProjectPrefixData.prefix_ext,
      prefixFor: this.editProjectPrefixData.prefix_for
    });




    if(this.editProjectPrefixData.prefix_for === 'Custom'){
      this.formattedPrefix = '';
      this.disableSeqNum = true;
      this.showInputOpt = false;
      this.exampletxt = 'The user may enter a custom ID by choosing the custom option.';
      this.example = 'For example, JOB/AE12345';
    }else if(this.editProjectPrefixData.prefix_for === 'Sequence'){
      let lastAddprefixSplit = this.editProjectPrefixData.prefix_name.split('/').pop();
      this.formattedPrefix = lastAddprefixSplit;
      this.disableSeqNum = false;
      this.showInputOpt = true;
      this.exampletxt = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.';
      this.example = 'For example, Inc/1.';
    }else{
      this.formattedPrefix = this.formattedPrefixDate+'/0000';
      this.exampletxt = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
      this.example = 'For example, ENQ/20/08/0004,ENQ/20/08/0001';
      this.disableSeqNum = true;
      this.showInputOpt = true;
    }
    // Check Prefix For Complimentary Added

   // let prjtxPrefix = this.allProjectPrefixData.filter((el)=> el.)

    if(this.existCompPrefix.length > 0) {

      this.compprojectPrefixForm.patchValue({
        compprefix: this.existCompPrefix[0].prefix_ext,
        compprefixFor: this.existCompPrefix[0].prefix_for
      });

      if(this.existCompPrefix[0].prefix_for === 'Custom'){
        this.compformattedPrefix = '';
        this.compdisableSeqNum = true;
        this.compshowInputOpt = false;
        this.exampletxtComp = 'The user may enter a custom ID by choosing the custom option.';
        this.exampleComp = 'For example, JOB/AE12345';
      }else if(this.existCompPrefix[0].prefix_for === 'Sequence'){
        let lastAddprefixSplit = this.existCompPrefix[0].prefix_name.split('/').pop();
        this.compformattedPrefix = lastAddprefixSplit;
        
        this.compdisableSeqNum = false;
        this.compshowInputOpt = true;
        this.exampletxtComp = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from. Note: If a complimentary project is an extension of a main project, the prefix will be assigned in the same order as the main project.';
        this.exampleComp= 'For example, Inc/1.';
      } else if(this.existCompPrefix[0].prefix_for  === 'Project-Sequence'){
        this.compchangePrefixFor();
      }
      else{
        this.compformattedPrefix = this.formattedPrefixDate+'/0000';
        this.exampletxtComp = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.Note: If a complimentary project is an extension of a main project, the prefix will be assigned in the same order as the main project.'
        this.exampleComp = 'For example, ENQ/20/08/0004,ENQ/20/08/0001';
        this.compdisableSeqNum = true;
        this.compshowInputOpt = true;
      }

    }

    if(this.existMarkPrefix.length > 0) {

      this.marprojectPrefixForm.patchValue({
        marprefix: this.existMarkPrefix[0].prefix_ext,
        marprefixFor: this.existMarkPrefix[0].prefix_for
      });

      if(this.existMarkPrefix[0].prefix_for === 'Custom'){
        this.marformattedPrefix = '';
        this.marpdisableSeqNum = true;
        this.marpshowInputOpt = false;
        this.exampletxtMRP = 'The user may enter a custom ID by choosing the custom option.';
        this.exampleMRP = 'For example, JOB/AE12345';
      }else if(this.existMarkPrefix[0].prefix_for === 'Sequence'){
        let lastAddprefixSplit = this.existMarkPrefix[0].prefix_name.split('/').pop();
        this.marformattedPrefix = lastAddprefixSplit;
        this.marpdisableSeqNum = false;
        this.marpshowInputOpt = true;
        this.exampletxtMRP = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.Note: If a Marketing project is an extension of a main project, the prefix will be assigned in the same order as the main project.';
        this.exampleMRP = 'For example, Inc/1.';
      }
      else if(this.existCompPrefix[0].prefix_for  === 'Project-Sequence'){
        this.marchangePrefixFor();
      }
      else{
        this.marformattedPrefix = this.formattedPrefixDate+'/0000';
        this.exampletxtMRP = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month. Note: If a Marketing project is an extension of a main project, the prefix will be assigned in the same order as the main project.'
        this.exampleMRP = 'For example, ENQ/20/08/0004,ENQ/20/08/0001';
        this.marpdisableSeqNum = true;
        this.marpshowInputOpt = true;
      }


    }

    this.spinner.hide();
  }

  changePrefixFor(){
    let value = this.projectPrefixForm.get('prefixFor').value;
    if(value === 'Custom'){
      this.formattedPrefix = '';
      this.projectPrefixForm.patchValue({
        prefixFor: 'Custom'
      });
      this.disableSeqNum = true;
      this.showInputOpt = false;
      this.exampletxt = 'The user may enter a custom ID by choosing the custom option.';
      this.example = 'For example, JOB/AE12345';
    }else if(value === 'Sequence'){
      this.formattedPrefix = '';
      this.projectPrefixForm.patchValue({
        prefixFor: 'Sequence'
      });
      this.disableSeqNum = false;
      this.showInputOpt = true;
      this.inputType = 'number';
      this.exampletxt = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.';
      this.example = 'For example, Inc/1.';
    }else{
      this.formattedPrefix = '';
      this.projectPrefixForm.patchValue({
        prefixFor: 'Default'
      });
      this.disableSeqNum = true;
      this.showInputOpt = true;
      this.inputType = 'text';
      this.formattedPrefix = this.formattedPrefixDate+'/0000';
      this.exampletxt = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.'
      this.example = 'For example, ENQ/20/08/0004,ENQ/20/08/0001';
    }
  }

  getInputValue(event){
    this.formattedPrefix = event.srcElement.value
  }

  getCompInputValue(event){
    this.compformattedPrefix = event.srcElement.value
  }

  getMarInputValue(event){
    this.marformattedPrefix = event.srcElement.value
  }

  submitProjectPrefix(){
    this.prefixTxtError = false;
    this.sequenceNumberError = false;
    let formVaue = this.projectPrefixForm.value;

    if(formVaue.prefix === '' || formVaue.prefix === null){
      this.prefixTxtError = true;
      return
    }
    if(!this.disableSeqNum && this.formattedPrefix === ''){
      this.sequenceNumberError = true;
      return
    }

    if(this.editProjectPrefixDiv){
      let postData = {
        id: this.editProjectPrefixData.id,
        type: this.type,
        prefix_ext: (formVaue.prefix).toUpperCase(),
        prefix_name: (formVaue.prefix).toUpperCase()+(formVaue.prefixFor === "Custom" ? '' : '/'+this.formattedPrefix ),
        prefix_for: formVaue.prefixFor,
        is_manual_allowed: this.editProjectPrefixData.is_manual_allowed,
        is_revised: this.editProjectPrefixData.is_revised,
        created_date: this.editProjectPrefixData.created_date,
        createdby: this.editProjectPrefixData.createdby,
        org_id: this.editProjectPrefixData.org_id,
        modifiedby: this.currentUser.full_name,
        modified_date: moment().format('L')
      }

      this.projectService.UpdatePrefix(postData).subscribe((data:any) => {
        if(data.status === '200'){
          this.AddProjectPrefixActivities(postData);
          this.UpdateProjectPrefixActivitiesById(postData);
          this.backToMainProjectPrefix();
          this.toast.success(data.desc)
        }else{
          this.toast.error('Something went wrong')
        }
      });
    }else{
      let postData = {
        type: this.type,
        prefix_ext: (formVaue.prefix).toUpperCase(),
        prefix_name: (formVaue.prefix).toUpperCase()+(formVaue.prefixFor === "Custom" ? '' : '/'+this.formattedPrefix ),
        prefix_for: formVaue.prefixFor,
        is_manual_allowed: false,
        is_revised: false,
        created_date: moment().format('L'),
        createdby: this.currentUser.full_name,
        org_id: this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id')
      }

      this.projectService.AddPrefix(postData).subscribe((data:any) => {
        if(data.status === '200'){
          this.AddProjectPrefixActivities(postData)
          this.backToMainProjectPrefix();
          this.toast.success(data.desc)
        }else{
          this.toast.error('Something went wrong')
        }
      });
    }
  }

  GetProjectPrefixActivitiesByOrgId(){
 
    let id = this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id');
    this.projectService.GetProjectPrefixActivitiesByOrgId({id}).subscribe((data) => {
      this.projectPrefixActivities = data;
      //Check the Prefix for Different Types of Project


      //Normal JOB
      
       this.projectActvits =  this.projectPrefixActivities.filter((el) =>  el.description.slice(0, 4) === "JOB/");
      // this.prefixhistDt = this.projectActvits; 

      //Normal CMP
      this.projectActvitsCmp =  this.projectPrefixActivities.filter((el) =>  el.description.slice(0, 1) === "C");
     


      //Normal MRP
      this.projectActvitsMrp =  this.projectPrefixActivities.filter((el) =>  el.description.slice(0, 1) === "M");
    //  this.prefixhistDt = this.projectActvitsMrp; 


    });
  }

  viewHistoryModal(type) {
      if(type === 'project') {
        $("#show_prefixHist_modal").modal('show');
         this.prefixhistDt = this.projectActvits; 
      }   
      else if(type === 'project-comp') {
        $("#show_prefixHist_modal").modal('show');
        this.prefixhistDt = this.projectActvitsCmp;
      }
      else if(type === 'project-mar') {
        $("#show_prefixHist_modal").modal('show');
        this.prefixhistDt = this.projectActvitsMrp;
      }
      
  }

  closHistoryModal() {
      $("#show_prefixHist_modal").modal('hide');
  }

  

  AddProjectPrefixActivities(postData){
    let sendData = {
      "org_id": postData.org_id,
      "project_prefixType": postData.prefix_for,
      "fromDate": moment().format('L'),
      "modifiedDate": moment().format('L'),
      "modifiedBy": this.currentUser.full_name,
      "modifiedByEmpId": this.currentUser.id,
      "description": postData.prefix_name,
      "createdDate": moment().format('L'),
      "createdBy": this.currentUser.full_name,
    }
    this.projectService.AddProjectPrefixActivities(sendData).subscribe((data) => {
      console.log(data)
    });
  }

  UpdateProjectPrefixActivitiesById(postData){
    let sendData = {
      "id": this.projectPrefixActivities[0].id,
      "org_id": postData.org_id,
      "project_prefixType": this.projectPrefixActivities[0].project_prefixType,
      "fromDate": this.projectPrefixActivities[0].fromDate,
      "modifiedDate": moment().format('L'),
      "modifiedBy": this.projectPrefixActivities[0].modifiedBy,
      "modifiedByEmpId": this.projectPrefixActivities[0].modifiedByEmpId,
      "description": this.projectPrefixActivities[0].description,
      "createdDate": this.projectPrefixActivities[0].createdDate,
      "createdBy": this.projectPrefixActivities[0].createdBy
    }
    console.log('Update',sendData)
    this.projectService.UpdateProjectPrefixActivitiesById(sendData).subscribe((data) => {
      console.log(data)
    });
  }

  backToMainProjectPrefix(){
    if(this.mainProjectPrefListing){
      this.Router.navigate(['settings-new/project']);
    }else{
      this.editProjectPrefixDiv = false;
      this.mainProjectPrefListing = true;
      this.prefixTxtError = false;
      this.sequenceNumberError = false;
      this.disableSeqNum = false;
      this.GetAllPrefixByOrgID();
      this.projectPrefixForm.reset();
      this.marprojectPrefixForm.reset();
      this.compprojectPrefixForm.reset();
    }
  }

  deleteProjectPre(data){
    this.projectService.RemovePrefix({id: data.id}).subscribe((data:any) => {
      if(data.status === '200'){
        this.GetAllPrefixByOrgID();
        this.toast.success(data.desc)
      }else{
        this.toast.error('Something went wrong')
      }
    });
  }


  submitMrktnPrefix() {

    this.marprefixTxtError = false;
    this.marsequenceNumberError = false;
    let formVaue = this.marprojectPrefixForm.value;

    if(formVaue.marprefix === '' || formVaue.marprefix === null){
      this.marprefixTxtError = true;
      return
    }
    if(!this.marpdisableSeqNum && this.marformattedPrefix === ''){
      this.marsequenceNumberError = true;
      return
    }

    if(this.existMarkPrefix.length > 0) {
      //if Present then Edit
      let postData = {
        id: this.existMarkPrefix[0].id,
        type: this.type + "-marketing", 
        prefix_ext: (formVaue.marprefix).toUpperCase(),
        prefix_name: (formVaue.marprefix).toUpperCase()+(formVaue.marprefixFor === "Custom" ? '' : '/'+this.marformattedPrefix ),
        prefix_for: formVaue.marprefixFor,
        is_manual_allowed: this.existMarkPrefix[0].is_manual_allowed,
        is_revised: this.existMarkPrefix[0].is_revised,
        created_date: this.existMarkPrefix[0].created_date,
        createdby: this.existMarkPrefix[0].createdby,
        org_id: this.existMarkPrefix[0].org_id,
        modifiedby: this.currentUser.full_name,
        modified_date: moment().format('L')
      }
     
      this.projectService.UpdatePrefix(postData).subscribe((data:any) => {
        if(data.status === '200'){
          this.AddProjectPrefixActivities(postData);
          this.UpdateProjectPrefixActivitiesById(postData);
          this.GetAllPrefixByOrgID();
         // this.backToMainProjectPrefix();
          this.toast.success(data.desc)
        }else{
          this.toast.error('Something went wrong')
        }
      });
    } else {
      //else Create a New one
        let postData = {
          type: this.type + "-marketing",
          prefix_ext: (formVaue.marprefix).toUpperCase(),
          prefix_name: (formVaue.marprefix).toUpperCase()+(formVaue.marprefixFor === "Custom" ? '' : '/'+this.marformattedPrefix),
          prefix_for: formVaue.marprefixFor,
          is_manual_allowed: false,
          is_revised: false,
          created_date: moment().format('L'),
          createdby: this.currentUser.full_name,
          org_id: this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id')
        }
       
        this.projectService.AddPrefix(postData).subscribe((data:any) => {
          if(data.status === '200'){
            this.AddProjectPrefixActivities(postData);
            this.GetAllPrefixByOrgID();
            //this.backToMainProjectPrefix();
            this.toast.success(data.desc)
          }else{
            this.toast.error('Something went wrong')
          }
        });
    }


      

  }




  submitCmplmPrefix() {
    this.cmpprefixTxtError = false;
    this.cmpsequenceNumberError = false;
    let formVaue = this.compprojectPrefixForm.value;

    if(formVaue.compprefix === '' || formVaue.compprefix === null){
      this.cmpprefixTxtError = true;
      return
    }
    if(!this.compdisableSeqNum && this.compformattedPrefix === ''){
      this.cmpsequenceNumberError = true;
      return
    }

      if(this.existCompPrefix.length > 0) {
        //if Present then Edit
        let postData = {
          id: this.existCompPrefix[0].id,
          type: this.type + "-complimentary", 
          prefix_ext: (formVaue.compprefix).toUpperCase(),
          prefix_name: (formVaue.compprefix).toUpperCase()+(formVaue.compprefixFor === "Custom" ? '' : '/'+this.compformattedPrefix ),
          prefix_for: formVaue.compprefixFor,
          is_manual_allowed: this.existCompPrefix[0].is_manual_allowed,
          is_revised: this.existCompPrefix[0].is_revised,
          created_date: this.existCompPrefix[0].created_date,
          createdby: this.existCompPrefix[0].createdby,
          org_id: this.existCompPrefix[0].org_id,
          modifiedby: this.currentUser.full_name,
          modified_date: moment().format('L')
        }
        this.projectService.UpdatePrefix(postData).subscribe((data:any) => {
          if(data.status === '200'){
            this.AddProjectPrefixActivities(postData);
            this.UpdateProjectPrefixActivitiesById(postData);
            this.GetAllPrefixByOrgID();
            //this.backToMainProjectPrefix();
            this.toast.success(data.desc)
          }else{
            this.toast.error('Something went wrong')
          }
        });
      } else {
        //else Create a New one
          let postData = {
            type: this.type + "-complimentary",
            prefix_ext: (formVaue.compprefix).toUpperCase(),
            prefix_name: (formVaue.compprefix).toUpperCase()+(formVaue.compprefixFor === "Custom" ? '' : '/'+this.compformattedPrefix ),
            prefix_for: formVaue.compprefixFor,
            is_manual_allowed: false,
            is_revised: false,
            created_date: moment().format('L'),
            createdby: this.currentUser.full_name,
            org_id: this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id')
          }
          this.projectService.AddPrefix(postData).subscribe((data:any) => {
            if(data.status === '200'){
              this.AddProjectPrefixActivities(postData);
              this.GetAllPrefixByOrgID();
            //  this.backToMainProjectPrefix();
              this.toast.success(data.desc)
            }else{
              this.toast.error('Something went wrong')
            }
          });
      }
        
  }

  compchangePrefixFor(){

    // compdisableSeqNum =  true;
    // compshowInputOpt = true;
    let value = this.compprojectPrefixForm.get('compprefixFor').value;
    if(value === 'Custom'){
      this.compformattedPrefix = '';
      this.compprojectPrefixForm.patchValue({
        compprefixFor: 'Custom'
      });
      this.compdisableSeqNum = true;
      this.compshowInputOpt = false;
      //this.exampletxt = 'The user may enter a custom ID by choosing the custom option.';
      //this.example = '';
       this.exampletxtComp = 'The user may enter a custom ID by choosing the custom option.';
        this.exampleComp = 'For example, JOB/AE12345';
    } 
    else if(value === 'Project-Sequence'){

      let vlu = this.projectPrefixForm.get('prefix').value;


      this.compdisableSeqNum = true;
      this.compformattedPrefix = this.formattedPrefix;
      this.compprojectPrefixForm.patchValue({
        compprefix:vlu,
        compprefixFor: 'Project-Sequence'
      });
      this.exampletxtComp = 'By selecting this option, you enable Complimentary Projects to follow the Project Prefix sequence.Note: If a complimentary project is an extension of a main project, the prefix will be assigned in the same order as the main project.';
      this.exampleComp = 'For example, Inc/1.';


    }
    else if(value === 'Sequence'){
      this.compformattedPrefix = '';
      this.compprojectPrefixForm.patchValue({
        compprefix:'',
        compprefixFor: 'Sequence'
      });
      this.compdisableSeqNum = false;
      this.compshowInputOpt = true;
      this.compinputType = 'number';
      //this.exampletxt = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.';
      //this.example = 'For example, Inc/1.';
      this.exampletxtComp = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.Note: If a complimentary project is an extension of a main project, the prefix will be assigned in the same order as the main project.';
      this.exampleComp= 'For example, Inc/1.';
    }else{
      this.compformattedPrefix = '';
      this.compprojectPrefixForm.patchValue({
        compprefix:'',
        compprefixFor: 'Default'
      });
      this.compdisableSeqNum = true;
      this.compshowInputOpt = true;
      this.compinputType = 'text';
      this.compformattedPrefix = this.formattedPrefixDate+'/0000';
      this.exampletxtComp = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.Note: If a complimentary project is an extension of a main project, the prefix will be assigned in the same order as the main project.'
        this.exampleComp = 'For example, ENQ/20/08/0004,ENQ/20/08/0001';
    }
  }


  marchangePrefixFor(){

    // compdisableSeqNum =  true;
    // compshowInputOpt = true;
    let value = this.marprojectPrefixForm.get('marprefixFor').value;
    if(value === 'Custom'){
      this.marformattedPrefix = '';
      this.marprojectPrefixForm.patchValue({
        marprefixFor: 'Custom'
      });
      this.marpdisableSeqNum = true;
      this.marpshowInputOpt = false;
      // this.exampletxt = 'The user may enter a custom ID by choosing the custom option.';
      // this.example = '';
    } 
    else if(value === 'Project-Sequence'){

      let vlu = this.projectPrefixForm.get('prefix').value;
   
      this.marpdisableSeqNum = true;
      this.marformattedPrefix = this.formattedPrefix;
      this.marprojectPrefixForm.patchValue({
        marprefix:vlu,
        marprefixFor: 'Project-Sequence'
      });
      this.exampletxtMRP = 'By selecting this option, you enable Marketing Projects to follow the Project Prefix sequence.Note: If a Marketing project is an extension of a main project, the prefix will be assigned in the same order as the main project.';
      this.exampleMRP = 'For example, Inc/1.';


    }
    else if(value === 'Sequence'){
      this.marformattedPrefix = '';
      this.marprojectPrefixForm.patchValue({
        marprefix:'',
        marprefixFor: 'Sequence'
      });
      this.marpdisableSeqNum = false;
      this.marpshowInputOpt = true;
      this.marinputType = 'number';
      this.exampletxtMRP = 'You have the option to create your own reference or prefix, which will be a combination of letters and numbers. You can also choose what number the sequence should start from.Note: If a Marketing project is an extension of a main project, the prefix will be assigned in the same order as the main project.';
        this.exampleMRP = 'For example, Inc/1.';
    }else{
      this.marformattedPrefix = '';
      this.marprojectPrefixForm.patchValue({
        marprefix:'',
        marprefixFor: 'Default'
      });
      this.marpdisableSeqNum = true;
      this.marpshowInputOpt = true;
      this.marinputType = 'text';
      this.marformattedPrefix = this.formattedPrefixDate+'/0000';
      console.log("this.marformattedPrefix--->",this.marformattedPrefix);
      this.exampletxtMRP = 'In Default the prefix value is to be entered. Year and month is automatically added and it changes to current year and month. The number starts with zero and get increments. this happens every month.Note: If a Marketing project is an extension of a main project, the prefix will be assigned in the same order as the main project.'
      this.exampleMRP = 'For example, ENQ/20/08/0004,ENQ/20/08/0001';
    }
  }


  projectPrefixFormInputs(){
    this.projectPrefixForm = this.formBuilder.group({
      prefix: [''],
      prefixFor: ['']
    });
  }

  compprojectPrefixFormInputs(){
    this.compprojectPrefixForm = this.formBuilder.group({
      compprefix: [''],
      compprefixFor: ['']
    });
  }

   marprojectPrefixFormInputs(){
    this.marprojectPrefixForm = this.formBuilder.group({
      marprefix: [''],
      marprefixFor: ['']
    });
  }

}
