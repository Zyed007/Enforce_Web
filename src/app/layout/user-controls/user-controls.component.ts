import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ModuleSetupService } from '../../services/moduleSetup.service';
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource } from '@angular/material';
import { DataManager } from '@syncfusion/ej2-data';

import { TabComponent, SelectEventArgs, EJ2Instance, ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DepartmentService } from '../../services/department.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { UserService } from '../../services/user.service';
declare var $:any
@Component({
  selector: 'app-user-controls',
  templateUrl: './user-controls.component.html',
  styleUrls: ['./user-controls.component.scss']
})
export class UserControlsComponent implements OnInit {
  dataSource: any;
  toolbar: string[];
  pageSettings: { pageSizes: boolean; pageCount: number; };
  pgData: any;
  /* headerText= [  { text: 'USER','id':'Emp' },{ text: 'DEPARTMENT','id':'Dept' }];deptList: Object[]; */
  headerText= [  { text: 'USER','id':'Emp' }];deptList: Object[];
public checkFields: Object = { text: 'text', value: 'id' };
public index = 0;
// set the placeholder to the MultiSelect input
public checkWaterMark: string = 'Select';
// set enableGroupCheckBox value to the Multiselect input
public enableGroupCheckBox: boolean = true;
// set mode value to the multiselect input
public mode: string = 'CheckBox';
// set filterBarPlaceholder value to the Multiselect input
public filterBarPlaceholder: string = 'Search'
  rolesForm: FormGroup;
  ejsModuleList: { id: string; text: string; }[];
  employeeRole: { id: string; text: string; }[];
  entityId: any;
  showUserDetails: boolean;
  employeeDetails: any={
    full_name:'',
    dep_name:'',
    designation_name:'',
    workemail:'',
    employeeRole:[],
    departmentRole:[]
  };
  @ViewChild('grid',{static:false})
  public grid: GridComponent;
  showUserControls: boolean;
  constructor(public moduleSetupService:ModuleSetupService,public empService:EmployeeService,private deptService:DepartmentService,private toastr:ToastrService,private userService:UserService) { }
  public  fetchGridDataEmployeeByOrgID(){
    this.empService.fetchGridDataEmployeeByOrgID().subscribe(

      (data:any) => {

        // this.dataSource = new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator;
        let datas = new DataManager(data);
        this.dataSource=datas.dataSource['json']
      //   this.initialSort = {
      //     columns: [{ field: 'dep_name', direction: 'Ascending' },
      //     { field: 'alias', direction: 'Descending' }]
      // };
      this.pageSettings = {pageSizes: true, pageCount: 5 }
      this.toolbar = ['Search','ExcelExport', 'PdfExport', ];


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
      AddRoles(id,type){
        this.entityId=id;
        // this.EmpRoles();
if(type=='User'){
  this.showUserDetails=true
  this.GetEmployeeRoleByEmpID(id);
}else{
  this.showUserDetails=false
  this.GetDepartmentRoleByDepartmentID(id);


}


        $('#roles_modal').modal('show')
      }
      public goBack(){
        window.history.go(-1);
      }
      OnRoleClose(){
        $('#roles_modal').modal('hide')
        if(this.showUserDetails){
          this.GetEmpListWithRolesByOrgID();
          this.index=0;
        }else{
          this.GetDepListWithRolesByOrgID();
          this.index=1;

        }
      }
      public tabSelected(args: SelectEventArgs): void {

      //   this.headerText= [  { text: 'USER','id':'Emp' },{ text: 'DEPARTMENT','id':'Dept' }

      // ];

       if(args.selectedItem.innerText=="USER"){

      //  this.fetchGridDataEmployeeByOrgID();


       }else if(args.selectedItem.innerText=="DEPARTMENT"){

// this.FetchGridDataByDepartmentOrgID();
this.GetDepListWithRolesByOrgID();

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
     public removeFromArray(original, remove) {
       console.log('filter', original.filter(value => !remove.includes(value.id)));
  this.employeeRole =original.filter(value => !remove.includes(value.id));

      return original.filter(value => !remove.includes(value.id));
    }
     GetEmployeeRoleByEmpID(empid){
       let postData={
         id:empid
       }
      this.empService.GetEmployeeRoleByEmpID(postData).subscribe(

        (data:any) => {

        if(data){
this.employeeDetails=data;
let roleId=[]
let explicitRoles=[]
for (var i=0;i<data.employeeRole.length;i++){
    explicitRoles.push(data.employeeRole[i].id)
  }
this.removeFromArray(this.employeeRole,explicitRoles)


// this.rolesForm.patchValue({
//   roleModule:roleId
// })
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
        public getUsersInfo(){
          let userId={
           ID: localStorage.getItem('user_id')
          }
           this.userService.getByUserID(userId).subscribe(
             data  => {

            if(data){
              localStorage.setItem("userRights", JSON.stringify(data['userRights']));

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
           ;
       }
        removeEmpRoles(empid,roleid,type){
          let postData={
            "entityID": empid,
            "roleID": [
              roleid
            ]
          }


         this.empService.DeleteEmployeeRoles(postData).subscribe(

           (data:any) => {


           if(data.status==200){
            if(type=='User'){
              this.GetEmpListWithRolesByOrgID();

            }else{
              this.GetDepListWithRolesByOrgID();

            }
            this.getUsersInfo();
            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
          });
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
        GetDepartmentRoleByDepartmentID(empid){
          let postData={
            id:empid
          }
         this.empService.GetDepartmentRoleByDepartmentID(postData).subscribe(

           (data:any) => {


           if(data){
            this.employeeDetails=data;
            console.log('employeeDetails',this.employeeDetails)
            // this.employeeDetails.departmentRole=data.departmentRole;
            // let roleId=[]

            // for (var i=0;i<data.departmentRole.length;i++){
            //   roleId.push(data.departmentRole[i].id);
            // }
            // this.rolesForm.patchValue({
            //   roleModule:roleId
            // })
            let explicitRoles=[]
for (var i=0;i<data.departmentRole.length;i++){
    explicitRoles.push(data.departmentRole[i].id)
  }
this.removeFromArray(this.employeeRole,explicitRoles)
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
  public  EmpListByOrgId(){
    this.empService.getEmployeeByOrgId().subscribe(

      (data:any) => {

        this.dataSource = new MatTableDataSource(data);


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
      GetEmployeeRoleByOrgID(){
        this.empService.GetEmployeeRoleByOrgID().subscribe(
          (data:any)  => {

    var results=[]
    // let dataObj = JSON.parse(data['token']);
  //

  for (var i = 0; i < data.length; i++) {
  // logik to create new items

  results.push({
  "id": data[i].id,
  "text": data[i].role_name
  });

  }


  this.employeeRole =results;
  // this.rolesForm.patchValue({
  //   roleModule:["ba636c47-8ab7-4960-961f-2e290e543891","ca562145-a169-43b5-b3fe-7affb6150ae8"]
  // })


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
      GetEmpListWithRolesByOrgID(){
        this.empService.GetEmpListWithRolesByOrgID().subscribe(
          (data:any)  => {
            let datas = new DataManager(data);
            this.dataSource=datas.dataSource['json']

          this.pageSettings = {pageSizes: true, pageCount: 5 }
          this.toolbar = ['Search','ExcelExport', 'PdfExport', ];



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
      GetDepListWithRolesByOrgID(){
        this.empService.GetDepListWithRolesByOrgID().subscribe(
          (data:any)  => {
          //   let datas = new DataManager(data);
          //   this.dataSource=datas.dataSource['json']

          // this.pageSettings = {pageSizes: true, pageCount: 5 }
          // this.toolbar = ['Search','ExcelExport', 'PdfExport', ];
          let datas = new DataManager(data);
          this.deptList=datas.dataSource['json']

       this.pageSettings = {pageSizes: true, pageCount: 5 }
       this.toolbar = ['Search','ExcelExport', 'PdfExport'];



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
  // this.rolesForm.patchValue({
  //   roleModule:["ba636c47-8ab7-4960-961f-2e290e543891","ca562145-a169-43b5-b3fe-7affb6150ae8"]
  // })


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


            //  let dataObj = JSON.parse(data['token']);

          let datas = new DataManager(data);
           this.deptList=datas.dataSource['json']

        this.pageSettings = {pageSizes: true, pageCount: 5 }
        this.toolbar = ['Search','ExcelExport', 'PdfExport'];




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
          SubmitRoles(){
            let postData={
              entityID :  this.entityId,
              roleID : this.rolesForm.get('roleModule').value
            }
            console.log('SubmitRoles',postData);

            this.empService.SetEmployeeRoles(postData).subscribe(
              (data:any)  => {


              if(data.status=="200"){
                if(this.showUserDetails){
                  this.GetEmpListWithRolesByOrgID();

                }else{
                  this.GetDepListWithRolesByOrgID();

                }
            this.getUsersInfo();

                this.toastr.success(data['desc'], undefined,{
                  positionClass: 'toast-top-center'
              });
                this.rolesForm.reset();
                this.OnRoleClose();
              }
              }
              )
          }
          public FetchModulesOrgID(){
            this.moduleSetupService.FetchModulesOrgID().subscribe(
              (data:any)  => {


                var results=[{ id: '', text: 'Select Module' }]

                // let dataObj = JSON.parse(data['token']);
              //

          for (var i = 0; i < data.length; i++) {
          // logik to create new items

          results.push({
              "id": data[i].id,
              "text": data[i].module_name
          });

          }

          this.ejsModuleList =results;
              }
              )
          }
  ngOnInit() {
    // this.fetchGridDataEmployeeByOrgID();
    this.GetEmpListWithRolesByOrgID();
    this.GetEmployeeRoleByOrgID();

    this.rolesForm = new FormGroup({
      roleModule: new FormControl(''),




   });
   if(JSON.parse(localStorage.getItem('userRights')).length!=0){
    console.log('if')
    let userRights= JSON.parse(localStorage.getItem('userRights'));
    for(var i=0;i<userRights.length;i++){
      if(userRights[i].module_name=='User Controls'  ){
        if(userRights[i].section_name=='View Controls' && userRights[i].is_allow==true ){
          this.showUserControls=true
        }
      else if(userRights[i].section_name=='View Controls' && userRights[i].is_allow==false ){
        this.showUserControls=false

      }

  console.log('userRights',userRights[i].section_name)

    }else{
    //   this.showProjectList=true
    // this.showAddBtn=true
    // this.showEditBtn=true
    // this.showDeleteBtn=true
    // this.viewDashboard=true

    }
    }

  }else{
    console.log('else')
    this.showUserControls=true





  }
this.FetchModulesOrgID();

  }

}
