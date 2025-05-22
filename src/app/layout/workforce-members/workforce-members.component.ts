import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { EmployeeService } from '../../services/employee.service';
import { ProjectService } from '../../services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import * as _ from "lodash";
import { Router } from '@angular/router';
import moment = require('moment');
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-workforce-members',
  templateUrl: './workforce-members.component.html',
  styleUrls: ['./workforce-members.component.scss']
})
export class WorkforceMembersComponent implements OnInit {

  //userRights
  commonModuleName;
  accessToPage = false;
  workForceTeamsByOrgIdData;
  employeeListingData;
  employeeListingDropData;
  projectListingData;
  workForcePage = true;
  invoiceToolbar : ToolbarItems[];
  commonFields: Object = { text: "value", value: "id"};
  @ViewChild('empTabledataTableGrid',{static:false}) public empTabledataTableGrid: GridComponent;
  @ViewChild('searchProjectdataTableGrid',{static:false}) public searchProjectdataTableGrid: GridComponent;
  @ViewChild('workForcedataTableGrid',{static:false}) public workForcedataTableGrid: GridComponent;
  @ViewChild('resetDropDown',{static:false}) public resetDropDown: DropDownListComponent;

  addWorkForceForm: FormGroup;
  currentUser = JSON.parse(localStorage.getItem('user_info'));
  orgID = this.currentUser.org_id !== null ? this.currentUser.org_id : localStorage.getItem('org_id');
  selectedEmployee = [];
  selectedProject = [];
  projectORemployeeReq = false;
  formSubmitAttemptForWF = true;
  formType;
  displayTxt = 'By creating a workforce managenment, you can assign a Team lead who can supervision the progress of team member or project that are assigned to the Team lead.';
  selectedData;
  loadProject = true;
  loadEmployee = true;
  sameLeadError = false;

  constructor(
    private userService: UserService,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    public router:Router,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.invoiceToolbar = ['Search'];
    this.checkUserRights();
    this.addWorkForceFormInputs();
    this.GetWorkForceTeamsByOrgId();
  }

  checkUserRights(){
    let user_info = JSON.parse(localStorage.getItem('user_info'));
    this.userService.GetAccessRightsbyRole({ id : user_info.role_id }).subscribe((data:any)=>{
      data.map((item) => {
        item.module_name = item.module_name.replace(/\s+/g, '');;
        return item;
      });
      this.commonModuleName = _.groupBy(data, 'module_name');
      if(this.commonModuleName.Workforce){
        this.commonModuleName.Workforce.map((elm) => {
          if(elm.section_name === 'Workforce members' && elm.is_allow){
            this.accessToPage = elm.is_allow;
          }
        });
      }
    });
  }

  GetWorkForceTeamsByOrgId(){
    this.projectService.GetWorkForceTeamsByOrgId().subscribe((data: any) => {
      let filtered = [];
      data.map((elm, e) => {
        if(!elm.isDeleted){
          filtered.push(elm);
        }

        if(data.length === e+1){
          this.workForceTeamsByOrgIdData = filtered;
          this.spinner.hide();
        }
      });
    });
  }

  addWorkForce(){
    this.spinner.show();
    this.formType = 'Add';
    this.selectedProject = [];
    this.selectedEmployee = [];
    this.workForcePage = false;
    this.fetchDropDown();
  }

  fetchDropDown(){
    this.employeeService.fetchGridDataEmployeeByOrgID().subscribe((data: any) => {
      let results = [];
      data.map((elm, i) => {
        results.push({
          id: elm.id,
          value: elm.full_name
        });

        if(data.length === i+1){
          this.employeeListingDropData = results;
          this.spinner.hide();
          if(this.formType === 'Update'){
            this.addWorkForceForm.patchValue({
              teamLead: this.selectedData.teamLead,
              description: this.selectedData.description
            });
          }
        }
      });
    });
  }

  //model function
  openProjectSearchModel(){
    this.spinner.show();
    this.GetAllProjectsByOrgId();
    $('#Search_project_modal').modal('show');
  }

