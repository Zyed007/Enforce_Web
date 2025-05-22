import { Component, OnInit, ViewChild } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatTableDataSource,MatSort,MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { pairwise } from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataManager } from '@syncfusion/ej2-data';
import { Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import moment = require('moment');

//services
import { DepartmentService } from '../../services/department.service';
import { DesignationService } from '../../services/designation.service';
import {AdministrativeService} from '../../services/administrative.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers:[EmployeeService,DepartmentService,DesignationService]
})

export class EmployeeComponent implements OnInit {

  dataSource: any;
  employeeList=[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  public today: Date = new Date(new Date().toDateString());
  public maxRangeDate: Date = this.today;
  public showEmployeeList=true;
  public showAddForm=false;
  public departmentData: Array<Select2OptionData>;
  public employeeRole: Array<Select2OptionData>;
  public employeeType: Array<Select2OptionData>;
  public leaveProfileType: Array<Select2OptionData>;
  public employeeStatus: Array<Select2OptionData>;
  public desgnData:Array<Select2OptionData>;
  public employeeRoleData: Array<Select2OptionData>;
  public deptOptions:Select2Options;
  public lpSetupOptions:Select2Options;
  public genderOptions:Select2Options;
  public empTypeValue: string;
  public leaveProfileValue: string;
  public empStatusValue: string;
  public deptValue: string;
  public widthVal: number;
  public genderType: Array<Select2OptionData>;
  public genderValue:string;
  public empProfileForm: FormGroup;
  public desgnValue:string;
  public AddNewSubmit=true;
  public selectedISO=CountryISO.UnitedArabEmirates;
  editable: boolean;
  editDeptId: any;
  empRoleValue: any;
  searchField: string;
  public addformSubmitted=false;
  public editformSubmitted=false;
  public employeeGrades:Array<Select2OptionData>;
  empGradValue: any;
  phoneInvalid: boolean=false;
  phoneErrorMsg: any;
  phoneNumberValue:string;
  pageSettings: { pageSizes: boolean; pageCount: number; };
  toolbar: string[];
  phone: any;
  pgData: any=[];
  pageSize: any = 10;
  currentPage: any = 1;
  @ViewChild('grid',{static:false})
  public grid: GridComponent;
  startdateValue: string;
  effectDateValue:string;
  editDesgnId: any;
  showList: boolean;
  showAddBtn: boolean;
  showEditBtn: boolean;
  showDeleteBtn: boolean;
  phoneNumberCode: any;
  user_info: any;
  headerText: { text: string; id: string; }[];
  isAdmin: boolean=false;
  isSuperAdmin: boolean=false;

  initalLeaveProfile;
  defaultProfileSelected: boolean=false;

  public employeeRoleValue;

  constructor(
    public empService:EmployeeService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public deptService: DepartmentService,
    public desgnService: DesignationService,
    public AdministrativeService: AdministrativeService
  ) {
      this.empProfileForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl(''),
        email: new FormControl('',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        empID: new FormControl('', [Validators.required]),
        joinedDate:new FormControl(''),
        summary:new FormControl(''),
        workEmail:new FormControl(''),
        opnBlncSic:new FormControl(''),
        openingBal:new FormControl(''),
        profileEffecti:new FormControl(''),
        phone: new FormControl('')
      });

      this.empTypeValue = '';
      this.leaveProfileValue = '';
      this.empStatusValue = '';
      this.employeeRoleValue = '';
      this.deptValue = '';
      this.genderValue='';
      this.desgnValue='';
      this.empRoleValue="3";
      this.deptOptions={
        placeholder:"Select",
        width: "100%",
      }
      this.genderOptions={
        placeholder:"Select",
        width: "100%",
        minimumResultsForSearch: -1
      }
      this.employeeStatus = [],
      this.employeeRole = [],
      this.employeeType = [],
      this.leaveProfileType = [],
      this.employeeGrades=[
        {id:'1',text:'L1'},
        {id:'2',text:'L2'},
        {id:'3',text:'L3'},
        {id:'4',text:'L4'},
        {id:'5',text:'L5'},
      ]
      this.genderType=[
          {id:'Male',text:'Male'},
          {id:'Female',text:'Female'}
      ]
    }

