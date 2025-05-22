import { Component, OnInit, ViewChild } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { patternValidator } from '../../shared/services';
import Swal from 'sweetalert2';
import { DepartmentService } from '../../services/department.service';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { AdministrativeService } from '../../services/administrative.service';
import { DataManager } from '@syncfusion/ej2-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClickEventArgs } from '@syncfusion/ej2-navigations'

import { GridComponent } from '@syncfusion/ej2-angular-grids';
let orgId = localStorage.getItem('org_id');

@Component({
  selector: 'app-administrative',
  templateUrl: './administrative.component.html',
  styleUrls: ['./administrative.component.scss']
})

export class AdministrativeComponent implements OnInit {
  dataSource: any;
  editDeptId: string;
  delDeptId: string;


  public showDeptList = true;
  public showAddForm = false;
  public departmentLeadData: Array<Select2OptionData>;
  public taskData: Array<Select2OptionData>;
  public departmentLeadValue: string;
  public selectedPurpose: string;
  public selectedProject: string;
  public selectedTask: string;
  public deptOptions: Select2Options;
  public deptForm: FormGroup;
  public displayedColumns = ['index', 'dep_name', 'desc', 'Action'];
  public editable = false;
  public AddNewSubmit = true;
  public addformSubmitted = false;
  public editformSubmitted = false;
  searchField;
  pageSize: any = 10;
  currentPage: any = 1;
  pgData=[];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  pageSettings: { pageSizes: boolean; pageCount: number; };
  @ViewChild('grid',{static:false})
  public grid: GridComponent;
 
  toolbar: string[];

