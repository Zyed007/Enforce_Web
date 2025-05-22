import { Component, OnInit, ViewChild, ChangeDetectorRef,ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { patternValidator } from '../../shared/services';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

import Swal from 'sweetalert2';
import moment = require('moment');

import { DepartmentService } from '../../services/department.service';
import {MatTableDataSource,MatSort,MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { TeamService } from '../../services/team.service';
import { DesignationService } from '../../services/designation.service';
import { DelegationService } from '../../services/delegation.service';
import { DataManager } from '@syncfusion/ej2-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { GridComponent } from '@syncfusion/ej2-angular-grids';


let orgId= localStorage.getItem('org_id');
let user_info:object;
export interface Fruit {
  name: string;
}


if(localStorage.getItem('user_info')){
    user_info= JSON.parse(localStorage.getItem('user_info'));
    

}
let teamArr=[];
@Component({
  selector: 'app-delegation',
  templateUrl: './delegation.component.html',
  styleUrls: ['./delegation.component.scss'],
  
      encapsulation: ViewEncapsulation.None,

})


export class DelegationComponent implements OnInit {
  @ViewChild('table', { static: true }) table

  dataSource: any;
  empDataSource:any;

  editDeptId:string;
  delDeptId:string;
 
  pgData: any=[];
  pageSize: any = 10;
  currentPage: any = 1;
public showDeptList=true;
public showAddForm=false;
public teamData: Array<Select2OptionData>;
public teamLeadData: Array<Select2OptionData>;
public deptData: Array<Select2OptionData>;
public desgnData: Array<Select2OptionData>;
public roleData:Array<Select2OptionData>;
public deptValue: string;

public teamValue: string;
public teamLeadValue: string;
public selectedPurpose: string;
public selectedProject: string;
public selectedTask: string;
public deptOptions:Select2Options;
public delegateeOptions:Select2Options;
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
visible = true;
selectable = true;
removable = true;
addOnBlur = true;
items = ['Javascript', 'Typescript'];
readonly separatorKeysCodes: number[] = [ENTER, COMMA];
fruits: Fruit[] = [
  
];
@ViewChild('grid',{static:false})
    public grid: GridComponent;
  emails: any;
  showDelegatee: boolean=true;emailValue: any;
  addformSubmitted: any;
  editformSubmitted: any;
  showerrorMsg: boolean;
;
  public onAdd(item) {

    
}

public onRemove(item) {
    
}

public onSelect(item) {
    
}

public onFocus(item) {
    
}
addInvitee(event): void {
  const input = event.input;
  const value = event.value;

  // Add our fruit
  if ((value || '').trim()) {
    this.fruits.push({name: value.trim()});
  }

  // Reset the input value
  if (input) {
    input.value = '';
  }
}

add(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;
let emails=this.deptForm.get('inviteeEmail').value;

  // Add our fruit
  if ((value || '').trim()) {
    this.fruits.push({name: value.trim()});
  }

  // Reset the input value
  if (input) {
    input.value = '';
  }
}
addEmail(event): void {
 // const input = event.input;
  const value = event.target.value;

  // Add our fruit
  if(event.keyCode==13){
    if ((value || '').trim()) {
      this.fruits.push({name: value.trim()});
    }
  }
  

  // Reset the input value
  // if (input) {
  //   input.value = '';
  // }
}

remove(fruit: Fruit): void {
  const index = this.fruits.indexOf(fruit);

  if (index >= 0) {
    this.fruits.splice(index, 1);
  }
  
}

onRemoveEmail(email: any) {
  let controller = this.deptForm.controls['emails'];
  let index = this.emails.indexOf(email, 0);
  if (index > -1) {
    this.emails.splice(index, 1);
  }
  controller.markAsDirty();
}
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
  planType: string;
  delegateeValue='';
  delegatorName: any;
  data: any;
  initialSort: { columns: { field: string; direction: string; }[]; };
  pageSettings: { pageSizes: boolean; pageCount: number; };
  toolbar: string[];
  roleValue:string;
  startdateValue='';
  showExpiryField: boolean;
  delegationsid: any;
  delegateName='';

  constructor(private deptService: DepartmentService,private spinner: NgxSpinnerService,private delegationService:DelegationService, private desgnService: DesignationService,private changeDetectorRefs: ChangeDetectorRef,private empService:EmployeeService,private teamService:TeamService, private toastr: ToastrService,public router:Router) 
  
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
    this.delegateeOptions={
      multiple:true,
      placeholder:"Select",
      width: "100%",
      
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
   public nameChange(e){
     
     if(e.target.value){
       this.delegateName=e.target.value
     }
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
   public deptDelete(deptId){
    let postData={
      id:deptId
    }
    this.delegationService.RemoveDelegations(postData).subscribe(
      (data:any)  => {
        
        if(data.status==200){
        this.getDelgationByOrgIDEmpID();
                   
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
    isFieldValid(field: string) {
      if(this.addformSubmitted){
        return (
        this.showerrorMsg=true,
          this.deptForm.get(field).errors && this.deptForm.get(field).touched ||
          this.deptForm.get(field).untouched &&
          this.addformSubmitted
        );
      }
      else if(this.editformSubmitted){
        return (
          this.showerrorMsg=true,
        
          this.deptForm.get(field).errors &&
          this.editformSubmitted
        );
      }
      else{

        return (
        this.showerrorMsg=false,

          false
        );
      }
      // return (
      //   this.projectForm.get(field).errors && this.projectForm.get(field).touched ||
      //   this.projectForm.get(field).untouched &&
      //   this.formSubmitted && this.projectForm.get(field).errors  && this.projectForm.get(field).errors.patternValidator
        
      // );
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
    this.getEmployeeByOrgId();
    this.GetEmployeeRoles();
    this.getDelgationByOrgIDEmpID();
   
this.AddNewSubmit=true;
    this.showDeptList=false;
    this.showAddForm=true;
    this.editable=false;
  this.showDelegatee=true;

    
    this.deptForm.patchValue({
      
      delegation_name:'',
      desc:'',
      type:'is_temporary',
      notifyType:'is_delegatee'
     })
    this.delegateeValue='';


}
public DeptView(){
  this.showDeptList=true;
  this.showAddForm=false;
  this.addformSubmitted=false;
  this.editformSubmitted=false;
  this.getDelgationByOrgIDEmpID();
//  this.router.navigate(["/departments"]);
}
public onCheckChange(e){
  if(e.srcElement.checked){
    this.addCurrentUser=true;
  }else{
    this.addCurrentUser=false;

  }
  // this.addCurrentUser=!this.addCurrentUser;
  
  
}
public changedTeam(e: any): void {
  this.teamValue=e.value;
  // this.teamEmpName=e.data[0].text;
 
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
public changedDelegatee(e: any): void {
  this.delegateeValue= e.value;

}
public clearSearchField() {
  this.searchField = '';
  this.FetchGridDataByDepartmentOrgID();
} 
public goBack(){
  window.history.go(-1);
}
public deptEdit(dept_id,delegationsid){
  // this.EmpList();
this.getEmployeeByOrgId();
  this.editable=true;
  this.AddNewSubmit=false;
this.editDeptId=dept_id;
this.delegationsid=delegationsid;
  let postData={
    ID:dept_id
  }
  this.delegationService.FindByDelegateesID(postData).subscribe(
    (data:any)  => {
      this.deptForm.patchValue({
   
        delegation_name: data.delegation_name,
         desc:data.delegations_desc,
        type:data.is_type_permanent==false?'is_temporary':'is_permanent',
        notifyType:data.is_notify_delegator_and_delegatee==true?'is_delegator':'is_delegatee',
      
      
      })
      this.delegateeValue=dept_id;
if(data.email!=null){
  this.showDelegatee=false;
  this.emailValue=data.email;
}else{
  this.showDelegatee=true;

}
     if(data.is_type_permanent==false){
      this.deptForm.patchValue({
   
       
         startDate:data.is_type_permanent==false?moment(data.expires_on).format('L'):'',
       
      
      })
     
       this.startdateValue=moment(data.expires_on).format('L');
       
this.showExpiryField=true
     }else{
this.showExpiryField=false

     }
      
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
public getEmployeeByOrgId(){
  this.empService.getEmployeeByOrgId().subscribe(
      
    (data:any) => {
      
    
var results=[]
if(data){
for (var i = 0; i < data.length; i++) {

  results.push({

      "id": data[i].id,
      "text": data[i].full_name
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
public getDelgationByOrgIDEmpID(){
  this.delegationService.GetAllDelegateeByOrgIDAndEmpID().subscribe(
        
    
      (data:any) => {

        let datas = new DataManager(data);
         this.data=datas.dataSource['json']
        // this.initialSort = {
        //   columns: [{ field: 'full_name', direction: 'Ascending' },
        //   ]
      //};
      this.pageSettings = {pageSizes: true, pageCount: 5 }
      this.toolbar = ['Search','ExcelExport', 'PdfExport', ];
            this.pgData=data;

      let ds= data.slice(0, this.pageSize);
      let ds1 = new DataManager(ds);
  //this.data=ds1.dataSource['json'];
    

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
let postData={
  id:deptId
}
this.teamService.teamDelete(postData).subscribe(
  (data:any)  => {
    
    if(data.status==200){
     this.getDelgationByOrgIDEmpID();
               
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
  this.addformSubmitted=true;
  
  let postData={
    "delegator": user_info['id'],
    "delegatee_emp_id":this.delegateeValue,
    "delegation_name":this.deptForm.get('delegation_name').value,
    "role_id":this.roleValue,
    "invitees":this.deptForm.get('inviteeEmail').value!=""?this.deptForm.get('inviteeEmail').value:null,
    "expires_on": this.showExpiryField?this.startdateValue:null,
    "is_type_temporary": this.deptForm.get('type').value=='is_temporary'?true:false,
    "is_type_permanent": this.deptForm.get('type').value=='is_permanent'?true:false,
    "is_notify_delegator_and_delegatee": this.deptForm.get('notifyType').value=='is_delegator'?true:false,   
     "is_notify_delegatee": this.deptForm.get('notifyType').value=='is_delegatee'?true:false,
    "delegations_desc": this.deptForm.get('desc').value,
  
  }

      
     
      // 
       
     // let postValues= this.getDirtyValues(this.deptForm);
      //
     
      // 
      if ( this.deptForm.get('delegation_name').value!='' || (this.showExpiryField&&this.deptForm.get('startDate').value!='')) {
        this.spinner.show();

          return this.delegationService.AddDelegations(postData).subscribe(
            (data:any)  => {
              // let dataObj = JSON.parse(data['token']);
            
            if(data.status==200){
              this.DeptView();
this.spinner.hide();
this.addformSubmitted=false;

              this.deptForm.patchValue({
                type:'is_temporary',
                notifyType:'is_delegatee',
                desc:''
               })
              this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
           });
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
  public validators = [ this.must_be_email ];
  public errorMessages = {
      'must_be_email': 'Enter valid email adress!'
  };
  private must_be_email(control: FormControl) {        
      var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
          return { "must_be_email": true };
      }
      return null;
  }
  public onEditSubmit(){
    let postData={
      "id": this.delegationsid,
      "delegator": user_info['id'],
      "delegatee_emp_id":[this.editDeptId],
      "delegation_name":this.deptForm.get('delegation_name').value,
      "role_id":this.roleValue,
      "expires_on": this.showExpiryField?this.startdateValue:null,
      "invitees":this.deptForm.get('inviteeEmail').value!=""?this.deptForm.get('inviteeEmail').value:null,


      "is_type_temporary": this.deptForm.get('type').value=='is_temporary'?true:false,
      "is_type_permanent": this.deptForm.get('type').value=='is_permanent'?true:false,
      "is_notify_delegator_and_delegatee": this.deptForm.get('notifyType').value=='is_delegator'?true:false,   
       "is_notify_delegatee": this.deptForm.get('notifyType').value=='is_delegatee'?true:false,
      "delegations_desc": this.deptForm.get('desc').value,
    
    }
      let AdminID={
        ID:this.editDeptId
      }  
  
      if(this.addCurrentUser){
        this.spinner.show();

        return this.delegationService.RemoveAdminRightByEmpID(AdminID).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);
          
          
          
            if(data.status==200){
this.spinner.hide();

            this.editable=false;
          this.DeptView();
           
              this.toastr.success(data['desc'], undefined,{
                positionClass: 'toast-top-center'
           });
            }
            // this.AddNewSubmit=true;
            // this.DeptView();
    
        
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
       }else{
        this.editformSubmitted=true

        if ( this.deptForm.get('delegation_name').value!='' || (this.showExpiryField && this.deptForm.get('startDate').value!='')) {

          
           this.spinner.show();
           
              return this.delegationService.UpdateDelegations(postData).subscribe(
                (data:any)  => {
                  // let dataObj = JSON.parse(data['token']);
                
                
               
                  if(data.status==200){
                  this.editable=false;
                this.DeptView();
this.spinner.hide();
                 
                    this.toastr.success(data['desc'], undefined,{
                      positionClass: 'toast-top-center'
                 });
                  }
                  // this.AddNewSubmit=true;
                  // this.DeptView();
    
              
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
      
    }
    public onstartDtChange(e){
      this.startdateValue=moment(e.value).format('L');
        

    }
    public onTypeChange(){
      if(this.deptForm.get('type').value=='is_temporary'){
this.showExpiryField=true
      }else{
this.showExpiryField=false

      }
    }
    public onAddNewSubmit(){
this.addformSubmitted=true;
      let postData={
        "delegator": user_info['id'],
        "delegatee_emp_id":this.delegateeValue,
        "delegation_name":this.deptForm.get('delegation_name').value,
         "invitees":this.deptForm.get('inviteeEmail').value!=""?this.deptForm.get('inviteeEmail').value:null,

        "role_id":this.roleValue,
        "expires_on": this.showExpiryField?this.startdateValue:null,
        "is_type_temporary": this.deptForm.get('type').value=='is_temporary'?true:false,
        "is_type_permanent": this.deptForm.get('type').value=='is_permanent'?true:false,
        "is_notify_delegator_and_delegatee": this.deptForm.get('notifyType').value=='is_delegator'?true:false,   
         "is_notify_delegatee": this.deptForm.get('notifyType').value=='is_delegatee'?true:false,
        "delegations_desc": this.deptForm.get('desc').value,
      
      }
    
         
          // 
           
          let postValues= this.getDirtyValues(this.deptForm);
          
         
          if ( this.deptForm.get('delegation_name').value!='' || (this.showExpiryField&&this.deptForm.get('startDate').value!='')) {
            this.spinner.show();
    
          // 
       
              return this.delegationService.AddDelegations(postData).subscribe(
                (data:any)  => {
                  // let dataObj = JSON.parse(data['token']);
                
                if(data.status==200){
this.spinner.hide();
this.addformSubmitted=false;

                  this.delegateeValue='';
                  this.deptForm.patchValue({
                    type:'is_temporary',
                    notifyType:'is_delegatee',
                    desc:''
                   })
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
       
for (var i = 0; i < response.length; i++) {
  
  
    results.push({

        "id": response[i].id,
        "text": response[i].full_name
    });

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
       
for (var i = 0; i < data.length; i++) {
  
    results.push({

        "id": data[i].id,
        "text": data[i].full_name
    });

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
       
for (var i = 0; i < data.length; i++) {
  
    results.push({

        "id": data[i].id,
        "text": data[i].full_name
    });

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
       
for (var i = 0; i < data.length; i++) {
  
    results.push({

        "id": data[i].id,
        "text": data[i].full_name
    });

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
this.empDataSource=new MatTableDataSource(this.teamMemFetchData)
this.empDataSource.connect().next(this.teamMemFetchData);


}
public GetEmployeeRoles(){
  this.delegationService.GetEmployeeRoles().subscribe(
        
    (data:any) => {
      

var results=[]
 
    for (var i = 0; i < data.length; i++) {
      if(data[i].name=="Admin"){
      results.push({
    
        "id": data[i].id,
        "text": data[i].name
    });
  } 




}

this.roleValue='2';
    
this.roleData =results;
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
public changedRole(){

}
  ngOnInit() {
    // this.DeptList();
    this.showExpiryField=true;
     this.getDelgationByOrgIDEmpID();
     this.delegatorName=user_info['full_name']
     if(localStorage.getItem('planType')=='winter'){
      
      this.planType='Basic'
    }
    this.roleData=[{
      id:'1',
      text:'Admin'
    }]
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

        
    // this.FetchGridDataByDepartmentOrgID();
    this.deptForm = new FormGroup({
      delegation_name: new FormControl('', [Validators.required]),
     desc:new FormControl(''),
     type:new FormControl(''),
     notifyType:new FormControl(''),
     startDate:new FormControl('', [Validators.required]),
     emails:new FormControl(''),
     inviteeEmail:new FormControl(''),
     
     
     



          
   });  
   this.deptForm.patchValue({
    type:'is_temporary',
    notifyType:'is_delegatee'
   })
    // $.getScript("assets/js/departments-datatable.js")

  }

}