    public changedEmpType(e: any): void {
      this.empTypeValue=e.value;
    }

    public changedLeaveProfileType(e: any): void {


      if(this.editable && e.value !=null && e.value != this.initalLeaveProfile)  {

        // if(!this.defaultProfileSelected) {
        //   return
        // }

        Swal.fire({
          title: "Alert",
          text: "Updating the Leave Profile May Change the Current Leave Availabilty of the Employee",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6'
        }).then(
          (result)=> {
            if (result.value === true) {
              this.leaveProfileValue=e.value;

              //console.log('this.leaveProfileValue--->',this.leaveProfileValue);
            } else if(result.value == undefined) {
              
              this.leaveProfileValue=this.initalLeaveProfile;
            }
        })
      } else if(!this.editable) {
        
        this.leaveProfileValue=e.value;
      }

    


      // console.log('this.leaveProfileValue-->',this.leaveProfileValue);
    }

    public onstartDtChange(e){
      this.startdateValue=moment(e.value).format('L');
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
    public changedContractStatus(e: any): void {
      this.empStatusValue=e.value;
    }

    public changedEmpGrades(e: any): void {
      this.empGradValue=e.value;
    }

    public changedDept(e: any): void {
      this.deptValue=e.value;
      if(e.value!=''){
        this.DesgnList(e.value);
      }
    }

    public changedGender(e: any): void {
      this.genderValue=e.value;
    }

    public changedDesgn(e: any): void {
      this.desgnValue=e.value;
    }

    public changedEmpRole(e: any): void{
      this.empRoleValue=e.value;
    }

    public AddForm(){
      let user_info:object;
      if(localStorage.getItem('user_info')){
        user_info= JSON.parse(localStorage.getItem('user_info'));
      }
      this.EmpRoles();
      this.empType();
      this.empStatus();
      this.GetEmployeeRoleByOrgID();
      this.DeptList();
      this.GetAllLeaveProfileSetupByOrgID()

      this.showEmployeeList=false;
      this.showAddForm=true;
      this.empProfileForm.patchValue({
        firstName: '',
        lastName:'',
        email: '',
        empID: '',
        joinedDate:'',
        summary:'',
        workEmail:'',
      })

      this.editable=false;
      this.empTypeValue='';
      this.desgnValue='';
      this.deptValue='';
      this.empRoleValue='';
      this.empStatusValue='';
      this.employeeRoleValue = '';
      this.phone='';
    }

    public empStatus(){
      this.empService.GetEmployeeStatusByOrgID().subscribe(
        (data:any)  => {

  var results=[{ id: '  ', text: 'Select' }]
  // let dataObj = JSON.parse(data['token']);
//

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
"id": data[i].id,
"text": data[i].employee_status_name
});

}


this.employeeStatus =results;




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
    public EmpRoles(){
      this.empService.GetEmployeeRoles().subscribe(
        (data:any)  => {

  var results=[{ id: '  ', text: 'Select' }]
  // let dataObj = JSON.parse(data['token']);
//

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
"id": data[i].id,
"text": data[i].normalizedName
});

}


this.employeeRole =results;



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
    public empType(){
      this.empService.GetEmployeeTypeByOrgID().subscribe(
        (data:any)  => {

  var results=[{ id: '  ', text: 'Select' }]
  // let dataObj = JSON.parse(data['token']);
//

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
"id": data[i].id,
"text": data[i].employee_type_name
});

}


this.employeeType =results;




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
    public EmployeeView(){
      this.fetchGridDataEmployeeByOrgID();

      this.showEmployeeList=true;
      this.showAddForm=false;
      //this.EmpList();
    }
    public goBack(){
      window.history.go(-1);
    }

    isEmpProfileFieldValid(field: string) {
      if(this.addformSubmitted){
        return (

          this.empProfileForm.get(field).errors && this.empProfileForm.get(field).touched ||
          this.empProfileForm.get(field).untouched &&
          this.addformSubmitted
        );
      }
      else if(this.editformSubmitted){
        return (

          this.empProfileForm.get(field).errors &&
          this.editformSubmitted
        );
      }
      else{
        return false;
      }

    }

      profileEffectiFrom(e) {
        this.effectDateValue=moment(e.value).format('L');
      }

  public onAddSubmit(e){
    this.addformSubmitted=true;

      console.log(this.empProfileForm.get('openingBal').value.length);

    let postData={
      full_name: this.empProfileForm.get('firstName').value +' '+ this.empProfileForm.get('lastName').value ,
      first_name: this.empProfileForm.get('firstName').value,
      last_name: this.empProfileForm.get('lastName').value,
      workEmail: this.empProfileForm.get('email').value,
      joined_date: moment(this.empProfileForm.get('joinedDate').value).format('L') ,
      phone: this.phoneNumberValue,
      "phone_iso_name":this.phoneNumberCode,
      deptid:this.deptValue,
      emp_status_id:this.empStatusValue,
      emp_type_id:this.empTypeValue,
      role_id: this.employeeRoleValue,
      designation_id:this.desgnValue,
      "leave_profile_setup_id": this.leaveProfileValue,
      open_balance_days :this.empProfileForm.get('openingBal').value.length > 0 ? this.empProfileForm.get('openingBal').value  : 0,
      open_balance_sick : this.empProfileForm.get('opnBlncSic').value.length > 0   ? this.empProfileForm.get('opnBlncSic').value  : 0,
      profile_effective_from_date : this.effectDateValue  != '' ? this.effectDateValue : null
    }
     
   
      
      console.log("postData--->",postData);

    if(this.empProfileForm.get('firstName').value != '' && this.empProfileForm.get('lastName').value !== ''  &&this.empProfileForm.get('email').status=='VALID' && !this.phoneInvalid ) {
      this.spinner.show();
      return this.empService.AddEmployee(postData).subscribe((data:any)  => {
        if(data.status==200){
          this.EmployeeView();
          this.addformSubmitted=false;
          this.spinner.hide();
          this.toastr.success(data['desc'], undefined,{
            positionClass: 'toast-top-center'
          });
        }else{
          this.spinner.hide();
          Swal.fire(
          'Error!',
          data['result'].desc,
          'error'
          )
        }
      },error  => {
        Swal.fire(
        'Error!',
        'Error.',
        'error')
      });
    }
  }


    public  DeptList(){

      this.deptService.getAllDept().subscribe(
        (data:any)  => {

          var results=[{ id: '  ', text: 'Select' }]
          // let dataObj = JSON.parse(data['token']);
        //

for (var i = 0; i < data.length; i++) {
    // logik to create new items

    results.push({
        "id": data[i].id,
        "text": data[i].dep_name
    });

}


this.departmentData =results;


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

        onChange(event){
          console.log('onChange',event);
          if(event!=null){
let phoneNo={
  "PhoneNumber":event.dialCode+event.number
}
this.phoneNumberValue=event.dialCode+event.number;
this.phoneNumberCode=event.countryCode;
          this.empService.IsPhoneValid(phoneNo).subscribe(
            (data:any)  => {

              if(data.status==200){
                this.phoneInvalid=false;


              }else{
                this.phoneInvalid=true;
                this.phoneErrorMsg=data['desc'];

              }




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
          }else{
            this.phoneNumberValue=null;
            this.phoneNumberCode=null;
          }
        }
    public onEditSubmit(e){
      e.preventDefault();

      this.editformSubmitted=true;
      // this.empProfileForm.get('deptName').valueChanges
      // .subscribe((mode: string) => {
      //   if (mode) {
      //
      //   }
      // });
      let superadmin=false;
      let admin=false;
      if(localStorage.getItem('user_info')){
        this.user_info= JSON.parse(localStorage.getItem('user_info'));
      }

      let postData={
        id:this.editDeptId,
        full_name: this.empProfileForm.get('firstName').value.concat(" ", this.empProfileForm.get('lastName').value),
         first_name: this.empProfileForm.get('firstName').value,
      last_name: this.empProfileForm.get('lastName').value,
      workEmail: this.empProfileForm.get('email').value,
      //   emp_code:this.empProfileForm.get('empID').value,
      //  dob: this.empProfileForm.get('dob').value,
      joined_date: moment(this.empProfileForm.get('joinedDate').value).format('L'),
      //"phone":(this.empProfileForm.get('phone').value!=null && this.empProfileForm.get('phone').value!='')? this.empProfileForm.get('phone').value.internationalNumber.replace(/ /g, ""):null,
      "phone":this.phoneNumberValue,
      "phone_iso_name":this.phoneNumberCode,
        // summary: this.empProfileForm.get('summary').value,


        deptid:this.deptValue,
        emp_status_id:this.empStatusValue,
        emp_type_id:this.empTypeValue,
        role_id: this.employeeRoleValue,
        designation_id:this.desgnValue,
        is_admin:this.isAdmin,
        is_superadmin:this.isSuperAdmin,
        "leave_profile_setup_id": this.leaveProfileValue,
            open_balance_days :this.empProfileForm.get('openingBal').value != undefined ? this.empProfileForm.get('openingBal').value  : 0,
        open_balance_sick : this.empProfileForm.get('opnBlncSic').value != undefined ? this.empProfileForm.get('opnBlncSic').value  : 0,
        profile_effective_from_date : this.effectDateValue  != '' ? this.effectDateValue : null
        }



          if (this.empProfileForm.get('firstName').value !== ''  && !this.phoneInvalid) {
      this.spinner.show();


              return this.empService.updateEmp(postData).subscribe(
                (data:any)  => {
                  // let dataObj = JSON.parse(data['token']);


                if(data.status==200){
                  this.EmployeeView();
      this.editformSubmitted=false;
      this.editable=false;
            this.spinner.hide();

                  this.toastr.success(data['desc'], undefined,{
                    positionClass: 'toast-top-center'
               });

                }else{
   this.spinner.hide();

                  Swal.fire(
                    'Error!',
                    data['result'].desc,
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                      //  this.router.navigate(['/dashboard']);
                    })
                }
                this.AddNewSubmit=true;
                // this.router.navigate(["/organizations"]);

                },
                error  => {
            this.spinner.hide();

                  Swal.fire(
                    'Error!',
                    'Error.',
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {
                      //  this.router.navigate(['/dashboard']);
                    })

                }

                )



        }
      }
      private resetForm(){
        this.empProfileForm.reset();
        this.empTypeValue='';
        this.deptValue='';
        this.desgnValue='';
        this.empGradValue='';
        this.empStatusValue='';
        this.employeeRoleValue='';
      }


    public onAddNewSubmit(e){
      this.addformSubmitted=true;
      this.spinner.show();
      e.preventDefault();

      let postData={
        full_name: this.empProfileForm.get('firstName').value +' '+ this.empProfileForm.get('lastName').value ,
        first_name: this.empProfileForm.get('firstName').value,
        last_name: this.empProfileForm.get('lastName').value,
        workEmail: this.empProfileForm.get('email').value,
        "phone":(this.empProfileForm.get('phone').value!=null && this.empProfileForm.get('phone').value!='')? this.empProfileForm.get('phone').value.internationalNumber.replace(/ /g, ""):null,
        "phone_iso_name":this.phoneNumberCode,
        deptid:this.deptValue,
        emp_status_id:this.empStatusValue,
        emp_type_id:this.empTypeValue,
        role_id: this.employeeRoleValue,
        designation_id:this.desgnValue,
        "leave_profile_setup_id": this.leaveProfileValue
      }

      if(this.empProfileForm.get('firstName').value != '' && this.empProfileForm.get('lastName').value !== '' && ((this.empProfileForm.get('phone').value != '' && this.empProfileForm.get('phone').value != null)?this.empProfileForm.get('phone').status=='VALID':true) &&this.empProfileForm.get('email').status=='VALID'){
        return this.empService.AddEmployee(postData).subscribe((data:any) => {
          if(data.status==200){
            this.addformSubmitted = false;
            this.resetForm();
            this.spinner.hide();
            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
            });
          }else{
            this.spinner.hide();
            Swal.fire(
            'Error!',
            data['result'].desc,
            'error')
          }
        },error  => {
          this.spinner.hide();
            Swal.fire(
            'Error!',
            'Error.',
            'error')
        });
      }
    }

    public  EmpListByOrgId(){
      this.empService.getEmployeeByOrgId().subscribe(

        (data:any) => {

          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          // let dataObj = JSON.parse(data['token']);
        //

// for (var i = 0; i < data.length; i++) {
//     // logik to create new items

//     this.employeeType.push({
//         "id": data[i].id,
//         "text": data[i].first_name
//     });

// }
        // this.employeeList.push(data);

        // this.dataSource = data;

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
        public  fetchGridDataEmployeeByOrgID(){
          this.empService.fetchGridDataEmployeeByOrgID().subscribe(

            (data:any) => {
              let datas = new DataManager(data);
              this.dataSource=datas.dataSource['json']
            //   this.initialSort = {
            //     columns: [{ field: 'dep_name', direction: 'Ascending' },
            //     { field: 'alias', direction: 'Descending' }]
            // };
            this.pageSettings = {pageSizes: true, pageCount: 5 }
            this.toolbar = ['Search','ExcelExport', 'PdfExport' ];

            this.pgData=data;

              let ds= data.slice(0, this.pageSize);
              let ds1 = new DataManager(ds);
      //this.dataSource=ds1.dataSource['json'];
              // let dataObj = JSON.parse(data['token']);
            //

    // for (var i = 0; i < data.length; i++) {
    //     // logik to create new items

    //     this.employeeType.push({
    //         "id": data[i].id,
    //         "text": data[i].first_name
    //     });

    // }
            // this.employeeList.push(data);

            // this.dataSource = data;

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
        public  EmpList(){
          this.empService.getAllEmployee().subscribe(

            (data:any) => {



              // let dataObj = JSON.parse(data['token']);
            //

    for (var i = 0; i < data.length; i++) {
        // logik to create new items

        this.employeeType.push({
            "id": data[i].id,
            "text": data[i].first_name
        });

    }
            // this.employeeList.push(data);


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
            public clearSearchField() {
              this.searchField = '';
              this.EmpListByOrgId();
            }
            public  DesgnList(deptValue){

              this.desgnService.getDesgnByDeptId(deptValue).subscribe(
                (data:any)  => {

          var results=[{ id: '  ', text: 'Select' }]
          // let dataObj = JSON.parse(data['token']);
        //

for (var i = 0; i < data.length; i++) {
    // logik to create new items

    results.push({
        "id": data[i].id,
        "text": data[i].designation_name
    });

}


this.desgnData =results;
if(this.editable){
  setTimeout(()=>{
    this.desgnValue=this.editDesgnId

  },500)
}



                },
                error  => {
                  Swal.fire(
                    'Error!',
                    'error',
                    'error'
                  ).then(
                    //used Arrow function here
                    (result)=> {

                      //  this.router.navigate(['/dashboard']);
                    })


                }

                )
                }

  public empEdit(dept_id,deptid){
    this.AddNewSubmit=false;
    this.editable=true;
    this.editDeptId=dept_id;
    this.initalLeaveProfile = '';
    this.defaultProfileSelected = false;
    let postData={
      id:dept_id
    }
    this.empService.getByEmployeeID(postData).subscribe((data:any) => {
      let phone=data.phone
      this.empProfileForm.patchValue({
        firstName: data.first_name,
        lastName:data.last_name,
        email: data.workemail,
        empID: data.emp_code,
        joinedDate:data.joined_date!=null?moment(data.joined_date).format('L'):'',
        summary:new FormControl(''),
        workEmail:new FormControl(''),
        opnBlncSic:data.open_balance_sick,
        openingBal:data.open_balance_days ? data.open_balance_days : 0,
        profileEffecti:data.profile_effective_from_date!=null?moment(data.profile_effective_from_date).format('L'):'',
        ...phone && { phone:data.phone ? data.phone:''}
      })

      if(data['is_superadmin']==true){
        this.isSuperAdmin=true;
        this.isAdmin=false;
      }
      if(data['is_admin']==true && data['is_superadmin']==false){
        this.isAdmin=true
        this.isSuperAdmin=false;
      }
      if(data['is_admin']==false && data['is_superadmin']==false){
        this.isSuperAdmin=false;
        this.isAdmin=false;
      }
      if(data.phone_iso_name!=null && data.phone_iso_name!='string'){
        this.selectedISO=data.phone_iso_name;
      }else{
        this.selectedISO=CountryISO.UnitedArabEmirates;
      }
      this.editDesgnId=data.designation_id;
      this.deptValue=data.deptid;
      this.phoneNumberValue=data.phone;
      if(data.phone_iso_name!='string'){
        this.phoneNumberCode=data.phone_iso_name;
      }
      let phoneNo={
        "PhoneNumber":this.phoneNumberValue
      }
      if(data.phone!=null){
        this.empService.IsPhoneValid(phoneNo).subscribe((data:any)  => {
          if(data.status==200){
            this.phoneInvalid=false;
          }else{
            this.phoneInvalid=true;
            this.phoneErrorMsg=data['desc'];
          }
        },error  => {
          Swal.fire(
          'Error!',
          error,
          'error'
        )})
      }else{
        this.phoneInvalid=false
      }
      this.phone=data.phone;
      this.empStatusValue=data.emp_status_id;
      this.employeeRoleValue = data.role_id;
      this.DesgnList(data.deptid);
      setTimeout(()=>{
        this.deptValue=data.deptid;
      }, 1000);
      setTimeout(()=>{
        this.GetAllLeaveProfileSetupByOrgID();
        this.desgnValue=data.designation_id;
        this.empTypeValue=data.emp_type_id;
        this.leaveProfileValue = data.leave_profile_setup_id;
        this.initalLeaveProfile = data.leave_profile_setup_id;

        this.empRoleValue=data.role_id;
        console.log(this.leaveProfileValue)
      }, 2000);
      this.showEmployeeList=false;
      this.showAddForm=true;
    },error => {
      Swal.fire(
      'Error!',
      error,
      'error'
    )})
  }

            public empDelete(deptId){
   this.spinner.show();

              let postData={
                id:deptId
              }
              this.empService.delEmp(postData).subscribe(
                (data:any)  => {

                  if(data.status==200){
                    this.spinner.hide();

                    this.fetchGridDataEmployeeByOrgID();

                    this.toastr.error(data['desc'], undefined,{
                      positionClass: 'toast-top-center'
                 });


                          }else
                          {
                            this.spinner.hide();

                            Swal.fire({

                                title: 'Are you sure?',
                                text: data['desc'],
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Ok!'
                              }).then((result) => {
                                if (result.value) {
                                     this.removePermanentEmp(deptId);


                                }
                              })

                            }


                },
                error  => {
                  this.spinner.hide();

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

              public removePermanentEmp(deptId){
                this.spinner.show();

                let postData={
                  ID:deptId
                }
                this.empService.RemoveEmployeePermanent(postData).subscribe(
                  (data:any)  => {

                    if(data.status==200){

                      this.fetchGridDataEmployeeByOrgID();
                      this.spinner.hide();

                      this.toastr.error(data['desc'], undefined,{
                        positionClass: 'toast-top-center'
                   });


                            }else
                            {
                              this.spinner.hide();

                              Swal.fire(
                                'Error!',
                                data['result'].desc,
                                'error'
                              ).then(
                                //used Arrow function here
                                (result)=> {
                                  //  this.router.navigate(['/dashboard']);
                                })

                              }


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
                public  FetchGridDataByDepartmentOrgID() {
                  this.deptService.fetchGridDataByDepartmentOrgID().subscribe(
                    (data:any)  => {
                this.user_info={};
                var results=[]

                   if(data){

                    if(localStorage.getItem('user_info')){
                      this.user_info= JSON.parse(localStorage.getItem('user_info'));
                      if(this.user_info['is_superadmin']==true){

                         this.headerText= [  { text: 'All Employees','id':'Emp' },{ text: 'Team','id':'Team' }
                        //this.headerText= [ { text: 'Team' }
                      ];
                      data.forEach(element => {
                        this.headerText.push({'text':element.dep_name,'id':element.department_id})
                      });
                      }
                      if(this.user_info['is_admin']==true && this.user_info['is_superadmin']==false){

                        this.headerText= [{ text: 'All Employees','id':'Emp' }, { text: 'Team','id':'Team' }

                      ];
                      data.forEach(element => {
                        if(element.department_id==this.user_info['deptid']){
                          this.headerText.push({'text':element.dep_name,'id':element.department_id})

                        }
                      });
                      }
                      if(this.user_info['is_admin']==false && this.user_info['is_superadmin']==false){
                        this.headerText= [];
                      }

                    }



                   }





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

  ngOnInit() {
    this.fetchGridDataEmployeeByOrgID();
    this.FetchGridDataByDepartmentOrgID();
    this.DeptList();
    this.EmpRoles();
    this.empType();
    this.empStatus();
    this.GetEmployeeRoleByOrgID();
    this.empProfileForm.valueChanges.subscribe(() => {
      this.addformSubmitted=false;
      this.editformSubmitted=false;
    });

    $("#selWidth").select2({dropdownCssClass : 'bigdrop'});
    if(JSON.parse(localStorage.getItem('userRights')).length!=0){
      let userRights= JSON.parse(localStorage.getItem('userRights'));
      for(var i=0;i<userRights.length;i++){
        if(userRights[i].module_name=='Employee'){
          if(userRights[i].section_name=='View List' && userRights[i].is_allow==true ){
            this.showList=true
          }else if(userRights[i].section_name=='View List' && userRights[i].is_allow==false ){
            this.showList=false
          }
          if(userRights[i].section_name=='Add' && userRights[i].is_allow==true ){
            this.showAddBtn=true
          }else if(userRights[i].section_name=='Add' && userRights[i].is_allow==false ){
            this.showAddBtn=false
          }
          if(userRights[i].section_name=='Edit' && userRights[i].is_allow==true ){
            this.showEditBtn=true
          }else if(userRights[i].section_name=='Edit' && userRights[i].is_allow==false ){
            this.showEditBtn=false
          }
          if(userRights[i].section_name=='Delete' && userRights[i].is_allow==true ){
            this.showDeleteBtn=true
          }else if(userRights[i].section_name=='Delete' && userRights[i].is_allow==false ){
            this.showDeleteBtn=false
          }
        }
      }
    }else{
      this.showList=true
      this.showAddBtn=true
      this.showEditBtn=true
      this.showDeleteBtn=true
    }
  }

  GetAllLeaveProfileSetupByOrgID(){
    let postData = { "orgID": localStorage.getItem('org_id') }
    this.AdministrativeService.GetAllLeaveProfileSetupByOrgID(postData).subscribe((data:any) => {



      let results = [{ id: '  ', text: 'Select' }]
      data.map((elm)=>{
        if(elm.is_approved === true){    
          if(elm.is_default  && !this.editable ) { 
            this.defaultProfileSelected = true;
            this.leaveProfileValue  =  elm.leaveDetails[0].id;
            this.lpSetupOptions={
              width: "100%",
              placeholder:{
                "id": elm.leaveDetails[0].id,
                "text": elm.profileName
              }
            }
          } 
          else if(this.editable &&  this.initalLeaveProfile =='' && elm.profileName == 'UAE Leave Profile'  )   {
            this.leaveProfileValue  =  elm.leaveDetails[0].id;
            this.lpSetupOptions={
              width: "100%",
              placeholder:{
                "id": elm.leaveDetails[0].id,
                "text": elm.profileName
              }
            }
          }
          
          else if(this.editable &&  this.initalLeaveProfile != '' )   {
            this.leaveProfileValue = this.initalLeaveProfile;
            console.log(' this.initalLeaveProfile -->', )
             this.lpSetupOptions={
              width: "100%",
              placeholder:{
                "id": elm.leaveDetails[0].id,
                "text": elm.profileName
              }
            }
          } 
          else {
            this.lpSetupOptions={
              width: "100%",
              // placeholder:{
              //   "id": '',
              //   "text": 'No Leave profile'
              // }
            }
          }
          results.push({
            "id": elm.leaveDetails[0].id,
            "text": elm.profileName
          });
          // results.push({
          //   "id": '',
          //   "text": 'No Leave profile'
          // })
          
          
        }
      });
      
     results.unshift({ "id": '', "text": 'No Leave Profile'});
      this.leaveProfileType = results;
    });
  }

  GetEmployeeRoleByOrgID(){
    this.empService.GetEmployeeRoleByOrgID().subscribe((data:any) => {
      //console.log(data)
      let results = [{ id: '  ', text: 'Select' }]
      data.map((elm)=>{
        results.push({
          "id": elm.id,
          "text": elm.role_name
        });
      });
      this.employeeRoleData = results;
    });
  }

  changedemployeeRole(e: any): void{
    this.employeeRoleValue = e.value;
  }

}






