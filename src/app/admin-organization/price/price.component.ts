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
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})


export class PriceComponent implements OnInit {
  public taskPriority:string;
  public taskStatus:string;
  public BillingCycle: Array<Select2OptionData>;
  public taskStatusData: Array<Select2OptionData>;
  public planData: Array<Select2OptionData>;
  public assigneeData: Array<Select2OptionData>;
  public showTaskList=true;
  public showAddForm=false;
  public assigneeStatus:string;
  public taskOptions:Select2Options;
  public editable=false;
  public priorityForm: FormGroup;
  public form: FormGroup;
  public planValue: string;
  public billValue: string;


  public date=moment().format('dddd, D MMM YYYY');  
  dataSource: any;
  employeeList=[];

  
  public displayedColumns = ['index','priority_name','desc','Action'];
  editTaskId: any;
  searchField: string;
  AddNewSubmit: boolean;
  addformSubmitted: boolean;
  editformSubmitted: any;
  // planValue: any;
  
  constructor(public subscribeService:SubscriptionService,private toastr: ToastrService,  private formBuilder: FormBuilder,public empService:EmployeeService,
    ) { 
    this.taskPriority = '0';
    this.taskStatus = '0';
    
    
    this.BillingCycle = [
   
      
  { id: '1', text: 'Monthly' },
  { id: '2', text: 'Yearly' },
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
  public changedBillingCycle(e: any): void {
    // this.billValue= e.value;
    
     this.billValue= e.value;

  }
  public AddForm(){
    this.planValue='';
    this.editable=false;

    this.GetAllPlan();

    this.showTaskList=false;
    this.showAddForm=true;
     this.priorityForm.reset();
    //  this.planValue='';
    this.AddNewSubmit=true;
  
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
  this.addformSubmitted=true;

  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  let plan_id=this.priorityForm.get('planName').value;
  let postData={
    plan_id: this.planValue,
    price_amount:'$'+ this.priorityForm.get('priorityName').value  ,
    billing_cycle: this.billValue=='1'?'Monthly':'Yearly',
    

     
    }
    

    
     if(this.priorityForm.get('priorityName').value!='' && this.priorityForm.get('planName').value!='' ){

      return this.subscribeService.AddPlanPrice(postData).subscribe(
        (data:any)  => {
          // let dataObj = JSON.parse(data['token']);
        
        if(data.status==200){
          this.TaskView();
          this.addformSubmitted=false;
          this.priorityForm.reset();
          this.planValue='';
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
       
      
      
   
 
}
public onAddNewSubmit(){
  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  this.addformSubmitted=true;

  let postData={
    plan_id: this.planValue,
       
    price_amount:'$'+ this.priorityForm.get('priorityName').value  ,
    billing_cycle: this.billValue,
    

     
    }
    

    
     
        return this.subscribeService.AddPlanPrice(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          
          if(data.status==200){
            this.addformSubmitted=false;
            this.priorityForm.reset();

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
          this.subscribeService.FindByPlanPriceID(postData).subscribe(
            (data:any)  => {
             
             let postData={
       
              price_amount: this.priorityForm.get('priorityName').value  ,
              billing_cycle : this.priorityForm.get('desc').value,
             
          
               
              }
              this.priorityForm.patchValue({
           
                priorityName: data.price_amount,
                desc:data.billing_cycle,
                
              
              })
              this.GetAllPlan();
              // this.DesgnList();

              this.planValue=data.plan_id
           

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
        isFieldValid(field: string) {
          if(this.addformSubmitted){
            return (
            
              this.priorityForm.get(field).errors && this.priorityForm.get(field).touched ||
              this.priorityForm.get(field).untouched &&
              this.addformSubmitted
            );
          }
          else if(this.editformSubmitted){
            return (
            
              this.priorityForm.get(field).errors &&
              this.editformSubmitted
            );
          }
          else{
            return false;
          }
         
        } 
        public onEditSubmit(){
          // this.priorityForm.get('deptName').valueChanges
          // .subscribe((mode: string) => {
          //   if (mode) {
          //    
          //   }
          // });
          this.editformSubmitted=true;

      
          let postData={
            id:this.editTaskId,
    plan_id: this.planValue,
       
    price_amount:'$'+ this.priorityForm.get('priorityName').value   ,
            billing_cycle: this.priorityForm.get('desc').value,
            
        
             
            }
         
              
             
              if (this.priorityForm.get('priorityName').value !== '') {
              
               
                  return this.subscribeService.UpdatePlanPrice(postData).subscribe(
                    (data:any)  => {
                      // let dataObj = JSON.parse(data['token']);
                    
                    if(data.status==200){
                      this.editable=false;
                      this.TaskView();

                      this.editformSubmitted=false;

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
          this.subscribeService.RemovePlanPrice(postData).subscribe(
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
            this.subscribeService.GetAllPlanPrice().subscribe(
              
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
              public  GetAllPlan(){
                this.subscribeService.GetAllPlan().subscribe(
                  
                  (data:any) => {
          
                
var results=[{ id: '', text: 'Select' }]
// let dataObj = JSON.parse(data['token']);
// 

for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
"id": data[i].id,
"text": data[i].plan_name
});

}


this.planData =results;
            
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
                  public changedPlan(e: any): void {
                    
                    this.planValue=e.value;
                  
                  
                  }
  ngOnInit() {
    // this.getAllPriority();
    this.GetPriorityByOrgID();
    this.billValue='Monthly';
    this.priorityForm = new FormGroup({
      priorityName: new FormControl('', [Validators.required]),
      planName: new FormControl('', [Validators.required]),
      // desc: new FormControl(''),
    


          
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