import { Component, OnInit, ViewChild } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { patternValidator } from '../../shared/services';
import Swal from 'sweetalert2';
import { DepartmentService } from '../../services/department.service';
import {MatTableDataSource,MatSort,MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DataManager, Query, UrlAdaptor, WebApiAdaptor, ODataAdaptor } from '@syncfusion/ej2-data';
import { GridComponent, EditService, ToolbarService, PageService, ColumnChooserService, EditSettingsModel, ToolbarItems, GridLine,SearchSettingsModel, Column, valueAccessor, ValueAccessor,SortService  } from '@syncfusion/ej2-angular-grids';
import { GroupService } from '@syncfusion/ej2-angular-grids';
import { TimeSheetService } from '../../services/timesheet.service';
import moment = require('moment');
import { FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { loadCldr, L10n } from '@syncfusion/ej2-base';

let user_info:object;
if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));

}

@Component({
  selector: 'app-activities-view',
  templateUrl: './activities-view.component.html',
  styleUrls: ['./activities-view.component.scss'],
  providers: [GroupService, SortService]

})


export class ActivitiesViewComponent implements OnInit {
  dataSource: any;
  editDeptId:string;
  delDeptId:string;
 
 
public showDeptList=true;
public showAddForm=false;
public departmentLeadData: Array<Select2OptionData>;
public taskData: Array<Select2OptionData>;
public departmentLeadValue: string;
public selectedPurpose: string;
public selectedProject: string;
public selectedTask: string;
public deptOptions:Select2Options;
public deptForm: FormGroup;
public displayedColumns = [ 'index','dep_name', 'alias','workemail','lead_name','Action'];
public editable=false;
public AddNewSubmit=true;
public addformSubmitted=false;
public editformSubmitted=false;
searchField;
public compData: Object[];
public data: DataManager;
public title: string = 'Attorney Comp';
public lines: GridLine = <GridLine>'Both';
public editSettings: EditSettingsModel;
public toolbar: string[];
public initialSort: Object;
public pageSettings: Object;
public searchOptions: SearchSettingsModel;
public groupOptions: Object;
public refresh: Boolean;
public dateValue: Date = new Date();
public minDate: Date = new Date('1/15/2017');
public maxDate: Date = new Date('12/20/2017');
public today: Date = new Date(new Date().toDateString());
    public weekStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() + 7) % 7)).toDateString());
    public weekEnd: Date = new Date(new Date(new Date().setDate(new Date(new Date().setDate((new Date().getDate()
        - (new Date().getDay() + 7) % 7))).getDate() + 6)).toDateString())
        ;
    public monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
    public monthEnd: Date = this.today;
    public lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
    public lastEnd: Date = this.today;
    public yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
    public yearEnd: Date = this.today;
    public filterOptions: FilterSettingsModel;

@ViewChild('grid',{static:false})
public grid: GridComponent;
  dateRangeForm: FormGroup;
  dateValues: any;
  fromDateValue: string;
  toDateValue: string;
dataBound() {
  if(this.refresh){
      this.grid.groupColumn('dep_name');
      this.refresh =false;
  }
}
load() {
  this.refresh = (<any>this.grid).refreshing;
}
created() {
  // this.grid.on("columnDragStart", this.columnDragStart, this);
}

