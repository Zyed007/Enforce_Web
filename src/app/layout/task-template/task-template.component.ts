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
import { TemplateService } from '../../services/template.service';
@Component({
  selector: 'app-task-template',
  templateUrl: './task-template.component.html',
  styleUrls: ['./task-template.component.scss']
})

export class TaskTemplateComponent implements OnInit {
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


  public displayedColumns = ['index','status_name','desc','Action'];
  editTaskId: any;
  searchField: string;
  pageSettings: { pageSizes: boolean; pageCount: number; };
  toolbar: string[];
  pgData: any=[];
  pageSize: any = 10;
  currentPage: any = 1;
  constructor(public taskService:TaskService,private toastr: ToastrService,  private formBuilder: FormBuilder,public empService:EmployeeService,
    public templateService:TemplateService
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
  public goBack(){
    window.history.go(-1);
  }
  public AddForm(){

    this.showTaskList=false;
    this.showAddForm=true;
    this.AddNewSubmit=true;

}
public TaskView(){
  this.GetEmployeeStatusByOrgID();
this.statusForm.reset();
  this.showTaskList=true;
  this.showAddForm=false;
}
public onAddSubmit(){
  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  let postData={

    employee_status_name: this.statusForm.get('statusName').value  ,
    employee_status_desc: this.statusForm.get('desc').value,



    }




        return this.empService.AddEmployeeStatus(postData).subscribe(
          (data:any)  => {
            // let dataObj = JSON.parse(data['token']);


          if(data.status==200){
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
public onAddNewSubmit(){
  // let date=document.getElementById('ntpDate').innerText
  // moment().format('L');
  let postData={

    employee_status_name: this.statusForm.get('statusName').value  ,
    employee_status_desc: this.statusForm.get('desc').value,



    }




        return this.empService.AddEmployeeStatus(postData).subscribe(
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
      this.GetEmployeeStatusByOrgID();
    }
    public  getAllEmpStatus(){
      this.empService.getAllEmpStatus().subscribe(

        (data:any) => {

        this.dataSource =new MatTableDataSource(data) ;

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
          this.AddNewSubmit=false;

          this.editable=true;
        this.editTaskId=dept_id;
        this.showTaskList=false;
        this.showAddForm=true;
          let postData={
            id:dept_id
          }
          this.empService.getByEmpStatusID(postData).subscribe(
            (data:any)  => {

             let postData={

              employee_status_name: this.statusForm.get('statusName').value  ,
              employee_status_desc: this.statusForm.get('desc').value,



              }
              this.statusForm.setValue({

                statusName: data.employee_status_name,
                desc:data.employee_status_desc,


              })
              this.EmpList();
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

          let postData={
            id:this.editTaskId,

            employee_status_name: this.statusForm.get('statusName').value  ,
            employee_status_desc: this.statusForm.get('desc').value,



            }



              if (this.statusForm.get('statusName').value !== '') {


                  return this.empService.updateEmpStatus(postData).subscribe(
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
        public taskDelete(deptId){
          let postData={
            id:deptId
          }
          this.templateService.RemoveTaskTemplateByID(postData).subscribe(
            (data:any)  => {


              if(data.status==200){
                this.GetEmployeeStatusByOrgID();

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
          public  GetEmployeeStatusByOrgID(){
            this.templateService.FindTaskTemplatesByOrgID().subscribe(

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
      //  this.dataSource=ds1.dataSource['json'];
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
  ngOnInit() {
    // this.getAllEmpStatus();
    this.GetEmployeeStatusByOrgID();

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
