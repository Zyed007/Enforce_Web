import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-setup-dept',
  templateUrl: './setup-dept.component.html',
  styleUrls: ['./setup-dept.component.scss']
})
export class SetupDeptComponent implements OnInit {
  public deptList: any;
  public selectedDept = [];
  public postData = {
    "is_accounts": false,
    "is_administrative": false,
    "is_advertisement_marketing": false,
    "is_construction": false,
    "is_customer_service": false,
    "is_design": false,
    "is_engineering": false,
    "is_facilities": false,
    "is_finance": false,
    "is_human_resources": false,
    "is_it_and_development": false,
    "is_legal": false,
    "is_logistics": false,
    "is_operation_and_production": false,
    "is_real_estate": false,
    "is_sales": false
  }
  deptListByOrgId: any;
  planType: string;
  deptDesc: any=[];

  constructor(public deptService: DepartmentService, private spinner: NgxSpinnerService, private toastr: ToastrService) {


  }
  public goBack(){
    window.history.go(-1);
  }
  public onCheckChange(item, e) {
    
    if (e.srcElement.checked == true) {
      this.selectedDept.push(item.id)
      this.deptDesc.push({name:item.Name,desc:item.Desc});

    } else {

      for (var i = 0; i < this.selectedDept.length; i++) {
        if (this.selectedDept[i] == item.id) {
          this.selectedDept.splice(i, 1);
        }
      }
      for (var i = 0; i < this.deptDesc.length; i++) {
        if (this.deptDesc[i].name == item.Name) {
          this.deptDesc.splice(i, 1);
        }
      }


    }
    
  }

  public precheckedValues() {
 
    let list = this.deptList;

    this.deptListByOrgId.forEach(element => {

      this.deptList.some(function (entry, i) {
        if (element.dep_name == entry.Name) {
         

          list[i].checked = true;
        }
      });

    });
    this.deptList = list;
  }


  public AddForm() {
    this.spinner.show();
    for (var i = 0; i < this.selectedDept.length; i++) {

      if (this.selectedDept[i] == 1) {
        this.postData['is_accounts'] = true;

      }
      else if (this.selectedDept[i] == 2) {
        this.postData['is_administrative'] = true;

      }
      if (this.selectedDept[i] == 3) {
        this.postData['is_design'] = true;

      }
      if (this.selectedDept[i] == 4) {
        this.postData['is_construction'] = true;

      }

      if (this.selectedDept[i] == 5) {

        this.postData['is_advertisement_marketing'] = true;

      }
      else if (this.selectedDept[i] == 6) {
        this.postData['is_customer_service'] = true;

      }
      if (this.selectedDept[i] == 7) {
        this.postData['is_engineering'] = true;

      }
      if (this.selectedDept[i] == 8) {
        this.postData['is_facilities'] = true;

      }
      if (this.selectedDept[i] == 9) {
        this.postData['is_finance'] = true;

      }
      if (this.selectedDept[i] == 10) {
        this.postData['is_human_resources'] = true;

      }
      if (this.selectedDept[i] == 11) {
        this.postData['is_it_and_development'] = true;

      }
      if (this.selectedDept[i] == 12) {
        this.postData['is_legal'] = true;

      }
      if (this.selectedDept[i] == 13) {
        this.postData['is_logistics'] = true;

      }
      if (this.selectedDept[i] == 14) {
        this.postData['is_operation_and_production'] = true;

      }
      if (this.selectedDept[i] == 15) {
        this.postData['is_real_estate'] = true;

      }
      if (this.selectedDept[i] == 16) {
        this.postData['is_sales'] = true;

      }
      
    }
    if (this.selectedDept.length != 0) {
      // 

      return this.deptService.SetupPreDefinedDepartment(this.postData).subscribe(
        (data: any) => {
          // let dataObj = JSON.parse(data['token']);
          if (data.status == 200) {
            
            this.spinner.hide();
            this.toastr.success(data['desc'], undefined, {
              positionClass: 'toast-top-center'
            });

          } else {
            
            this.toastr.success(data['result'].desc, undefined, {
              positionClass: 'toast-top-center'
            });
            this.spinner.hide();


          }
          // this.router.navigate(["/organizations"]);

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
  }

  public FetchGridDataByDepartmentOrgID() {
    this.spinner.show();
    this.deptService.fetchGridDataByDepartmentOrgID().subscribe(
      (data: any) => {

if(data){
  this.deptListByOrgId = data;
        
        this.precheckedValues();
        this.spinner.hide();
}
      


      },
      error => {
        Swal.fire(
          'Error!',
          error,
          'error'
        ).then(
          //used Arrow function here
          (result) => {
            
            //  this.router.navigate(['/dashboard']);
          })
        

      }

    )
  }

  ngOnInit() {
    $.getScript('assets/js/pages/custom/wizard/wizard-4.js');
    if(localStorage.getItem('planType')=='winter'){
      
      this.planType='Basic'
    }
    this.deptList = [
      {
        id: '1',
        Name: 'Accounts',
        Desc: 'Accounts',
        checked: false
      },
      {
        id: '2',
        Name: 'Administrative',
        Desc: 'Administrative',
        checked: false

      },
      {
        id: '3',
        Name: 'Design',
        Desc: 'Design',
        checked:false

      },
      {
        id: '4',
        Name: 'Construction',
        Desc: 'Construction',
        checked: false

      },
      {
        id: '5',
        Name: 'Advertisement & Marketing',
        Desc: 'Advertisement & Marketing',
        checked: false

      },
      {
        id: '6',
        Name: 'Customer Service',
        Desc: 'Customer Service',
        checked:false

      },

      {
        id: '7',
        Name: 'Engineering',
        Desc: 'Engineering',
        checked: false

      },
      {
        id: '8',
        Name: 'Facilities',
        Desc: 'Facilities',
        checked: false

      },
      {
        id: '9',
        Name: 'Finance',
        Desc: 'Finance',
        checked: false

      },
      {
        id: '10',
        Name: 'Human Resources',
        Desc: 'Human Resources',
        checked: false

      },
      {
        id: '11',
        Name: 'IT & Development',
        Desc: 'IT & Development',
        checked: false

      },
      {
        id: '12',
        Name: 'Legal',
        Desc: 'Legal',
        checked: false

      },
      {
        id: '13',
        Name: 'Logistics',
        Desc: 'Logistics',
        checked: false

      },
      {
        id: '14',
        Name: 'Operation & Production',
        Desc: 'Operation & Production',
        checked: false

      },
      {
        id: '15',
        Name: 'Real Estate',
        Desc: 'Real Estate',
        checked: false

      },
      {
        id: '16',
        Name: 'Sales',
        checked: false,
        Desc: 'Sales'
      },


    ]

    this.FetchGridDataByDepartmentOrgID();

  }


}
