import { Component, OnInit } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  leadData={
    first_name:'',
    last_name:'',
    email:'',
    website:'',
    no_of_employee:'',
    annual_revenue:'',
    leadProject:{
      project_name:'',
      project_prefix:''
    },
  };

  constructor(private leadService:LeadService) { }
  public goBack(){
    window.history.go(-1);
  }
  ngOnInit() {
    if(localStorage.getItem('cstId')){
      let postData={
        id:localStorage.getItem('cstId')
      }
      this.leadService.FindByLeadId(postData).subscribe(
        (data:any)  => {
         
          if(data){
            this.leadData=data

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
  }

}
