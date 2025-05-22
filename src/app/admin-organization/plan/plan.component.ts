import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import moment = require('moment');
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource } from '@angular/material';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})

export class PlanComponent implements OnInit {
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
  public priorityForm: FormGroup;
  public form: FormGroup;

  public date=moment().format('dddd, D MMM YYYY');  
  dataSource: any;
  employeeList=[];

  
  public displayedColumns = ['index','priority_name','desc','Action'];
  editTaskId: any;
  searchField: string;
  AddNewSubmit: boolean;
  constructor(public subscribeService:SubscriptionService,private toastr: ToastrService,  private formBuilder: FormBuilder,public empService:EmployeeService,
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
    this.editable=false;

  
}
public TaskView(){
  this.GetPriorityByOrgID();

  this.showTaskList=true;
  this.showAddForm=false;
}
applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
public onAddSubmit(){
  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  let postData={
       
    plan_name: this.priorityForm.get('priorityName').value  ,
    plan_desc: this.priorityForm.get('desc').value,
    

     
    }
    

    
     
        return this.subscribeService.AddPlan(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          
          if(data.status==200){
            this.TaskView();
            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });
          

          }
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
public onAddNewSubmit(){
  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  let postData={
       
    plan_name: this.priorityForm.get('priorityName').value  ,
    plan_desc: this.priorityForm.get('desc').value,
    

     
    }
    

    
     
        return this.subscribeService.AddPlan(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          
          if(data.status==200){
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
      this.GetPriorityByOrgID();
    } 
    public  getAllPriority(){
      this.subscribeService.getAllPriority().subscribe(
        
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
    

        public taskEdit(dept_id){
          this.AddNewSubmit=false;
          this.editable=true;
        this.editTaskId=dept_id;
        this.showTaskList=false;
        this.showAddForm=true;
          let postData={
            id:dept_id
          }
          this.subscribeService.FindByPlanID(postData).subscribe(
            (data:any)  => {
             
             let postData={
       
              plan_name: this.priorityForm.get('priorityName').value  ,
              plan_desc : this.priorityForm.get('desc').value,
             
          
               
              }
              this.priorityForm.setValue({
           
                priorityName: data.plan_name,
                desc:data.plan_desc,
                
              
              })
              this.EmpList();
              // this.DesgnList();

              this.taskPriority=data.priority,
             this.taskStatus=data.status,
              this.assigneeStatus=data.assigned_empid

            //   this.priorityForm.valueChanges.subscribe(  
            //     value=> {  
            //        
            //     }  
            //  );

            //  this.priorityForm.get('firstName').valueChanges.subscribe(val=>{
            //    if(data.first_name!=val){
            //     

            //    }
            // })
            // this.priorityForm.get('firstName')
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
          // this.priorityForm.get('deptName').valueChanges
          // .subscribe((mode: string) => {
          //   if (mode) {
          //    
          //   }
          // });
      
          let postData={
            id:this.editTaskId,
       
            plan_name: this.priorityForm.get('priorityName').value  ,
            plan_desc: this.priorityForm.get('desc').value,
            
        
             
            }
         
              
             
              if (this.priorityForm.get('priorityName').value !== '') {
              
               
                  return this.subscribeService.UpdatePlan(postData).subscribe(
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
          this.subscribeService.RemovePlan(postData).subscribe(
            (data:any)  => {
              // let dataObj = JSON.parse(data['token']);
            
            if(data.status==200){
              this.GetPriorityByOrgID();

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
          public  GetPriorityByOrgID(){
            this.subscribeService.GetAllPlan().subscribe(
              
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
  ngOnInit() {
    // this.getAllPriority();
    this.GetPriorityByOrgID();

    this.priorityForm = new FormGroup({
      priorityName: new FormControl('', [Validators.required]),
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
