import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import moment = require('moment');
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-new',
  templateUrl: './employee-new.component.html',
  styleUrls: ['./employee-new.component.scss']
})
export class EmployeeNewComponent implements OnInit {

  public employeeProfileOpt:Select2Options;
  fullEmployeeData: any;
  toolbar: string[];
  @ViewChild('employeeGrid', {static:false}) public employeeGrid: GridComponent;
  employeeListingDiv = false;
  newEmployeeDiv = false;
  editEmployeeDiv = false;
  startdateEmployeeValue;
  startdateEmployeeLeaveProfileValue;
  employeeForm: FormGroup;

  constructor(
    public empService:EmployeeService,
  ) {
    this.employeeProfileOpt={
      placeholder:"Select",
      width: "100%",
    }
   }

  ngOnInit() {
    this.EmpListByOrgId();
  }

  public EmpListByOrgId(){
    this.employeeListingDiv = true;
    this.toolbar = ['Search','ExcelExport', 'PdfExport' ];
    this.employeeListingDiv = true;
    this.empService.fetchGridDataEmployeeByOrgID().subscribe((data:any) => {
      this.fullEmployeeData = data;
    },error  => {
      Swal.fire(
        'Error!',
        error,
        'error'
      )}
    )
  }

  employeeGridSearch(): void {
    document.getElementById(this.employeeGrid.element.id + "_searchbar").addEventListener('keyup', () => {
      this.employeeGrid.search((event.target as HTMLInputElement).value)
    });
  }

  toolbarClick(args: ClickEventArgs): void {
    switch(args.item.text){
      case 'PDF Export':
        this.employeeGrid.pdfExport();
        break;
      case 'Excel Export':
        this.employeeGrid.excelExport();
        break;
      case 'CSV Export':
        this.employeeGrid.csvExport();
        break;
    }
  }

  AddEmployeeForm(){
    this.employeeListingDiv = false;
    this.newEmployeeDiv = true;
    this.editEmployeeDiv = false;
    this.startdateEmployeeValue = new Date();
    this.startdateEmployeeLeaveProfileValue = new Date();
  }

  employeeStartDateChange(e){
    this.startdateEmployeeValue = moment(e.value).format('L');
  }

  employeeLeaveProfileStartDateChange(e){
    this.startdateEmployeeLeaveProfileValue = moment(e.value).format('L');
  }

  saveNewEmployee(){

  }

  mainEmployeeListing(){
    this.employeeListingDiv = true;
    this.newEmployeeDiv = false;
    this.editEmployeeDiv = false;
  }

  editEmployeeFormInputs(){
    this.employeeForm = new FormGroup({
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      WorkEmail: new FormControl('',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      JoinedDate:new FormControl(''),
      phone: new FormControl('')
    })
  }

  goBack(){
    window.history.go(-1);
  }

}