  constructor(private adminService: AdministrativeService, private spinner: NgxSpinnerService, private empService: EmployeeService, private deptService: DepartmentService, private toastr: ToastrService, public router: Router) {

    this.departmentLeadValue = '';
    this.selectedPurpose = '';
    this.selectedProject = '';
    this.selectedTask = '';
    this.deptOptions = {
      placeholder: { id: '  ', text: 'Select' }, allowClear: true,
      width: '100%'
    }
    this.departmentLeadData = []
  }
  public goBack(){
    window.history.go(-1);
  }
  public AddForm() {
    this.GetAllDept();
    this.AddNewSubmit = true;
    this.showDeptList = false;
    this.showAddForm = true;
    this.editable = false;
    this.deptForm.patchValue({

      dep_name: '',
      desc: ''


    })
    this.departmentLeadValue = '';

  }
  public GetAllDept() {
    this.deptService.getAllDept().subscribe(

      (data: any) => {


        var results = [{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
        // 

        for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
            "id": data[i].id,
            "text": data[i].dep_name
          });

        }


        this.departmentLeadData = results;

      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
          })
        

      }

    )


  }

  public DeptView() {
    this.showDeptList = true;
    this.showAddForm = false;
    this.GetAdministrativeByOrgID();
    //  this.router.navigate(["/departments"]);
  }
  public changedLead(e: any): void {
    this.selectedTask = e.value;
    
    this.departmentLeadValue = e.value;

    
  }
  public clearSearchField() {
    this.searchField = '';
    this.GetAdministrativeByOrgID();
  }
  public deptEdit(dept_id) {
    // this.EmpList();
    this.addformSubmitted = false;
    this.editformSubmitted = true;

    this.editable = true;
    this.AddNewSubmit = false;
    this.editDeptId = dept_id;
    let postData = {
      id: dept_id
    }
    this.adminService.FindByAdministrativeID(postData).subscribe(
      (data: any) => {

        this.deptForm.patchValue({

          dep_name: data.administrative_name,
          desc: data.summary



        })
        this.showDeptList = false;
        this.showAddForm = true;

        this.departmentLeadValue = data.dept_id;
        //  let dataObj = JSON.parse(data['token']);
        


        // this.router.navigate(["/organizations"]);

      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
          })
        

      }

    )

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  public deptDelete(deptId) {
    this.spinner.show();

    let postData = {
      id: deptId
    }
    this.adminService.RemoveAdministrative(postData).subscribe(
      (data: any) => {

        if (data.status == 200) {
          this.GetAdministrativeByOrgID();
          this.spinner.hide();

          this.toastr.error(data['desc'], undefined, {
            positionClass: 'toast-top-center'
          });
        }
        //  let dataObj = JSON.parse(data['token']);
        

        // this.router.navigate(["/organizations"]);

      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
          })
        

      }

    )
  }

  public GetAllAdministrative() {
    this.adminService.GetAllAdministrative().subscribe(
      (data: any) => {


        //  let dataObj = JSON.parse(data['token']);
        

        this.dataSource = new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // this.router.navigate(["/organizations"]);

      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
          })
        

      }

    )
  }
  isFieldValid(field: string) {
    if (this.addformSubmitted) {
      return (

        this.deptForm.get(field).errors && this.deptForm.get(field).touched ||
        this.deptForm.get(field).untouched &&
        this.addformSubmitted
      );
    }
    else if (this.editformSubmitted) {
      return (

        this.deptForm.get(field).errors &&
        this.editformSubmitted
      );
    }
    else {
      return false;
    }

  }
  public onAddSubmit(e) {
    this.addformSubmitted = true;
    e.preventDefault();
    let postData = {

      administrative_name: this.deptForm.get('dep_name').value,
      summary: this.deptForm.get('desc').value,
      dept_id: this.departmentLeadValue


    }
    this.spinner.show();


    

    let postValues = this.getDirtyValues(this.deptForm);
    

    if (this.deptForm.get('dep_name').value !== '') {
      // 

      return this.adminService.AddAdministrative(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);
          
          if (data.status == 200) {
            this.DeptView();
            this.addformSubmitted = false;
            this.spinner.hide();

            this.deptForm.reset();


            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });
          }
          // this.router.navigate(["/organizations"]);

        },
        error => {
          this.spinner.hide();

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
  }
  toolbarClick(args: ClickEventArgs): void {
    switch (args.item.text) {
        case 'PDF Export':
            this.grid.pdfExport();
            break;
        case 'Excel Export':
            this.grid.excelExport();
            break;
        case 'CSV Export':
            this.grid.csvExport();
            break;
    }
  }
  public onEditSubmit(e) {
    this.spinner.show();

    e.preventDefault();
    this.editformSubmitted = true;

    this.deptForm.get('dep_name').valueChanges
      .subscribe((mode: string) => {
        if (mode) {
          
        }
      });
    let postData = {
      id: this.editDeptId,

      administrative_name: this.deptForm.get('dep_name').value,
      summary: this.deptForm.get('desc').value,
      dept_id: this.departmentLeadValue


    }

    
    let postValues = this.getDirtyValues(this.deptForm);
    postValues['id'] = this.editDeptId;
    

    if (this.deptForm.get('dep_name').value !== '') {
      

      return this.adminService.UpdateAdministrative(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);
          


          if (data.status == 200) {
            this.editformSubmitted = false;
            this.addformSubmitted = false;
            this.spinner.hide();

            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });
          }
          // this.AddNewSubmit=true;
          this.DeptView();


          // this.router.navigate(["/organizations"]);

        },
        error => {
          this.spinner.hide();

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
  }

  public onAddNewSubmit(e) {
    this.spinner.show();

    this.addformSubmitted = true;
    e.preventDefault();
    let postData = {

      administrative_name: this.deptForm.get('dep_name').value,
      summary: this.deptForm.get('desc').value,
      dept_id: this.departmentLeadValue


    }

    

    if (this.deptForm.get('dep_name').value !== '') {
      

      return this.adminService.AddAdministrative(postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);
          
          if (data.status == 200) {
            this.addformSubmitted = false;
            this.deptForm.reset();
            this.spinner.hide();

            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          }
          this.AddNewSubmit = true;
          // this.router.navigate(["/organizations"]);

        },
        error => {
          this.spinner.hide();

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
  }
  getDirtyValues(form: any) {
    let dirtyValues = {};

    Object.keys(form.controls)
      .forEach(key => {
        let currentControl = form.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.getDirtyValues(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }
      });
    
    return dirtyValues;
  }

  public GetAdministrativeByOrgID() {
    this.adminService.GetAdministrativeTaskByOrgID().subscribe(

      (data: any) => {

        // this.dataSource = new MatTableDataSource(data);
        let datas = new DataManager(data);
        this.dataSource = datas.dataSource['json']
        //   this.initialSort = {
        //     columns: [{ field: 'dep_name', direction: 'Ascending' },
        //     { field: 'alias', direction: 'Descending' }]
        // };
        this.pageSettings = { pageSizes: true, pageCount: 5 }
        this.toolbar = ['Search', 'ExcelExport', 'PdfExport',];
        
        this.pgData=data;

        let ds= data.slice(0, this.pageSize);
        let ds1 = new DataManager(ds);
//this.dataSource=ds1.dataSource['json'];
        // this.router.navigate(["/organizations"]);

      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
          })
        

      }

    )
  }
  changed(e) {
    this.pageSize = e.pageSize;
    let start = (this.currentPage - 1) * e.pageSize;
    this.dataSource = this.pgData.slice(start, start + e.pageSize);
  }
    click(args) {
    if (args.currentPage) {
      let start = (args.currentPage - 1) * this.pageSize;
      this.dataSource = this.pgData.slice(start, start + this.pageSize);
    }
  }
  ngOnInit() {
    // this.DeptList();
    // this.EmpList();
    this.GetAllDept();
    // this.GetAllAdministrative();
    this.GetAdministrativeByOrgID();
    this.deptForm = new FormGroup({
      dep_name: new FormControl('', [Validators.required]),
      desc: new FormControl(''),
       departmentLead: new FormControl(''),





    });
    // $.getScript("assets/js/departments-datatable.js")

  }

}
