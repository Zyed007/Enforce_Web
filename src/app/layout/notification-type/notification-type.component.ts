import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import moment = require('moment');
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource } from '@angular/material';
import { DataManager } from '@syncfusion/ej2-data';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-type',
  templateUrl: './notification-type.component.html',
  styleUrls: ['./notification-type.component.scss'],
  providers:[TaskService]

})

export class NotificationTypeComponent implements OnInit {
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

  public date=moment().format('dddd, D MMM YYYY');  
  dataSource: any;
  employeeList=[];

  
  public displayedColumns = ['index','status_name','desc','Action'];
  editTaskId: any;
  searchField: string;
  AddNewSubmit: boolean;
  pageSettings: { pageSizes: boolean; pageCount: number; };
  toolbar: string[];
  pgData: any=[];
  pageSize: any = 10;
  currentPage: any = 1;
  addformSubmitted: boolean;
  constructor(public taskService:TaskService,public notifyService:NotificationService,private toastr: ToastrService,  private formBuilder: FormBuilder,public empService:EmployeeService,
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
  public AddForm(){

    this.showTaskList=false;
    this.showAddForm=true;
    this.AddNewSubmit=true;

  
}
public TaskView(){
  this.GetStatusByOrgID();
  this.statusForm.reset();

  this.showTaskList=true;
  this.showAddForm=false;
}
public onAddSubmit(){
  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  let postData={
    id:null,
    notify_type: this.statusForm.get('statusName').value  ,
    notify_desc: this.statusForm.get('desc').value,
    

     
    }
    
this.addformSubmitted=true;
    if(this.statusForm.get('statusName').status=='VALID'){
this.addformSubmitted=false;
     
        return this.notifyService.AddNotifyType(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          
          if(data.status==200){
            this.TaskView();
            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });
          //  this.TaskView();

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
  let postData={
    id:null,   
    notify_type: this.statusForm.get('statusName').value  ,
    notify_desc: this.statusForm.get('desc').value,
    
    

     
    }
    
    this.addformSubmitted=true;

    
    if(this.statusForm.get('statusName').status=='VALID'){
    this.addformSubmitted=false;
     
        return this.notifyService.AddNotifyType(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          
          if(data.status==200){
            this.statusForm.reset();
            this.toastr.success(data.desc);

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
      this.GetStatusByOrgID();
    } 
    public  getAllTaskStatus(){
      this.taskService.getAllTaskStatus().subscribe(
        
        (data:any) => {

        this.dataSource =new MatTableDataSource(data);
        
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
        public taskEdit(dept_id){
          this.GetStatusByOrgID();
          
          this.editable=true;
        this.editTaskId=dept_id;
        this.showTaskList=false;
        this.showAddForm=true;
          let postData={
            orgID:dept_id
          }
          this.notifyService.FindByNotifyTypeID(postData).subscribe(
            (data:any)  => {
             
          
              this.statusForm.setValue({
           
                statusName: data.notify_type,
                desc:data.notify_desc,
                
              
              })
              this.EmpList();
              // this.DesgnList();

              this.taskPriority=data.priority_id,
             this.taskStatus=data.status_id,
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
            notify_type: this.statusForm.get('statusName').value  ,
            notify_desc: this.statusForm.get('desc').value,
             
            }
         
              
             
            if(this.statusForm.get('statusName').status=='VALID'){
      this.addformSubmitted=false;
              
               
                  return this.notifyService.UpdateNotifyType(postData).subscribe(
                    (data:any)  => {
                      // let dataObj = JSON.parse(data['token']);
                    
                    
                    if(data.status==200){
                      this.editable=false;

                      this.TaskView();
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
          this.notifyService.RemoveNotifyType(postData).subscribe(
            (data:any)  => {
              
              if(data.status==200){
                this.GetStatusByOrgID();

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
          public  GetStatusByOrgID(){
            this.notifyService.FetchGridDataNotifyTypeByOrgID().subscribe(
              
              (data:any) => {
      
              //this.dataSource = new MatTableDataSource(data);
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
        //this.dataSource=ds1.dataSource['json'];
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
              public goBack(){
                window.history.go(-1);
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
    // this.getAllTaskStatus();
this.GetStatusByOrgID();
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
