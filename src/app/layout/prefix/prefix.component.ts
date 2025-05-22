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
import { ProjectService } from '../../services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';
let date=moment(new Date()).format('L');
let formattedPrefix=moment(date).format('YY/MM');
@Component({
  selector: 'app-prefix',
  templateUrl: './prefix.component.html',
  styleUrls: ['./prefix.component.scss']
})

export class PrefixComponent implements OnInit {
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
  public jobNo='0000';
  public prefixString=formattedPrefix;

  public date=moment().format('dddd, D MMM YYYY');  
  dataSource: any;
  prefixList=[];
  employeeList=[];
  pgData: any=[];
  pageSize: any = 10;
  currentPage: any = 1;
  
  public displayedColumns = ['index','priority_name','desc','Action'];
  editTaskId: any;
  searchField: string;
  AddNewSubmit: boolean;
  pageSettings: { pageSizes: boolean; pageCount: number; };
  toolbar: string[];
  formattedPrefix: string;
  inputDisabled: boolean=false;
  txtMsg: string;
  
  constructor(public taskService:TaskService,private spinner:NgxSpinnerService, private toastr: ToastrService,private projectService: ProjectService,  private formBuilder: FormBuilder,public empService:EmployeeService,
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
  public goBack(){
    window.history.go(-1);
  }
  public changedAssignee(e: any): void {
    this.assigneeStatus= e.value;

  }
  public AddForm(){

    this.showTaskList=false;
    this.showAddForm=true;
    this.AddNewSubmit=true;
    this.priorityForm.patchValue({
      no_of_days:'default',
      priorityName:'JOB',
  
     })
  
}
public TaskView(){
  this.GetPriorityByOrgID();
  this.priorityForm.reset();

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
    type: "project",
    prefix_ext:this.priorityForm.get('priorityName').value,   
    prefix_name: this.priorityForm.get('no_of_days').value=='custom'?null:this.priorityForm.get('priorityName').value+this.formattedPrefix,
    prefix_for: this.priorityForm.get('no_of_days').value,
    is_manual_allowed: this.priorityForm.get('no_of_days').value=='custom'?true:false,
    is_revised: false,
    

     
    }
    this.spinner.show();
    

    
     
        return this.projectService.AddPrefix(postData).subscribe(
          (data:any)  => {
          
          if(data.status==200){
            this.TaskView();
    this.spinner.hide();

            this.toastr.success(data['desc'], undefined,{
              positionClass: 'toast-top-center'
         });
          

          }
          },
          error  => {
    this.spinner.hide();

            Swal.fire(
              'Error!',
              'Error.',
              'error'
            ).then(
              (result)=> {
                 
              })
          
          
          }
          
          )
      
      
   
 
}
public onAddNewSubmit(){
  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  let postData={
       
    priority_name: this.priorityForm.get('priorityName').value  ,
    priority_desc: this.priorityForm.get('desc').value,
    

     
    }
    

    
     
        return this.taskService.AddPriority(postData).subscribe(
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
      this.taskService.getAllPriority().subscribe(
        
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
          this.projectService.FindByPrefixId(postData).subscribe(
            (data:any)  => {
             
             
              this.priorityForm.patchValue({
           
                priorityName: data.prefix_ext,
                no_of_days:data.prefix_for
              
              })
     
            this.daysRadioChange();
            
           
            
        
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
            type: "project",
            prefix_ext:this.priorityForm.get('priorityName').value,   
            prefix_name: this.priorityForm.get('no_of_days').value=='custom'?null:this.priorityForm.get('priorityName').value+this.formattedPrefix,
            prefix_for: this.priorityForm.get('no_of_days').value,
            is_manual_allowed: this.priorityForm.get('no_of_days').value=='custom'?true:false,
            is_revised: false,
             
            }
         
              
             
              if (this.priorityForm.get('priorityName').value !== '') {
              
               
                  return this.projectService.UpdatePrefix(postData).subscribe(
                    (data:any)  => {
                    
                    if(data.status==200){
                      this.editable=false;

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
          }
        public taskDelete(deptId){
          let postData={
            id:deptId
          }
          this.projectService.RemovePrefix(postData).subscribe(
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
            this.projectService.GetAllPrefixByOrgID().subscribe(
              
              (data:any) => {
      let projPrefix=[];
              //this.dataSource = new MatTableDataSource(data);
              for(var i=0;i<data.length;i++){
                if(data[i].type=='project'){
                  projPrefix.push(data[i])
                }
              }
              let datas = new DataManager(projPrefix);
              this.dataSource=datas.dataSource['json']
              this.prefixList=projPrefix;
            //   this.initialSort = {
            //     columns: [{ field: 'dep_name', direction: 'Ascending' },
            //     { field: 'alias', direction: 'Descending' }]
            // };
            this.pageSettings = {pageSizes: true, pageCount: 5 }
            this.toolbar = ['Search' ];
              
              
              // this.router.navigate(["/organizations"]);
              if(data){
              this.pgData=data;

              let ds= data.slice(0, this.pageSize);
              let ds1 = new DataManager(ds);
     // this.dataSource=ds1.dataSource['json'];
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
              public daysRadioChange() {
                // if (this.projectForm.get('prefixVal').value == 'is_custom' ||this.conversionForm.get('prefixVal').value == 'is_custom' ) {
                  if (this.priorityForm.get('no_of_days').value == 'default' ) {
                  // let fromDate=moment(this.today).add(7, 'day').toDate();
   this.formattedPrefix='/'+formattedPrefix+'/0000';
this.inputDisabled=false;
this.txtMsg="Eg: JOB/20/08/0000,JOB/20/08/0001"
            
                    // this.statusForm.patchValue({
                    //   endDate:moment(this.today).add(4, 'months').toDate()
                    // })
            
                } 
                else if (this.priorityForm.get('no_of_days').value == 'custom' ) {
                  // this.showPrefixText = false;
                  // let fromDate=moment(this.today).add(14, 'day').toDate();
   this.formattedPrefix='';
this.inputDisabled=true;
this.txtMsg="User is allowed to enter custom prefix"

                  // this.statusForm.patchValue({
                  //   endDate:moment(this.today).add(6, 'months').toDate()
                  // })
                  // this.FindAutoProjectPrefixByOrgID();
            
                }
                else if (this.priorityForm.get('no_of_days').value == 'sequence' ) {
                  // this.showPrefixText = false;
   this.formattedPrefix='/0000';
   this.inputDisabled=false;
   this.txtMsg="Eg: JOB/0000,JOB/0001"


                  // let fromDate=moment(this.today).add(14, 'day').toDate();
                  // this.projectForm.patchValue({
                  //   endDate:moment(this.today).add(8, 'months').toDate()
                  // })
                  // this.FindAutoProjectPrefixByOrgID();
            
                }else  {
                  let random= (Math.floor(1000 + Math.random() * 9000));
   this.formattedPrefix='/'+random;
   this.inputDisabled=false;
   this.txtMsg="Eg: JOB/5454,JOB/8984"



                  // this.showPrefixText = false;
                  // let fromDate=moment(this.today).add(14, 'day').toDate();
                  // this.projectForm.patchValue({
                  //   endDate:moment(this.today).add(45, 'day').toDate()
                  // })
                  // this.FindAutoProjectPrefixByOrgID();
            
                }
              }
  ngOnInit() {
    // this.getAllPriority();
    this.GetPriorityByOrgID();
   
    this.priorityForm = new FormGroup({
      priorityName: new FormControl('', [Validators.required]),
      desc: new FormControl(''),
      no_of_days: new FormControl(''),
    


          
   });
   this.priorityForm.get('no_of_days').valueChanges.subscribe((value) => {
    
  });
   this.priorityForm.patchValue({
    no_of_days:'default',
    priorityName:'JOB',

   })
this.txtMsg="Eg: JOB/20/08/0000,JOB/20/08/0001"

   this.formattedPrefix='/'+formattedPrefix+'/0000';
   this.form = this.formBuilder.group({
    datepicker: [new Date(), Validators.required],
  });

  this.form.valueChanges.subscribe((value) => {
    
  });
  this.form.get('datepicker').valueChanges.subscribe((value) => {
    
  });

  }

}