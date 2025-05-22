import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-plan',
  templateUrl: './choose-plan.component.html',
  styleUrls: ['./choose-plan.component.scss']
})


export class ChoosePlanComponent implements OnInit {
  planList: any;
  featureList: any;
  planDetailList: any;

  constructor(public subscribeService:SubscriptionService,public router: Router
    ) { }
    public toOrgList(id,type){
    localStorage.setItem('plan_id',id)
    localStorage.setItem('plan_type',type)

      this.router.navigate(["/organizations"]);
    }
  public  GetAllPlan(){
    this.subscribeService.GetAllPlan().subscribe(
      
      (data:any) => {

this.planList=data;
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
      public toSignIn(){
        this.router.navigate(["/signin"]);
      }
  public  GetAllPlanFeature(){
        this.subscribeService.GetAllPlanFeature().subscribe(
          
          (data:any) => {
    
          // this.router.navigate(["/organizations"]);
          this.featureList=data;
    
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
          public redirectSignUp(id){
            localStorage.setItem('planId',id);
                this.router.navigate(['/signin']);

          } 
          public GetPlanDetail(){
            this.subscribeService.GetPlanDetail().subscribe(
              
              (data:any) => {
        
              // this.router.navigate(["/organizations"]);
              if(data){
                this.planDetailList=data;
    
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
  public  GetAllPlanPrice(){
            this.subscribeService.GetAllPlanPrice().subscribe(
              
              (data:any) => {
        
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
    this.GetAllPlan();
    this.GetAllPlanFeature();
    this.GetAllPlanPrice();
    this.GetPlanDetail();

  }

}
