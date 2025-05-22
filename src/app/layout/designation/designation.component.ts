import { Component, OnInit, ViewChild } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DesignationService } from '../../services/designation.service';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatSort } from '@angular/material';
import * as jspdf from 'jspdf'; 
 
import html2canvas from 'html2canvas';
import { FLAGS } from 'html2canvas/dist/types/dom/element-container';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataManager } from '@syncfusion/ej2-data';
import { PagerComponent, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';


@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss'],
  providers:[DesignationService]
})
export class DesignationComponent implements OnInit {
  dataSource:any;
  editDeptId:string;
  delDeptId:string;

 
  public showDeptList=true;
  public showAddForm=false;
  public departmentLeadData: Array<Select2OptionData>;
  public taskData: Array<Select2OptionData>;
  public departmentLeadValue: string='';
  public selectedPurpose: string;
  public selectedProject: string;
  public selectedTask: string;
  public deptOptions:Select2Options;
  public desgnForm: FormGroup;
  public displayedColumns = ['index','designation_name' , 'alias','dep_name','Action'];
  public addformSubmitted=false;
public editformSubmitted=false;
  editable: boolean;
  searchField;
  public AddNewSubmit=true;

  @ViewChild("pager",{static:true}) pager: PagerComponent;
  pgData: any=[];
  @ViewChild('grid',{static:false})
    public grid: GridComponent;
  pageSize: any = 10;
  currentPage = 1;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  pageSettings: { pageSizes: boolean; pageCount: number; };
  toolbar: string[];

    constructor(public desgnService:DesignationService,private spinner: NgxSpinnerService,public empService:EmployeeService, public deptService:DepartmentService,private toastr: ToastrService) {
      this.departmentLeadValue = ' ';
      this.selectedPurpose = '';
      this.selectedProject='';
      this.selectedTask='';
      this.departmentLeadData = [
   
      ]
      this.deptOptions={
      placeholder:'Select',
      width:'100%'
      }
     }
  
     public AddForm(){
      this.EmpList();

      this.showDeptList=false;
      this.showAddForm=true;
      this.AddNewSubmit=true;
      this.addformSubmitted=false;
      this.desgnForm.patchValue({
     
        desgnName: '',
        aliasName:''
      
      
      })

      this.departmentLeadValue='';

  }
  public goBack(){
    window.history.go(-1);
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
  public DesgnView(){
    this.showDeptList=true;
    this.showAddForm=false;
    this.fetchDataGridDesgn();
  }
  public changedLead(e: any): void {
    this.selectedTask= e.value;
    
    this.departmentLeadValue=e.value;
  
  
  }
  public clearSearchField() {
    this.searchField = '';
    this.fetchDataGridDesgn();
  } 
  public generatePDF() 
  { 
  var data = document.getElementById('matTable'); 
  html2canvas(data).then(canvas => { 
  // Few necessary setting options 
  var imgWidth = 208; 
  var pageHeight = 295; 
  var imgHeight = canvas.height * imgWidth / canvas.width; 
  var heightLeft = imgHeight; 
  
  const contentDataURL = canvas.toDataURL('image/png') 
  let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF 
  var position = 0; 
  pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight) 
  pdf.save('MYPdf.pdf'); // Generated PDF  
  }); 
  } 
 