  GetAllProjectsByOrgId(){
    this.projectService.GetAllProjectsByOrgId().subscribe((proListData: any) => {
      let filteredProject = [];
      proListData.map((pro, i) => {
        let selected = this.selectedProject.filter((selPro) => selPro.project_id === pro.project_id);
        if(selected.length === 0){
          pro.isChecked = false;
          filteredProject.push(pro);
        }

        if(proListData.length === i+1){
          this.projectListingData = filteredProject;
          this.spinner.hide();
        }
      });
    });
  }

  toProjectLayout(id){
    localStorage.setItem('project_id',id);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/project-layout-new'])
    );
    window.open(url, "_blank");
  }

  continueWithSelectedProj(){
    this.spinner.show();
    this.projectORemployeeReq = false;
    let selectedProject = JSON.parse(JSON.stringify(this.selectedProject));
    this.projectListingData.map((elm, i) =>{
      if(elm.isChecked){
        selectedProject.push(elm)
      }

      if(this.projectListingData.length === i+1){
        this.selectedProject = selectedProject;
        this.spinner.hide();
        this.closeProjectSearchModel();
      }
    });
  }

  closeProjectSearchModel(){
    $('#Search_project_modal').modal('hide');
  }

  isChecked(e, data, type){
    if(type === 'project'){
      this.projectListingData.map((elm) => {
        if(elm.project_id === data.project_id){
          elm.isChecked = e.checked;
        }
      });
    }else{
      this.employeeListingData.map((elm) => {
        if(elm.id === data.id){
          elm.isChecked = e.checked;
        }
      });
    }
  }

  removeFromSelected(type, data){
    this.spinner.show();
    if(type === 'project'){
      let removedObject = this.selectedProject.filter(obj => obj.project_id !== data.project_id);
      this.selectedProject = removedObject;
      this.projectListingData.map((pro, i) => {
        if(pro.project_id === data.project_id){
          pro.isChecked = false
        }

        if(this.projectListingData.length === i+1){
          this.spinner.hide();
        }
      });
    }else{
      let removedObject = this.selectedEmployee.filter(obj => obj.id !== data.id);
      this.selectedEmployee = removedObject;
      this.employeeListingData.map((emp, i) => {
        if(emp.id === data.id){
          emp.isChecked = false
        }

        if(this.employeeListingData.length === i+1){
          this.spinner.hide();
        }
      });
    }
  }

  openEmployeeSearchModel(){
    this.spinner.show();
    this.getAllEmployeeByOrgID();
    $('#Search_employee_modal').modal('show');
  }

  getAllEmployeeByOrgID(){
    this.employeeService.fetchGridDataEmployeeByOrgID().subscribe((empData: any) => {
      console.log(empData, this.selectedEmployee)
      let filteredEmp = [];
      empData.map((emp, i) => {
        let selected = this.selectedEmployee.filter((selEmp) => selEmp.id === emp.id);
        if(selected.length === 0){
          emp.isChecked = false;
          filteredEmp.push(emp);
        }

        if(empData.length === i+1){
          this.employeeListingData = filteredEmp;
          this.spinner.hide();
        }
      });
    });
  }

  continueWithSelectedEmp(){
    this.spinner.show();
    this.projectORemployeeReq = false;
    let selectedEmployee = JSON.parse(JSON.stringify(this.selectedEmployee));
    this.employeeListingData.map((elm, i) =>{
      if(elm.isChecked){
        selectedEmployee.push(elm)
      }

      if(this.employeeListingData.length === i+1){
        this.selectedEmployee = selectedEmployee;
        this.spinner.hide();
        this.closeEmployeeSearchModel();
      }
    });
  }

  closeEmployeeSearchModel(){
    $('#Search_employee_modal').modal('hide');
  }

  saveWorkForce(){
    if(this.sameLeadError){
      return;
    }

    this.formSubmitAttemptForWF = false;
    if(this.addWorkForceForm.invalid){
      return;
    }

    if(this.selectedEmployee.length === 0 && this.selectedProject.length === 0){
      this.projectORemployeeReq = true;
      return;
    }

    this.spinner.show();
    let formValue = this.addWorkForceForm.value;
    this.employeeListingDropData.map((elm) => {
      if(elm.id === formValue.teamLead){
        let postData: any = {
          "org_id": this.orgID,
          "description": formValue.description,
          "teamLead": formValue.teamLead,
          "teamLeadName": elm.value,
          "totalMembersCount": this.selectedEmployee.length,
          "totalProjectCount": this.selectedProject.length,
          "createdByEmpId": this.currentUser.id,
          "createdBy": this.currentUser.full_name,
          "createdDate": moment().format('L')
        }

        let workForceMembers = [];

        if(this.selectedEmployee.length !== 0){
          this.selectedEmployee.map((emp, e) => {
            let empData = {
              "emp_id": emp.id,
              "project_id": null,
              "createdByEmpId": this.currentUser.id,
              "createdBy": this.currentUser.full_name,
              "createdDate": moment().format('L')
            }
            workForceMembers.push(empData);

            if(this.selectedEmployee.length === e+1){

              if(this.selectedProject.length !== 0){
                this.selectedProject.map((pro, p) => {
                  let proData = {
                    "emp_id": null,
                    "project_id": pro.project_id,
                    "createdByEmpId": this.currentUser.id,
                    "createdBy": this.currentUser.full_name,
                    "createdDate": moment().format('L')
                  }
                  workForceMembers.push(proData);

                  if(this.selectedProject.length === p+1){
                    postData.workForceMembers = workForceMembers;
                    this.AddWorkForceTeams(postData)
                  }
                });
              }else{
                postData.workForceMembers = workForceMembers;
                this.AddWorkForceTeams(postData)
              }
            }
          });
        }else{
          this.selectedProject.map((pro, p) => {
            let proData = {
              "emp_id": null,
              "project_id": pro.project_id,
              "createdByEmpId": this.currentUser.id,
              "createdBy": this.currentUser.full_name,
              "createdDate": moment().format('L')
            }
            workForceMembers.push(proData);

            if(this.selectedProject.length === p+1){
              postData.workForceMembers = workForceMembers;
              this.AddWorkForceTeams(postData)
            }
          });
        }
      }
    });
  }

  AddWorkForceTeams(postData){
    this.projectService.AddWorkForceTeams(postData).subscribe((data: any) => {
      console.log(data)
      if(data.status === '200'){
        this.toast.success('Workforce management created with lead as '+postData.teamLeadName);
      }else{
        this.toast.error('something went wrong');
      }
      this.closeAddWorkForce();
      this.spinner.hide();
    });
  }

  closeAddWorkForce(){
    this.workForcePage = true;
    this.GetWorkForceTeamsByOrgId();
    this.addWorkForceForm.reset();
    this.formSubmitAttemptForWF = true;
    this.selectedProject = [];
    this.selectedEmployee = [];
    this.loadProject = true;
    this.loadEmployee = true;
    this.sameLeadError = false;
    this.resetDropDown.value = null;
  }

  viewMode(data){
    this.spinner.show();
    this.formType = 'Update';
    this.workForcePage = false;
    this.selectedData = data;
    this.fetchDropDown();
    this.projectService.GetWorkForceTeamsById({id: this.selectedData.id}).subscribe((wFData: any) => {
      let project = [];
      let employee = [];
      wFData.map((wF, i) => {
        if(wF.project_id !== null){
          project.push(wF)
        }else{
          employee.push(wF)
        }

        if(wFData.length === i+1){
          if(project.length !== 0){
            this.fetchProject(project)
          }else{
            this.selectedProject = [];
            this.loadProject = false;
          }

          if(employee.length !== 0){
            this.fetchEmployee(employee)
          }else{
            this.selectedEmployee = [];
            this.loadEmployee = false;
          }
          this.spinner.hide();
        }
      });
    });
  }

  fetchProject(projectArray){
    this.projectService.GetAllProjectsByOrgId().subscribe((proListData: any) => {
      let filteredProject = [];
      proListData.map((pro, i) => {
        let selected = projectArray.filter((selPro) => selPro.project_id === pro.project_id);
        if(selected.length !== 0){
          pro.isChecked = true;
          filteredProject.push(pro);
        }

        if(proListData.length === i+1){
          this.selectedProject = filteredProject;
          this.loadProject = false;
          this.GetAllProjectsByOrgId();
        }
      });
    });
  }

  fetchEmployee(employeeArray){
    this.employeeService.fetchGridDataEmployeeByOrgID().subscribe((empData: any) => {
      let filteredEmp = [];
      empData.map((emp, i) => {
        let selected = employeeArray.filter((selEmp) => selEmp.emp_id === emp.id);
        if(selected.length !== 0){
          emp.isChecked = true;
          filteredEmp.push(emp);
        }

        if(empData.length === i+1){
          this.selectedEmployee = filteredEmp;
          console.log(this.selectedEmployee)
          this.loadEmployee = false;
          this.getAllEmployeeByOrgID();
        }
      });
    });
  }

  checkLeadError(event){
    if(this.formType === 'Add'){
      let check = this.workForceTeamsByOrgIdData.filter((wFData) => wFData.teamLead === event.value);
      if(check.length !== 0){
        this.sameLeadError = true;
      }else{
        this.sameLeadError = false;
      }
    }
  }

  editWorkForce(){
    console.log(this.selectedData)
    this.formSubmitAttemptForWF = false;
    if(this.addWorkForceForm.invalid){
      return;
    }

    if(this.selectedEmployee.length === 0 && this.selectedProject.length === 0){
      this.projectORemployeeReq = true;
      return;
    }

    this.spinner.show();
    let formValue = this.addWorkForceForm.value;
    this.employeeListingDropData.map((elm) => {
      if(elm.id === formValue.teamLead){
        let postData: any = {
          "id": this.selectedData.id,
          "org_id": this.orgID,
          "description": formValue.description,
          "teamLead": formValue.teamLead,
          "teamLeadName": elm.value,
          "totalMembersCount": this.selectedEmployee.length,
          "totalProjectCount": this.selectedProject.length,
          "createdByEmpId": this.selectedData.createdByEmpId,
          "createdBy": this.selectedData.createdBy,
          "createdDate": this.selectedData.createdDate,
          "modifiedDate": moment().format('L'),
        }

        let workForceMembers = [];

        if(this.selectedEmployee.length !== 0){
          this.selectedEmployee.map((emp, e) => {
            let empData = {
              "emp_id": emp.id,
              "workForceTeamId": this.selectedData.id,
              "project_id": null,
              "createdByEmpId": this.currentUser.id,
              "createdBy": this.currentUser.full_name,
              "createdDate": moment().format('L')
            }
            workForceMembers.push(empData);

            if(this.selectedEmployee.length === e+1){

              if(this.selectedProject.length !== 0){
                this.selectedProject.map((pro, p) => {
                  let proData = {
                    "emp_id": null,
                    "workForceTeamId": this.selectedData.id,
                    "project_id": pro.project_id,
                    "createdByEmpId": this.currentUser.id,
                    "createdBy": this.currentUser.full_name,
                    "createdDate": moment().format('L')
                  }
                  workForceMembers.push(proData);

                  if(this.selectedProject.length === p+1){
                    postData.workForceMembers = workForceMembers;
                    this.editWorkForceTeams(postData)
                  }
                });
              }else{
                postData.workForceMembers = workForceMembers;
                this.editWorkForceTeams(postData)
              }
            }
          });
        }else{
          this.selectedProject.map((pro, p) => {
            let proData = {
              "emp_id": null,
              "workForceTeamId": this.selectedData.id,
              "project_id": pro.project_id,
              "createdByEmpId": this.currentUser.id,
              "createdBy": this.currentUser.full_name,
              "createdDate": moment().format('L')
            }
            workForceMembers.push(proData);

            if(this.selectedProject.length === p+1){
              postData.workForceMembers = workForceMembers;
              this.editWorkForceTeams(postData)
            }
          });
        }
      }
    });
  }

  editWorkForceTeams(postData){
    this.projectService.UpdateWorkforceTeam(postData).subscribe((data: any) => {
      console.log(data)
      if(data.status === '200'){
        this.toast.success('Workforce management updated with lead as '+postData.teamLeadName);
      }else{
        this.toast.error('something went wrong');
      }
      this.closeAddWorkForce();
      this.spinner.hide();
    });
  }

  deleteMode(data){
    Swal.fire({
      title: 'Delete this WorkForce Management under - '+data.teamLeadName+' ?',
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
        console.log(data)
        this.spinner.show();
        let postData: any = {
          "id": data.id,
          "org_id": data.org_id,
          "description": data.description,
          "teamLead": data.teamLead,
          "teamLeadName": data.teamLeadName,
          "totalMembersCount": data.totalMembersCount,
          "totalProjectCount": data.totalProjectCount,
          "isDeleted": true,
          "createdByEmpId": data.createdByEmpId,
          "createdBy": data.createdBy,
          "createdDate": data.createdDate,
          "modifiedDate": data.modifiedDate
        }

        this.projectService.GetWorkForceTeamsById({id: data.id}).subscribe((wFData: any) => {
          let project = [];
          let employee = [];
          let workForceMembers = [];
          wFData.map((wF, i) => {
            if(wF.project_id !== null){
              project.push(wF)
            }else{
              employee.push(wF)
            }

            if(wFData.length === i+1){
              if(project.length !== 0){
                project.map((pro, p) => {
                  let proObj = {
                    "workForceTeamId": data.id,
                    "emp_id": null,
                    "project_id": pro.project_id,
                    "createdByEmpId": pro.createdByEmpId,
                    "isDeleted": true,
                    "createdBy": pro.createdBy,
                    "createdDate": pro.createdDate
                  }
                  workForceMembers.push(proObj);
                  if(project.length === p+1){
                    if(employee.length !== 0){
                      employee.map((emp, e) => {
                        let empObj = {
                          "workForceTeamId": data.id,
                          "emp_id": emp.id,
                          "project_id": null,
                          "createdByEmpId": emp.createdByEmpId,
                          "isDeleted": true,
                          "createdBy": emp.createdBy,
                          "createdDate": emp.createdDate
                        }
                        workForceMembers.push(empObj);
                        if(employee.length === e+1){
                          postData.workForceMembers = workForceMembers;
                          this.finalDelete(postData);
                        }
                      });
                    }else{
                      postData.workForceMembers = workForceMembers;
                      this.finalDelete(postData);
                    }
                  }
                });
              }else{
                employee.map((emp, e) => {
                  let empObj = {
                    "workForceTeamId": data.id,
                    "emp_id": emp.id,
                    "project_id": null,
                    "createdByEmpId": emp.createdByEmpId,
                    "isDeleted": true,
                    "createdBy": emp.createdBy,
                    "createdDate": emp.createdDate
                  }
                  workForceMembers.push(empObj);
                  if(employee.length === e+1){
                    postData.workForceMembers = workForceMembers;
                    this.finalDelete(postData);
                  }
                });
              }
            }
          });
        });
      }
    });
  }

  finalDelete(postData){
    this.projectService.UpdateWorkforceTeam(postData).subscribe((data: any) => {
      if(data.status === '200'){
        this.toast.success('Workforce management Deleted with lead as '+postData.teamLeadName);
      }else{
        this.toast.error('something went wrong');
      }
      this.GetWorkForceTeamsByOrgId();
    });
  }

  addWorkForceFormInputs(){
    this.addWorkForceForm = this.formBuilder.group({
      description: [''],
      teamLead: ['', Validators.required]
    });
  }

  empTableSearchKeyUp(): void {
    document.getElementById(this.empTabledataTableGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.empTabledataTableGrid.search((event.target as HTMLInputElement).value)
    });
  }

  projectSearchKeyUp(): void {
    document.getElementById(this.searchProjectdataTableGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.searchProjectdataTableGrid.search((event.target as HTMLInputElement).value)
    });
  }

  wfSearchKeyUp(): void {
    document.getElementById(this.workForcedataTableGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.workForcedataTableGrid.search((event.target as HTMLInputElement).value)
    });
  }

}
