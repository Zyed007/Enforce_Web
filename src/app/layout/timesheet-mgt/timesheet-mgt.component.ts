import { Component, OnInit, ViewChild, ChangeDetectorRef,ChangeDetectionStrategy } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { patternValidator } from '../../shared/services';
import Swal from 'sweetalert2';
import { DepartmentService } from '../../services/department.service';
import {MatTableDataSource,MatSort,MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { TeamService } from '../../services/team.service';
import { DesignationService } from '../../services/designation.service';
import { DataManager } from '@syncfusion/ej2-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

let orgId= localStorage.getItem('org_id');
let user_info:object;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));


}
let teamArr=[];
@Component({
  selector: 'app-timesheet-mgt',
  templateUrl: './timesheet-mgt.component.html',
  styleUrls: ['./timesheet-mgt.component.scss'],

})
  export class TimesheetMgtComponent implements OnInit {
    @ViewChild('table', { static: true }) table
    pageSize: any = 10;
    currentPage: any = 1;
    pgData=[];
    dataSource: any;
    empDataSource:any;

    editDeptId:string;
    delDeptId:string;


  public showDeptList=true;
  public showAddForm=false;
  public teamData: Array<Select2OptionData>;
  public teamLeadData: Array<Select2OptionData>;
  public deptData: Array<Select2OptionData>;
  public desgnData: Array<Select2OptionData>;

  public deptValue: string;

  public teamValue: string='';
  public teamLeadValue: string;
  public selectedPurpose: string;
  public selectedProject: string;
  public selectedTask: string;
  public deptOptions:Select2Options;
  public multioptions:Select2Options;
  public deptForm: FormGroup;
  public displayedColumns = [ 'index','team_name', 'desc','lead_name','Action'];

  public displayedEmpColumns= [ 'index','emp_name', 'dept','desgn','Action'];

  public editable=false;
  public AddNewSubmit=true;
  public addCurrentUser=false;
  public teamMembers=[];
  public teamMemFetchData=[];
  public teamEmpName;
  public filterEmpByDesgn=false;
  public filterEmpByDept=false;
  public filterEmpByFreeLanc=false;
  public filterEmpByOutsource=false;

public deptEmpValue: string;
public desgnEmpValue: string;
  searchField;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  selectedItems: { "id": number; "itemName": string; }[];
  dropdownSettings: { singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; classes: string; };
  dropdownList: { "id": number; "itemName": string; }[];
  options: {
  multiple: boolean; placeholder: string;
    // allowClear: true,
    width: string; templateResult: any; templateSelection: any;
  };
  team_by: any;
  showDeptSelect: boolean=false;
  showDesgnSelect: boolean=false;
  pageSettings: { pageSizes: boolean; pageCount: number; };
  toolbar: string[];
  @ViewChild('empgrid',{   static: false })
  empgrid;
  @ViewChild('grid',{   static: false })
  grid;
  emptoolbar: string[];
  showList: boolean;
  showAddBtn: boolean;
  showEditBtn: boolean;
  showDeleteBtn: boolean;

    constructor(private deptService: DepartmentService,private spinner:NgxSpinnerService, private desgnService: DesignationService,private changeDetectorRefs: ChangeDetectorRef,private empService:EmployeeService,private teamService:TeamService, private toastr: ToastrService,public router:Router)

    {

      this.teamValue = '';
      this.teamLeadValue='';
      this.selectedPurpose = '';
      this.deptValue='';
      this.selectedProject='';
      this.selectedTask='';
      this.deptOptions={
        placeholder: { id: '  ', text: 'Select' },  allowClear: true,
        width:'100%'
      }
     }
     public checkIsDept(){
      this.filterEmpByDept=!this.filterEmpByDept
      if(this.filterEmpByDept){
        this.teamData=[];

        $('#toggleDesgnCheck').attr("disabled","disabled");
        $('#toggleFreeLanCheck').attr("disabled","disabled");
        $('#toggleOutSourceCheck').attr("disabled","disabled");
      }else{
        $('#toggleDesgnCheck').removeAttr('disabled');
        $('#toggleFreeLanCheck').removeAttr('disabled');
        $('#toggleOutSourceCheck').removeAttr('disabled');

      }
     }
     public goBack(){
      window.history.go(-1);
    }
     public checkIsDesgn(){
      this.filterEmpByDesgn=!this.filterEmpByDesgn
      this.teamData=[];
      if(this.filterEmpByDesgn){
        $('#toggleDeptCheck').attr("disabled","disabled");
        $('#toggleFreeLanCheck').attr("disabled","disabled");
        $('#toggleOutSourceCheck').attr("disabled","disabled");
      }else{
        $('#toggleDeptCheck').removeAttr('disabled');
        $('#toggleFreeLanCheck').removeAttr('disabled');
        $('#toggleOutSourceCheck').removeAttr('disabled');

      }
     }
     public checkIsFreeLan(){
      this.filterEmpByFreeLanc=!this.filterEmpByFreeLanc
      if(this.filterEmpByFreeLanc){
        this.EmpList();

        $('#toggleDeptCheck').attr("disabled","disabled");
        $('#toggleDesgnCheck').attr("disabled","disabled");
        $('#toggleOutSourceCheck').attr("disabled","disabled");
      }else{
        $('#toggleDeptCheck').removeAttr('disabled');
        $('#toggleDesgnCheck').removeAttr('disabled');
        $('#toggleOutSourceCheck').removeAttr('disabled');

      }
     }
     public checkIsOutsource(){
      this.filterEmpByOutsource=!this.filterEmpByOutsource
      if(this.filterEmpByOutsource){
        this.EmpList();

        $('#toggleDeptCheck').attr("disabled","disabled");
        $('#toggleFreeLanCheck').attr("disabled","disabled");
        $('#toggleDesgnCheck').attr("disabled","disabled");
      }else{
        $('#toggleDeptCheck').removeAttr('disabled');
        $('#toggleFreeLanCheck').removeAttr('disabled');
        $('#toggleDesgnCheck').removeAttr('disabled');

      }
     }
     public AddForm(){
      this.EmpList();
      this.getAllDept();
      this.getAllDesignationByOrgID();
  this.AddNewSubmit=true;
      this.showDeptList=false;
      this.showAddForm=true;
      this.editable=false;
      this.deptForm.patchValue({

        team_name:'',
        desc:''


      })
      this.teamValue='';
      this.teamLeadValue='';
      this.deptValue='';
      this.deptEmpValue='';
      this.desgnEmpValue='';
      this.filterEmpByDept=false;
      this.filterEmpByDesgn=false;


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
  public DeptView(){
    this.showDeptList=true;
    this.showAddForm=false;
    this.teamMemFetchData=[];
    this.teamMembers=[];
    this.teamValue='';
    this.teamLeadValue='';
    this.deptValue='';
    this.deptEmpValue='';
    this.desgnEmpValue='';
    this.filterEmpByDept=false;
    this.filterEmpByDesgn=false;
    this.getTeamByOrgID();
  //  this.router.navigate(["/departments"]);
  }
  public onCheckChange(){
    this.addCurrentUser=!this.addCurrentUser;


  }
  public changedTeam(e: any): void {
    this.teamValue=e.value;
    if(e.data[0]){
      this.teamEmpName=e.data[0].text;

    }

  }
  public changedEmpDept(e: any): void {
    this.deptEmpValue=e.value;
    if( this.deptEmpValue){
      this.EmpList();
    }


  }
  public changedEmpDesgn(e: any): void {
    this.desgnEmpValue=e.value;
    if( this.deptEmpValue){
      this.EmpList();
    }


  }
  public changedLead(e: any): void {
    this.team_by=e.data[0].text;

    this.teamLeadValue=e.value;


  }
  public changedDept(e: any): void {
    this.deptValue= e.value;



  }
  public clearSearchField() {
    this.searchField = '';
    this.FetchGridDataByDepartmentOrgID();
  }

  public FetchAllTeamMembersByTeamID(postData){

    this.teamService.FetchAllTeamMembersByTeamID(postData).subscribe(
      (data:any)  => {

        // this.teamValue=data.teammember_empids;
        // this.teamLeadValue=data.team_lead_empid;
        // this.deptValue=data.team_department_id;
        var results=[]
        // let dataObj = JSON.parse(data['token']);
      //

for (var i = 0; i < data.length; i++) {
  // logik to create new items

  results.push(

       data[i].emp_id

  );

}


this.teamMembers =results;
        this.teamMemFetchData=data;
        // this.checkedValues();
        let datas = new DataManager(data);
  this.empDataSource=datas.dataSource['json']
  this.emptoolbar = ['Search' ];


              //}
            //  this.empDataSource=new MatTableDataSource(this.teamMemFetchData);



        //  let dataObj = JSON.parse(data['token']);
    //
    //  this.showDeptList=false;
    //   this.showAddForm=true;

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
  public teamEdit(dept_id){
    this.EmpList();
this.getAllDept();
    this.editable=true;
    this.AddNewSubmit=false;
  this.editDeptId=dept_id;
    let postData={
      ID:dept_id
    }
    this.FetchAllTeamMembersByTeamID(postData)
    this.teamService.getByTeamID(postData).subscribe(
      (data:any)  => {
        this.deptForm.patchValue({

          team_name: data.team_name,
          desc:data.team_desc


        })
        this.teamValue=data.teammember_empids;
        this.teamLeadValue=data.team_lead_id;
        this.deptValue=data.dep_id;

        //  let dataObj = JSON.parse(data['token']);

     this.showDeptList=false;
      this.showAddForm=true;

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
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  public getAllDept(){
    this.deptService.getAllDept().subscribe(

      (data:any) => {


var results=[{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
      //

for (var i = 0; i < data.length; i++) {
  // logik to create new items

  results.push({

      "id": data[i].id,
      "text": data[i].dep_name
  });

}


this.deptData =results;
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

  public getAllDesignationByOrgID(){
    this.desgnService.getAllDesignationByOrgID().subscribe(

      (data:any) => {


var results=[{ id: '', text: 'Select' }]
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
  public getTeamByOrgID(){
    this.teamService.FindTeamsByOrgID().subscribe(


        (data:any) => {
if(data){
  this.pgData=data;

//  let ds= data.slice(0, this.pageSize);
  //let ds1 = new DataManager(ds);
//this.dataSource=ds1.dataSource['json'];


}
         // this.dataSource =  new MatTableDataSource(data);
          // this.dataSource.paginator = this.paginator;
          let datas = new DataManager(data);
          this.dataSource=datas.dataSource['json']
        //   this.initialSort = {
        //     columns: [{ field: 'dep_name', direction: 'Ascending' },
        //     { field: 'alias', direction: 'Descending' }]
        // };
        this.pageSettings = {pageSizes: true, pageCount: 5 }
        this.toolbar = ['Search','ExcelExport', 'PdfExport', ];
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
  public teamDelete(deptId){
    this.spinner.show();

  let postData={
    id:deptId
  }
  this.teamService.teamDelete(postData).subscribe(
    (data:any)  => {

      if(data.status==200){
       this.getTeamByOrgID();
       this.spinner.hide();

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
  }

  public empDelete(id){


    for(var i = 0;i < this.teamMemFetchData.length; i ++)
{
  if((this.teamMemFetchData[i].data?this.teamMemFetchData[i].data.id:this.teamMemFetchData[i].emp_id) ==id)
  {
    this.teamMemFetchData.splice(i, 1);
    this.teamMembers.splice(id,1)


    // this.teams.splice(id,1)
//

//     if(this.teamMemFetchData[i]){
//
//       this.teams.splice(this.teamMemFetchData[i].id,1)
//
//     }
    //else{
    //   this.teamMembers.splice(this.teamMemFetchData[i].id,1)

    // }
  }
}
this.checkedValues();
  }
  public  DeptList(){

    this.deptService.getAllDept().subscribe(
      (data:any)  => {


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
      }
  public  FetchGridDataByDepartmentOrgID() {
    this.deptService.fetchGridDataByDepartmentOrgID().subscribe(
      (data:any)  => {


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
      }
  public onAddSubmit(){
  this.spinner.show();
    let postData={

      team_name: this.deptForm.get('team_name').value  ,
      team_desc: this.deptForm.get('desc').value,
      team_department_id: this.deptValue,
      team_lead_empid: this.teamLeadValue,
        teammember_empids:this.teamMembers,
        team_by:user_info['full_name'],
        is_addme_as_team:this.addCurrentUser

        }


        //

        let postValues= this.getDirtyValues(this.deptForm);


        if (this.deptForm.get('team_name').value !== '') {
        //

            return this.teamService.AddTeam(postData).subscribe(
              (data:any)  => {
                // let dataObj = JSON.parse(data['token']);

              if(data.status==200){
                this.DeptView();
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
              // this.router.navigate(["/organizations"]);

              },
              error  => {
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
    public onEditSubmit(){
      this.spinner.show();

      let postData={
      id:this.editDeptId,
        team_name: this.deptForm.get('team_name').value  ,
        team_desc: this.deptForm.get('desc').value,
        team_department_id: this.deptValue,
        team_lead_empid: this.teamLeadValue,
          teammember_empids:this.teamMembers,
          team_by:user_info['full_name'],
          is_addme_as_team:this.addCurrentUser

          }



          if (this.deptForm.get('team_name').value !== '') {


              return this.teamService.updateTeam(postData).subscribe(
                (data:any)  => {
                  // let dataObj = JSON.parse(data['token']);



                  if(data.status==200){
                    this.editable=false;
                    this.spinner.hide();
                  this.DeptView();


                    this.toastr.success(data['desc'], undefined,{
                      positionClass: 'toast-top-center'
                 });
                  }
                  else{
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
                  // this.AddNewSubmit=true;


                // this.router.navigate(["/organizations"]);

                },
                error  => {
                  this.spinner.hide();

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
      }

      public onAddNewSubmit(){
  this.spinner.show();

        let postData={

          team_name: this.deptForm.get('team_name').value  ,
          team_desc: this.deptForm.get('desc').value,
          team_department_id: this.deptValue,
          team_lead_empid: this.teamLeadValue,
            teammember_empids:this.teamMembers,
            team_by:user_info['full_name'],
            is_addme_as_team:this.addCurrentUser

            }


            //

            let postValues= this.getDirtyValues(this.deptForm);


            if (this.deptForm.get('team_name').value !== '') {
            //
  this.spinner.hide();

                return this.teamService.AddTeam(postData).subscribe(
                  (data:any)  => {
                    // let dataObj = JSON.parse(data['token']);

                  if(data.status==200){
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
      public  EmpList(){
      if(this.filterEmpByDept){
        let deptId={
          ID:this.deptEmpValue
        }
        this.empService.getEmpByDeptID(deptId).subscribe(

          (response:any) => {

  var results=[{ id: '', text: 'Select' }]
  if(response!=null && response.length!=0){

  for (var i = 0; i < response.length; i++) {


      results.push({

          "id": response[i].id,
          "text": response[i].full_name
      });

  }
}


  this.teamData =results;
  // this.teamLeadData=results;
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
      else if(this.filterEmpByDesgn){
        let desgnId={
          ID:this.desgnEmpValue
        }
        this.empService.getEmpByDesgnID(desgnId).subscribe(

          (data:any) => {


  var results=[{ id: '', text: 'Select' }]
  if(data!=null && data.length!=0){

  for (var i = 0; i < data.length; i++) {

      results.push({

          "id": data[i].id,
          "text": data[i].full_name
      });

  }
}

  this.teamData =results;
  // this.teamLeadData=results;
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
      else if(this.filterEmpByFreeLanc){

        this.empService.getAllOutsourcedEmpByOrgID().subscribe(

          (data:any) => {


  var results=[{ id: '', text: 'Select' }]
     if(data!=null && data.length!=0){
      for (var i = 0; i < data.length; i++) {

        results.push({

            "id": data[i].id,
            "text": data[i].full_name
        });

    }

     }


  this.teamData =results;
  // this.teamLeadData=results;
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
      else if(this.filterEmpByOutsource){

        this.empService.getAllOutsourcedEmpByOrgID().subscribe(

          (data:any) => {


  var results=[{ id: '', text: 'Select' }]
  if(data!=null && data.length!=0){

  for (var i = 0; i < data.length; i++) {

      results.push({

          "id": data[i].id,
          "text": data[i].full_name
      });

  }
}

  this.teamData =results;
  // this.teamLeadData=results;
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
      else{
        this.empService.getEmployeeByOrgId().subscribe(

          (data:any) => {


  var results=[{ id: '', text: 'Select' }]

  for (var i = 0; i < data.length; i++) {

      results.push({

          "id": data[i].id,
          "text": data[i].full_name
      });

  }


  this.teamData =results;
  this.teamLeadData=results;
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

          }
          onItemSelect(item:any){


        }
        OnItemDeSelect(item:any){


        }
        onSelectAll(items: any){

        }
        onDeSelectAll(items: any){

        }
public AddTeamMembers(){

  if(this.teamMembers.length==0){

  if(this.teamValue!=''){
    this.teamMembers.push(this.teamValue)


    let teamEmpId={
      ID: this.teamValue
    }
    this.empService.empDepartDesignByEmpID(teamEmpId).subscribe(

      (data:any) => {
        // if(!this.filterEmpByDept && !this.filterEmpByDesgn){
        //   this.teamMemFetchData.push(data[0]);

        // }else{
          this.teamMemFetchData.push({data});

        //}
      //  this.empDataSource=new MatTableDataSource(this.teamMemFetchData);

      this.checkedValues()
      }
      )
  }else{
    Swal.fire(
      'Error!',
       'Please add a valid team member',
      'error'
    ).then(
      //used Arrow function here
      (result)=> {

        //  this.router.navigate(['/dashboard']);
      })
  }


  }
  else{
    if(!this.teamMembers.includes(this.teamValue)){
        this.teamMembers.push(this.teamValue)

            // logik to create new items
            let teamEmpId={
              ID: this.teamValue
            }

            this.empService.empDepartDesignByEmpID(teamEmpId).subscribe(

              (data:any) => {

                // this.teamMemFetchData.push(data[0]);
                this.teamMemFetchData.push({data});

              // this.empDataSource=new MatTableDataSource(data);

               this.checkedValues()
              }
              )


      }else{
        Swal.fire(
          'Error!',
           this.teamEmpName + 'has already been added.Please add other employee',
          'error'
        ).then(
          //used Arrow function here
          (result)=> {

            //  this.router.navigate(['/dashboard']);
          })


      }
  }

}
public checkDeptValue(e: any): void {
  // this.teamValue= e.value;
  this.showDeptSelect=!this.showDeptSelect





}
public checkDesgnValue(e: any): void {
  // this.teamValue= e.value;
  this.showDesgnSelect=!this.showDesgnSelect





}

public checkedValues(){
  // this.empDataSource=new MatTableDataSource(this.teamMemFetchData)
  // this.empDataSource.connect().next(this.teamMemFetchData);
  //
this.empgrid.refresh();
  let datas = new DataManager(this.teamMemFetchData);
  this.empDataSource=datas.dataSource['json']
  this.emptoolbar = ['Search' ];


}
    ngOnInit() {
      // this.DeptList();
       this.getTeamByOrgID();
       if(JSON.parse(localStorage.getItem('userRights')).length!=0){
        console.log('if')
        let userRights= JSON.parse(localStorage.getItem('userRights'));
        for(var i=0;i<userRights.length;i++){
          if(userRights[i].module_name=='Employee'){
            if(userRights[i].section_name=='View List' && userRights[i].is_allow==true ){
              this.showList=true
            }
          else if(userRights[i].section_name=='View List' && userRights[i].is_allow==false ){
            this.showList=false

          }
          if(userRights[i].section_name=='Add' && userRights[i].is_allow==true ){
            this.showAddBtn=true
          }
        else if(userRights[i].section_name=='Add' && userRights[i].is_allow==false ){
          this.showAddBtn=false

        }
        if(userRights[i].section_name=='Edit' && userRights[i].is_allow==true ){
          this.showEditBtn=true
        }
      else if(userRights[i].section_name=='Edit' && userRights[i].is_allow==false ){
        this.showEditBtn=false

      }
      if(userRights[i].section_name=='Delete' && userRights[i].is_allow==true ){
        this.showDeleteBtn=true
      }
      else if(userRights[i].section_name=='Delete' && userRights[i].is_allow==false ){
      this.showDeleteBtn=false

      }

      console.log('userRights',userRights[i].section_name)

        }else{
          // this.showList=true
          // this.showAddBtn=true
          // this.showEditBtn=true
          // this.showDeleteBtn=true
        }
        }

      }else{
        console.log('else')
        this.showList=true
        this.showAddBtn=true
        this.showEditBtn=true
        this.showDeleteBtn=true




      }
      this.multioptions = {
        multiple: true,
        placeholder: "Select",
        // allowClear: true,
        width: "100%",
        // templateResult: this.templateResult,
        // templateSelection: this.templateSelection


      }
      this.dropdownList = [
        {"id":1,"itemName":"India"},
        {"id":2,"itemName":"Singapore"},
        {"id":3,"itemName":"Australia"},
        {"id":4,"itemName":"Canada"},
        {"id":5,"itemName":"South Korea"},
        {"id":6,"itemName":"Germany"},
        {"id":7,"itemName":"France"},
        {"id":8,"itemName":"Russia"},
        {"id":9,"itemName":"Italy"},
        {"id":10,"itemName":"Sweden"}
      ];
this.selectedItems = [
          {"id":2,"itemName":"Singapore"},
          {"id":3,"itemName":"Australia"},
          {"id":4,"itemName":"Canada"},
          {"id":5,"itemName":"South Korea"}
      ];
this.dropdownSettings = {
            singleSelection: false,
            text:"Select Countries",
            selectAllText:'Select All',
            unSelectAllText:'UnSelect All',
            enableSearchFilter: true,
            classes:"mycustom-class-example"
          };


      this.FetchGridDataByDepartmentOrgID();
      this.deptForm = new FormGroup({
        team_name: new FormControl('', [Validators.required]),
       desc:new FormControl(''),



     });
      // $.getScript("assets/js/departments-datatable.js")

    }

  }

  export interface TeamDetails {
    Type: string;
    Name : string;
    Desc: string;
    }


