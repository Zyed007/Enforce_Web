import { Component, OnInit, ViewChild } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import moment = require('moment');
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource } from '@angular/material';
import { DataManager } from '@syncfusion/ej2-data';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { LeadService } from '../../services/lead.service';
import { QuotationService } from '../../services/quotation.service';

@Component({
  selector: 'app-local-activity',
  templateUrl: './local-activity.component.html',
  styleUrls: ['./local-activity.component.scss']
})

export class LocalActivityComponent implements OnInit {
  public taskPriority:string;
  public taskStatus:string;
  public taskPriorData: Array<Select2OptionData>;
  public taskStatusData: Array<Select2OptionData>;
  public assigneeData: Array<Select2OptionData>;
  public showTaskList=true;
  public showAddForm=false;
  public assigneeStatus:string;
  public taskOptions:Select2Options;
  public editable=false;
  public statusForm: FormGroup;
  public form: FormGroup;
  public AddNewSubmit=true;

  public date=moment().format('dddd, D MMM YYYY');  
  dataSource: any;
  employeeList=[];

  @ViewChild('grid',{static:false})
  public grid: GridComponent;
  public displayedColumns = ['index','status_name','desc','Action'];
  editTaskId: any;
  searchField: string;
  pageSettings: { pageSizes: boolean; pageCount: number; };
  toolbar: string[];
  pgData: any=[];
  pageSize: any = 10;
  currentPage: any = 1;
  addformSubmitted: boolean;
  constructor(public taskService:TaskService,private toastr: ToastrService,private leadService:LeadService,private qtnService:QuotationService,  private formBuilder: FormBuilder,public empService:EmployeeService,
    ) { 
    this.taskPriority = '0';
    this.taskStatus = '0';
    
    
    this.taskPriorData = [
   
      
  { id: '1', text: 'High' },
  { id: '2', text: 'Moderate' },
  { id: '3', text: 'Low' },
  ]
  this.taskStatusData = [
   
    
  { id: '1', text: 'Open' },
  { id: '2', text: 'InProgress' },
  { id: '3', text: 'Completed' },
  ]
  this.assigneeData = [
   
    

  ]
  this.taskOptions={
    placeholder:'Select',
    width:'100%'
  }
  }
  public changedPriority(e: any): void {
    this.taskPriority= e.value;

  } 
   public changedStatus(e: any): void {
    this.taskStatus= e.value;

  }
  public changedAssignee(e: any): void {
    this.assigneeStatus= e.value;

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
  public goBack(){
    window.history.go(-1);
  }
  public AddForm(){
this.addformSubmitted=false;
    this.showTaskList=false;
    this.showAddForm=true;
    this.AddNewSubmit=true;
  
}
public TaskView(){
  this.GetEmployeeTypeByOrgID();
this.statusForm.reset();
  this.showTaskList=true;
  this.showAddForm=false;
}
public onAddSubmit(){
  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  this.addformSubmitted=true;

  let postData={
       
    activity_name: this.statusForm.get('statusName').value  ,
    activity_desc: this.statusForm.get('desc').value,
    
   
     
    }
    

    
    if (this.statusForm.status== 'VALID') {
        return this.qtnService.AddLocalActivity(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          
          if(data.status==200){
            this.TaskView();
            this.addformSubmitted=false;

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
public onAddNewSubmit(){
  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  this.addformSubmitted=true;

  let postData={
       
    activity_name: this.statusForm.get('statusName').value  ,
    activity_desc: this.statusForm.get('desc').value,
    
   
     
    }
    

    
    if (this.statusForm.status== 'VALID') {
        return this.qtnService.AddLocalActivity(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          
          if(data.status==200){
  this.addformSubmitted=false;
this.statusForm.reset();
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
public  EmpList(){
  this.empService.getAllEmployee().subscribe(
    
    (data:any) => {
      var results=[]
      // let dataObj = JSON.parse(data['token']);
    // 
  
for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
    "id": data[i].id,
    "text": data[i].first_name
});

}

    
this.assigneeData =results;
  

   

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
      this.GetEmployeeTypeByOrgID();
    } 
    public  getAllEmpType(){
      this.empService.getAllEmpType().subscribe(
        
        (data:any) => {

        this.dataSource = new MatTableDataSource(data);
        
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
        public  GetEmployeeTypeByOrgID(){
          this.qtnService.FetchLocalActivityOrgID().subscribe(
            
            (data:any) => {
    
           // this.dataSource = new MatTableDataSource(data);
            let datas = new DataManager(data);
            this.dataSource=datas.dataSource['json']
          //   this.initialSort = {
          //     columns: [{ field: 'dep_name', direction: 'Ascending' },
          //     { field: 'alias', direction: 'Descending' }]
          // };
          this.pageSettings = {pageSizes: true, pageCount: 5 }
          this.toolbar = ['Search' ];
          if(data){
            this.pgData=data;

            let ds= data.slice(0, this.pageSize);
            let ds1 = new DataManager(ds);
    this.dataSource=ds1.dataSource['json'];
          }
            
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
    
        applyFilter(filterValue: string) {
          this.dataSource.filter = filterValue.trim().toLowerCase();
        }
        public taskEdit(dept_id){
          this.AddNewSubmit=false;
          this.editable=true;
        this.editTaskId=dept_id;
        this.showTaskList=false;
        this.showAddForm=true;
          let postData={
            id:dept_id
          }
          this.qtnService.FindByLocalActivityID(postData).subscribe(
            (data:any)  => {
             
            
              
              this.statusForm.setValue({
                
                statusName: data.activity_name,
                desc:data.activity_desc,
                
              
              })
             
              // this.DesgnList();

              this.taskPriority=data.priority,
             this.taskStatus=data.status,
              this.assigneeStatus=data.assigned_empid

            //   this.statusForm.valueChanges.subscribe(  
            //     value=> {  
            //        
            //     }  
            //  );

            //  this.statusForm.get('firstName').valueChanges.subscribe(val=>{
            //    if(data.first_name!=val){
            //     

            //    }
            // })
            // this.statusForm.get('firstName')
            // .valueChanges
            // .pipe(pairwise())
            // .subscribe(([prev, next]: [any, any]) => {
            //   
            //   
            // });
              //this.EmpList();
             // this.departmentLeadValue=data.depart_lead_empid;
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
        public onEditSubmit(){
          // this.statusForm.get('deptName').valueChanges
          // .subscribe((mode: string) => {
          //   if (mode) {
          //    
          //   }
          // });
          this.addformSubmitted=true;
      
          let postData={
            id:this.editTaskId,
       
            activity_name: this.statusForm.get('statusName').value  ,
            activity_desc: this.statusForm.get('desc').value,
            
        
             
            }
            
         
              
             
            if (this.statusForm.status== 'VALID') {              
               
                  return this.qtnService.UpdateLocalActivity(postData).subscribe(
                    (data:any)  => {
                      // let dataObj = JSON.parse(data['token']);
                    
                    
                    
                  if(data.status==200){
                    this.TaskView();
                    this.editable=false;
                    this.addformSubmitted=false;
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
        public taskDelete(deptId){
          let postData={
            id:deptId
          }
          this.qtnService.RemoveLocalActivity(postData).subscribe(
            (data:any)  => {
              
              if(data.status==200){
                this.GetEmployeeTypeByOrgID();

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

  ngOnInit() {
     //this.getAllEmpType();
    this.GetEmployeeTypeByOrgID();

    this.statusForm = new FormGroup({
      statusName: new FormControl('', [Validators.required]),
      desc: new FormControl(''),
    


          
   });
   this.form = this.formBuilder.group({
    datepicker: [new Date(), Validators.required],
  });

  this.form.valueChanges.subscribe((value) => {
    
  });
  this.form.get('datepicker').valueChanges.subscribe((value) => {
    
  });

  }

}