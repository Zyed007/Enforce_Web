
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { DepartmentService } from '../../services/department.service';
import { DesignationService } from '../../services/designation.service';

@Component({
  selector: 'app-notification-setup',
  templateUrl: './notification-setup.component.html',
  styleUrls: ['./notification-setup.component.scss'],
  providers:[TaskService],
  encapsulation: ViewEncapsulation.None,
})

export class NotificationSetupComponent implements OnInit {
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
  selectedDeptVal='Department';

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
  notifyTypeData: { id: string; text: string; }[];
  notifyTypeValue: any='';
  filterByDept: boolean=true;
  filterByDesgn: boolean;
  filterByRoles: boolean;
  filterByEmp: boolean;
  deptData: { id: string; text: string; }[];
  desgnData: { id: string; text: string; }[];
  deptEmpValue: any;
  desgnEmpValue: any;
  rolesData: any[];
  addformSubmit: boolean;
  
  constructor(public taskService:TaskService,private deptService:DepartmentService,private desgnService:DesignationService,public notifyService:NotificationService,private toastr: ToastrService,  private formBuilder: FormBuilder,public empService:EmployeeService,
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
  changedNotifyType(e: any): void {
    this.notifyTypeValue= e.value;
    if(e.value==''){
      this.notifyTypeValue='Select'
    }
console.log('notifyTypeValue',this.notifyTypeValue);
  } 
  public onEmpListByChange(val){

    if(val=="Department"){
      this.filterByDept=true
      this.filterByDesgn=false
      this.filterByRoles=false
      this.filterByEmp=false;
      this.getAllDept();
  
  
    }
    else if (val=="Designation"){
      this.filterByDesgn=true
      this.filterByDept=false;
      this.filterByRoles=false
      this.filterByEmp=false;
      this.getAllDesignationByOrgID();
  
  
    }
    else if (val=="Role"){
      this.filterByDesgn=false
      this.filterByDept=false
  this.filterByRoles=true
  this.filterByEmp=false;
  
  this.RoleList();
  
    }
    else{
      this.filterByDesgn=false
      this.filterByDept=false
  this.filterByRoles=false
  this.filterByEmp=true;
  
  this.EmpList();
  
    }
  
  
  }
  public getAllDept(){
    this.deptService.getAllDept().subscribe(
          
      (data:any) => {
        

var results=[]
        // let dataObj = JSON.parse(data['token']);
      // 
    if(data){
      for (var i = 0; i < data.length; i++) {
        // logik to create new items
      
        results.push({
      
            "id": data[i].id,
            "text": data[i].dep_name
        });
      
      }
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
        
  
  var results=[]
        // let dataObj = JSON.parse(data['token']);
      // 
      if(data){
        for (var i = 0; i < data.length; i++) {
          // logik to create new items
          
          results.push({
          
              "id": data[i].id,
              "text": data[i].designation_name
          });
          
          }
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
  
  public changedEmpDept(e: any): void {
    this.deptEmpValue=e.value;
  
    if(e.value){
      this.EmpList();
    }
  
   
  }
  public changedEmpDesgn(e: any): void {
    this.desgnEmpValue=e.value;
    if(e.value){
      this.EmpList();
    }
  
   
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
this.addformSubmit=false;
this.selectedDeptVal='Department';
  
}
public TaskView(){
  this.GetStatusByOrgID();
  this.statusForm.reset();

  this.showTaskList=true;
  this.showAddForm=false;
}
public onAddSubmit(){
  this.addformSubmit=true;
  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  const deptControl = this.statusForm.get('deptList');
  const desgnControl = this.statusForm.get('desgnList');
  const rolesControl = this.statusForm.get('rolesList');
  const empControl = this.statusForm.get('empList');
  let entity_data=[]
  if(this.filterByDept==true){

  
        //if(this.addCstformSubmitted){
         
            deptControl.setValidators([Validators.required]);
            desgnControl.setValidators(null);
            rolesControl.setValidators(null);
            empControl.setValidators(null);
                  
       
    entity_data=this.statusForm.get('deptList').value
    
  }else if(this.filterByDesgn==true){
    entity_data=this.statusForm.get('desgnList').value
    deptControl.setValidators(null);
    desgnControl.setValidators([Validators.required]);
    rolesControl.setValidators(null);
    empControl.setValidators(null);
          

  }else if(this.filterByRoles==true){
    entity_data=this.statusForm.get('rolesList').value
    deptControl.setValidators(null);
    desgnControl.setValidators(null);
    rolesControl.setValidators([Validators.required]);
    empControl.setValidators(null);
          

  }else{
    entity_data=this.statusForm.get('empList').value
    deptControl.setValidators(null);
    desgnControl.setValidators(null);
    rolesControl.setValidators(null);
    empControl.setValidators([Validators.required]);
          

  }
  deptControl.updateValueAndValidity();
  desgnControl.updateValueAndValidity();
  rolesControl.updateValueAndValidity();
  empControl.updateValueAndValidity();
  
  let entity_type=''
  if(this.filterByDept==true){
    entity_type='DEP'
  }else if(this.filterByDesgn==true){
    entity_type='DEG'


  }else if(this.filterByRoles==true){
    entity_type='ROLE'

  }else{
    entity_type='EMP'


  }
  console.log('entity_data',entity_data,this.statusForm.get('deptList').status,deptControl.value);
  let postData={
    "id": null,
  "type": entity_type,
  "entity_id": entity_data,
  "notify_type_id": this.notifyTypeValue,
  "notify_name": this.statusForm.get('Name').value,
  "notify_desc":this.statusForm.get('desc').value,
  notify_date:this.statusForm.get('notifyDate').value
   

     
    }
    

    console.log('AddNotify',postData);
     if(this.statusForm.status=='VALID' && this.notifyTypeValue!=''){
        return this.notifyService.AddNotify(postData).subscribe(
          (data:any)  => {
          
          if(data.status==200){
            this.TaskView();
            this.addformSubmit=false;

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
              (result)=> {
                 
              })
          
          
          }
          
          )
        }
      
      
   
 
}
public onAddNewSubmit(){
  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  let postData={
       
    status_name: this.statusForm.get('statusName').value  ,
    status_desc: this.statusForm.get('desc').value,
    

     
    }
    

    
     
        return this.notifyService.AddNotify(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          
          if(data.status==200){
            this.toastr.success(data.desc);
            this.statusForm.reset();

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
  this.empService.fetchGridDataEmployeeByOrgID().subscribe(
    
    (data:any) => {
      var results=[]
      // let dataObj = JSON.parse(data['token']);
    // 
  
for (var i = 0; i < data.length; i++) {
// logik to create new items

results.push({
    "id": data[i].id,
    "text": data[i].full_name
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
    public  RoleList(){
      this.empService.GetEmployeeRoleByOrgID().subscribe(
        
        (data:any) => {
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
    
        
    this.rolesData =results;
      
    
       
    
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
          this.notifyService.FindByNotifyID(postData).subscribe(
            (data:any)  => {
             
             let postData={
       
              status_name: this.statusForm.get('Name').value  ,
              status_desc: this.statusForm.get('desc').value,
             
          
               
              }
              this.statusForm.patchValue({
           
                Name: data.notify_name,
                desc:data.notify_desc,
                
              
              })
              this.notifyTypeValue=data.notify_type_id;
              this.selectedDeptVal=''
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
          this.addformSubmit=true;
      
          let postData={
            id:this.editTaskId,
       
            status_name: this.statusForm.get('statusName').value  ,
            status_desc: this.statusForm.get('desc').value,
            
        
             
            }
         
              
             
            if(this.statusForm.status=='VALID' && this.notifyTypeValue!=''){
              
               
                  return this.notifyService.UpdateNotify(postData).subscribe(
                    (data:any)  => {
                      // let dataObj = JSON.parse(data['token']);
                    
                    
                    if(data.status==200){
                      this.editable=false;
                      this.addformSubmit=false;

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
          this.notifyService.RemoveNotify(postData).subscribe(
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
          public getNotifyType() {
            // this.countryData = []
            // this.countryValue=''
        
            return this.notifyService.FetchGridDataNotifyTypeByOrgID().subscribe(
              (data: any) => {
                // let dataObj = JSON.parse(data['token']);
                
        
                var results = [{ id: '', text: 'Select' }]
        
                // let dataObj = JSON.parse(data['token']);
                // 
        
                for (var i = 0; i < data.length; i++) {
                  // logik to create new items
        
                  results.push({
                    "id": data[i].id,
                    "text": data[i].notify_type
                  });
                  
        
                }
        
        
                this.notifyTypeData = results;
        
              },
              error => {
                Swal.fire(
                  'Error!',
                  'Error.',
                  'error'
                ).then(
                  //used Arrow function here
                  (result) => {
                    
                    //  this.router.navigate(['/dashboard']);
                  })
                
        
              }
        
            )
          }
          public  GetStatusByOrgID(){
            this.notifyService.FetchGridDataNotifyByOrgID().subscribe(
              
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
this.getAllDept();
this.getNotifyType();
    this.statusForm = new FormGroup({
      statusName: new FormControl(''),
      desc: new FormControl(''),
      Name: new FormControl('', [Validators.required]),
      deptList: new FormControl(''),
      desgnList: new FormControl(''),
      rolesList: new FormControl(''),
      empList: new FormControl(''),
      notifyDate: new FormControl('')


          
   });
   if(this.filterByDept==true){

    const deptControl=this.statusForm.get('deptList')
    //if(this.addCstformSubmitted){
     
        deptControl.setValidators([Validators.required]);
   }
   this.form = this.formBuilder.group({
    datepicker: [new Date(), Validators.required],
  });

  this.form.valueChanges.subscribe((value) => {
    
  });
  this.form.get('datepicker').valueChanges.subscribe((value) => {
    
  });

  }

}

