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
import { NgxSpinnerService } from 'ngx-spinner';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';


let orgId= localStorage.getItem('org_id');

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  providers:[DepartmentService,ToolbarService, EditService, PageService,SortService , ColumnChooserService]
})

export class DepartmentsComponent implements OnInit {
  dataSource: any;
  editDeptId:string;
  delDeptId:string;
  pgData: any=[];
  pageSize: any = 10;
  currentPage: any = 1;
 
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

@ViewChild(MatSort, {static: false}) sort: MatSort;
public columns: Object[];
@ViewChild('grid',{static:false})
    public grid: GridComponent;
  @ViewChild('gridAttorneyComp', {static: false})
  public gridComp: GridComponent;
  data12: any;
  constructor(private deptService: DepartmentService,private spinner:NgxSpinnerService, private empService:EmployeeService, private toastr: ToastrService,public router:Router) 
  
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
public DeptSetup(){
  this.router.navigate(["/setup"]);

}
   public AddForm(){
    this.EmpList();
    this.DeptList();
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
public goBack(){
  window.history.go(-1);
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
  this.spinner.show();
let postData={
  id:deptId
}
this.deptService.delDept(postData).subscribe(
  (data:any)  => {
    
    if(data.status==200){
      this.spinner.hide();
    this.FetchGridDataByDepartmentOrgID();
               
                this.toastr.error(data['desc'], undefined,{
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
public  FetchGridDataByDepartmentOrgID() {
  this.deptService.fetchGridDataByDepartmentOrgID().subscribe(
    (data:any)  => {
      

      //  let dataObj = JSON.parse(data['token']);
    
    let datas = new DataManager(data);
     this.data12=datas.dataSource['json']
    this.initialSort = {
      columns: [{ field: 'dep_name', direction: 'Ascending' },
      { field: 'alias', direction: 'Descending' }]
  };
  this.pageSettings = {pageSizes: true, pageCount: 5 }
  this.toolbar = ['Search','ExcelExport', 'PdfExport'];
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

    this.pgData=data;

    let ds= data.slice(0, this.pageSize);
    let ds1 = new DataManager(ds);
//this.data12=ds1.dataSource['json'];

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
  this.spinner.show();
   
          return this.deptService.AddDept(postData).subscribe(
            (data:any)  => {
              // let dataObj = JSON.parse(data['token']);
            
            if(data.status==200){
              this.DeptView();
              this.addformSubmitted = false;
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
  public onEditSubmit(e){
    this.spinner.show();
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
      this.spinner.show();
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
                  this.spinner.hide();
                  this.deptForm.reset();
                  this.departmentLeadValue='';
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
    this.EmpList();

    this.FetchGridDataByDepartmentOrgID();
    this.deptForm = new FormGroup({
      dep_name: new FormControl('', [Validators.required]),
      alias: new FormControl(''),
     


          
   });  
    // $.getScript("assets/js/departments-datatable.js")

  }

}

export interface CompData {
  field: string,
  headerText: string,
  minWidth: number,
  maxWidth: number,
  width: number,
  allowEditing: Boolean,
  allowFiltering: Boolean,
  allowReordering: Boolean,
  allowResizing: Boolean,
  allowSorting: Boolean,
  isFrozen: Boolean,
  visible: Boolean,
  format: string,
  columns: CompData
}