@ViewChild(MatSort, {static: false}) sort: MatSort;
public columns: Object[];
  @ViewChild('gridAttorneyComp', {static: false})
  public gridComp: GridComponent;
  data12: Object[];
  constructor(private deptService: DepartmentService,private timesheet:TimeSheetService, private empService:EmployeeService, private toastr: ToastrService,public router:Router) 
  
  {
    
    this.departmentLeadValue = '';
    this.selectedPurpose = '';
    this.selectedProject='';
    this.selectedTask='';
    this.deptOptions={
      placeholder: { id: '  ', text: 'Select' },  allowClear: true,
      width:'100%'
    }
     this.departmentLeadData = []
   }
  
   public AddForm(){
    this.EmpList();
    this.AddNewSubmit=true;
    this.showDeptList=false;
    this.showAddForm=true;
    this.editable=false;
    this.deptForm.setValue({
   
      dep_name:'',
      alias:''
    
    
    })
    this.departmentLeadValue='';

}
public toDashboardUser(){
  this.router.navigate(['/dashboard-user']);

}
public DeptView(){
  this.showDeptList=true;
  this.showAddForm=false;
  this.FetchGridDataByDepartmentOrgID();
//  this.router.navigate(["/departments"]);
}
public changedLead(e: any): void {
  this.selectedTask= e.value;
  
  this.departmentLeadValue=e.value;


}
public clearSearchField() {
  this.searchField = '';
  this.FetchGridDataByDepartmentOrgID();
} 
public deptEdit(dept_id){
  this.EmpList();
   this.addformSubmitted=false;
this.editformSubmitted=true;

  this.editable=true;
  this.AddNewSubmit=false;
this.editDeptId=dept_id;
  let postData={
    id:dept_id
  }
  this.deptService.getByDeptID(postData).subscribe(
    (data:any)  => {
      
      this.deptForm.setValue({
   
        dep_name: data.dep_name,
        alias:data.alias
      
      
      })
      this.departmentLeadValue=data.depart_lead_empid;
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
public deptDelete(deptId){
let postData={
  id:deptId
}
this.deptService.delDept(postData).subscribe(
  (data:any)  => {
    
    if(data.status==200){
    this.FetchGridDataByDepartmentOrgID();
               
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
public  DeptList(){
  
  this.deptService.getAllDept().subscribe(
    (data:any)  => {
      

      //  let dataObj = JSON.parse(data['token']);
    
  
     this.dataSource = data;
    
    // this.router.navigate(["/organizations"]  );

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
    
    public  GetTimesheetActivityByEmpIDAndDate(fromDate,toDate) {
      let user:object={};
if(localStorage.getItem('user_info')){
    user= JSON.parse(localStorage.getItem('user_info'));

}
      let postData={
        "EmpID": user['id'],
        "StartDate": fromDate,
        "EndDate":  toDate
      }
      this.timesheet.GetTimesheetActivityByEmpIDAndDate(postData).subscribe(
        (data:any)  => {
          
    
          //  let dataObj = JSON.parse(data['token']);
        
        let datas = new DataManager(data);
        this.data12=datas.dataSource['json']
    
        this.groupOptions = { showGroupedColumn: false,showDropArea: false,  columns: ['timesheet'] };
      this.pageSettings = {pageSizes: true, pageCount: 5 }
     
      
      this.toolbar = ['Search'];
    //  this.searchOptions = { fields: ['dep_name'], operator: 'contains', key: 'Ha', ignoreCase: true };
        //  this.compData = data;
        //  this.gridComp.dataSource = data;
        //  this.gridComp.allowPaging = false;
        //  this.gridComp.pageSettings = { pageSize: this.compData.length };
        //  this.gridComp.columns = this.displayedColumns;
         // this.dataSource.paginator = this.paginator;
        //  this.dataSource.sort = this.sort;
        
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
    
    let datas = new DataManager(data);
    this.data12=datas.dataSource['json']

    this.groupOptions = { showGroupedColumn: false,showDropArea: false,  columns: ['dep_name','alias'] };
  this.pageSettings = {pageSizes: true, pageCount: 5 }
 
    this.initialSort = {
      columns: [{ field: 'dep_name', direction: 'Ascending' },
      { field: 'alias', direction: 'Descending' }]
  };
  this.toolbar = ['Search'];
//  this.searchOptions = { fields: ['dep_name'], operator: 'contains', key: 'Ha', ignoreCase: true };
     this.dataSource =  new MatTableDataSource(data);
    //  this.compData = data;
    //  this.gridComp.dataSource = data;
    //  this.gridComp.allowPaging = false;
    //  this.gridComp.pageSettings = { pageSize: this.compData.length };
    //  this.gridComp.columns = this.displayedColumns;
     // this.dataSource.paginator = this.paginator;
    //  this.dataSource.sort = this.sort;
    
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
    isFieldValid(field: string) {
      if(this.addformSubmitted){
        return (
        
          this.deptForm.get(field).errors && this.deptForm.get(field).touched ||
          this.deptForm.get(field).untouched &&
          this.addformSubmitted
        );
      }
      else if(this.editformSubmitted){
        return (
        
          this.deptForm.get(field).errors &&
          this.editformSubmitted
        );
      }
      else{
        return false;
      }
     
    } 
public onAddSubmit(e){
  this.addformSubmitted = true;
e.preventDefault();
  let postData={
    
      dep_name: this.deptForm.get('dep_name').value  ,
      alias: this.deptForm.get('alias').value,
      depart_lead_empid: this.departmentLeadValue
   
       
      }

     
      
       
      let postValues= this.getDirtyValues(this.deptForm);
      
     
      if (this.deptForm.get('dep_name').value !== '' ) {
      // 
   
          return this.deptService.AddDept(postData).subscribe(
            (data:any)  => {
              // let dataObj = JSON.parse(data['token']);
            
            if(data.status==200){
              this.DeptView();
              this.addformSubmitted = false;
              

              this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
           });
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
  public onEditSubmit(e){
    e.preventDefault();
    this.editformSubmitted=true;

    this.deptForm.get('dep_name').valueChanges
    .subscribe((mode: string) => {
      if (mode) {
       
      }
    });
    let postData={
            id:this.editDeptId,
        dep_name: this.deptForm.get('dep_name').value  ,
        alias: this.deptForm.get('alias').value,
        depart_lead_empid: this.departmentLeadValue
     
         
        }
        
        
      let postValues= this.getDirtyValues(this.deptForm);
      postValues['id']=this.editDeptId;
      

        if (this.deptForm.get('dep_name').value !== '') {
        
         
            return this.deptService.updateDept(postData).subscribe(
              (data:any)  => {
                // let dataObj = JSON.parse(data['token']);
              
              
              
                if(data.status==200){
               this.editformSubmitted=false;
               this.addformSubmitted=false;
               this.editable=false;

                  this.toastr.success(data['desc'], undefined,{
                    positionClass: 'toast-top-center'
               });
                }
                // this.AddNewSubmit=true;
                this.DeptView();
  
            
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

    public onAddNewSubmit(e){
      this.addformSubmitted = true;
      e.preventDefault();
      let postData={
    
        dep_name: this.deptForm.get('dep_name').value  ,
        alias: this.deptForm.get('alias').value,
        depart_lead_empid: this.departmentLeadValue
     
         
        }
        
        
       
        if (this.deptForm.get('dep_name').value !== '') {
          
       
              return this.deptService.AddDept(postData).subscribe(
                (data:any)  => {
                  // let dataObj = JSON.parse(data['token']);
                
                if(data.status==200){
                  this.addformSubmitted = false;

                  this.toastr.success(data['desc'], undefined,{
                    positionClass: 'toast-top-center'
               });
    
                }
                this.AddNewSubmit=true;
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
      this.empService.fetchGridDataEmployeeByOrgID().subscribe(
        
        (data:any) => {
          

var results=[{ id: '', text: 'Select' }]
          // let dataObj = JSON.parse(data['token']);
        // 
      
for (var i = 0; i < data.length; i++) {
    // logik to create new items
  
    results.push({

        "id": data[i].id,
        "text": data[i].full_name
    });

}

        
this.departmentLeadData =results;
  
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
    // this.DeptList();
    // this.EmpList();
    // this.FetchGridDataByDepartmentOrgID();
    this.GetTimesheetActivityByEmpIDAndDate(moment(this.today).format('L'),moment(this.today).format('L'));
    
    this.dateRangeForm = new FormGroup({
      daterange: new FormControl(''),
     


          
   });  
   this.dateRangeForm.patchValue({
    daterange:[new Date(moment().format('L')), new Date(moment().format('L'))]
   })
   this.dateRangeForm.get('daterange').valueChanges.subscribe(() => {
    // fires when the input value has actually changed
   
    let startTime=this.dateRangeForm.get('daterange').value;
    this.fromDateValue=moment(startTime[0]).format('L');
    this.toDateValue=moment(startTime[1]).format('L');
this.GetTimesheetActivityByEmpIDAndDate(this.fromDateValue,this.toDateValue);

    // 






});
this.filterOptions = {
  type: 'Menu',
  operators: {
      stringOperator: [
          { value: 'startsWith', text: 'starts with' },
          { value: 'endsWith', text: 'ends with' },
          { value: 'contains', text: 'contains' }
       ],
   }
};
    // $.getScript("assets/js/departments-datatable.js")

  }

}