  public onAddSubmit(e){
    e.preventDefault();
    this.addformSubmitted=true;

    

    let postData={
         
      designation_name: this.desgnForm.get('desgnName').value,
      alias: this.desgnForm.get('aliasName').value,
      
      dep_id: this.departmentLeadValue
   

       
      }
      

      if (this.desgnForm.status=='VALID' && this.departmentLeadValue!='' ) {
        this.spinner.show();

       
          return this.desgnService.AddDesgn(postData).subscribe(
            (data:any)  => {
              // let dataObj = JSON.parse(data['token']);
              this.DesgnView();
              if(data.status==200){
                this.addformSubmitted=false;
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
  isFieldValid(field: string) {
    if(this.addformSubmitted){
      return (
      
        this.desgnForm.get(field).errors && this.desgnForm.get(field).touched ||
        this.desgnForm.get(field).untouched &&
        this.addformSubmitted
      );
    }
    else if(this.editformSubmitted){
      return (
      
        this.desgnForm.get(field).errors &&
        this.editformSubmitted
      );
    }
    else{
      return false;
    }
   
  } 
  public desgnEdit(dept_id){
    this.EmpList();
    // this.addformSubmitted=false;
    // this.editformSubmitted=true;

    this.AddNewSubmit=false;
    this.editable=true;
  this.editDeptId=dept_id;
    let postData={
      id:dept_id
    }
    this.desgnService.getByDesgnID(postData).subscribe(
      (data:any)  => {
        
        this.desgnForm.patchValue({
     
          desgnName: data.designation_name,
          aliasName:data.alias
        
        
        })

        this.departmentLeadValue=data.dep_id;
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
  public desgnDelete(deptId){
    this.spinner.show();

  let postData={
    id:deptId
  }
  this.desgnService.delDesgn(postData).subscribe(
    (data:any)  => {
      
      if(data.status==200){
        this.spinner.hide();

      this.fetchDataGridDesgn();
               
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
  public onEditSubmit(e){
    // this.desgnForm.get('deptName').valueChanges
    // .subscribe((mode: string) => {
    //   if (mode) {
    //    
    //   }
    // });
    e.preventDefault();

    this.editformSubmitted=true;

    let postData={
            id:this.editDeptId,
            designation_name: this.desgnForm.get('desgnName').value  ,
        alias: this.desgnForm.get('aliasName').value,
        dep_id: this.departmentLeadValue
     
         
        }
        
        
       
        if (this.desgnForm.status=='VALID' && this.departmentLeadValue!='' ) {

    this.spinner.show();
        
         
            return this.desgnService.updateDesgn(postData).subscribe(
              (data:any)  => {
                // let dataObj = JSON.parse(data['token']);
              
              
              if(data.status==200){
                this.editformSubmitted=false;
this.editable=false;
this.spinner.hide();

               this.DesgnView();
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

    public onAddNewSubmit(e){
      e.preventDefault();
      this.addformSubmitted=true;

      let postData={
         
        designation_name: this.desgnForm.get('desgnName').value,
        alias: this.desgnForm.get('aliasName').value,
        
        dep_id: this.departmentLeadValue
     
  
         
        }
  
        
      if (this.desgnForm.status=='VALID' && this.departmentLeadValue!='' ) {
this.spinner.show();
         
            return this.desgnService.AddDesgn(postData).subscribe(
              (data:any)  => {
                // let dataObj = JSON.parse(data['token']);
                if(data.status==200){
                  this.addformSubmitted=false;
                  this.spinner.hide();
                  this.desgnForm.reset();
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
  public  EmpList(){
    this.deptService.getAllDept().subscribe(
      
      (data:any) => {
        

var results=[{ id: '', text: 'Select' }]
        // let dataObj = JSON.parse(data['token']);
      // 
    
for (var i = 0; i < data.length; i++) {
  // logik to create new items

  results.push({
      "id": data[i].id,
      "text": data[i].dep_name
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
      public  DesgnList(){
  
        this.desgnService.getAllDesgn().subscribe(
          (data:any)  => {
            
      
            //  let dataObj = JSON.parse(data['token']);
          
        
           this.dataSource = data;
          
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
          public  fetchDataGridDesgn(){
  
            this.desgnService.fetchGridDataByDesignationDeptOrgID().subscribe(
              (data:any)  => {
                // if(data){
                  this.pgData=data;

                  let ds= data.slice(0, this.pageSize);
                  let ds1 = new DataManager(ds);
          //this.dataSource=ds1.dataSource['json'];
                // }
          
                //  let dataObj = JSON.parse(data['token']);
                //this.dataSource =  new MatTableDataSource(data);
                // this.dataSource.paginator = this.paginator;
                // this.dataSource.sort = this.sort;

                let datas = new DataManager(data);
                this.dataSource=datas.dataSource['json']
             
              //   this.initialSort = {
              //     columns: [{ field: 'dep_name', direction: 'Ascending' },
              //     { field: 'alias', direction: 'Descending' }]
              // };
              this.pageSettings = {pageSizes: true, pageCount: 5 }
              this.toolbar = ['Search','ExcelExport', 'PdfExport', ];
            
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
      // this.DesgnList();
      // $.getScript('assets/js/teamPanel.js')

      this.fetchDataGridDesgn();
      this.desgnForm = new FormGroup({
        desgnName: new FormControl('', [Validators.required]),
        departmentLead: new FormControl(''),
        aliasName: new FormControl(''),
      
  
  
            
     });
  
    }

}
