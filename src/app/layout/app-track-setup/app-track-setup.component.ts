import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import moment = require('moment');
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { DepartmentService } from '../../services/department.service';
// import { SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { TabComponent, SelectEventArgs, EJ2Instance } from '@syncfusion/ej2-angular-navigations';

import { Select2TemplateFunction, Select2OptionData } from 'ng2-select2';
import { TeamService } from '../../services/team.service';
import { ActivityService } from '../../services/activity.service';
let prodcheckedApps=[]

@Component({
  selector: 'app-app-track-setup',
  templateUrl: './app-track-setup.component.html',
  styleUrls: ['./app-track-setup.component.scss']
})

export class AppTrackSetupComponent implements OnInit {
  datePickerForm: FormGroup;
  dateText: any;
  dateSelect: string;
  selectedTabText: string='ALL EMPLOYEES';
  currentView: string;
  showweeksContainer: boolean;
  public today: Date = new Date(new Date().toDateString());
  disableNxtBtn: boolean;
  showtodaysData: boolean;
  user_info: any;
  public headerText=[];
  showTimeSpinner: boolean;
  options: Select2Options;
  teamData: any[];
  public selectedDate=new Date();
  public maxRangeDate: Date = this.today;
  public dateValue;
  isTodayActive: boolean;
  isWeekActive: boolean;
  isMonthActive: boolean;
  productiveApps: any[];
  selectedDept=[];
  deptoptions:Select2Options;
  public weekStart=new Date(new Date().toDateString());   
  public  weekEnd=new Date().setDate(new Date().getDate() - 7);
     
 public monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
 public monthEnd: Date = this.today;
  typeOfAppData=[{
    id:'',
    text:'Select'
  },{
    id:'1',
    text:'Productive'
  },{
    id:'2',
    text:'Unproductive'
  },{
    id:'3',
    text:'Neutral'
  },
]
  typeOfAppValue='';
  selectedTabValue: string;
  teamValue: any;
  allApps: any[];
  neutralApps: any[];
  unProductiveApps: any[];
  selectedFromDateValue:any;
  selectedToDateValue:any;
  prodAppValue='';
  unprodAppValue='';
  neutralAppValue='';
  selectedProdApps=[];
  selectedUnProdApps=[];
  selectedNeutralApps=[];
  selectedTeamId: any;
  constructor(private spinner:NgxSpinnerService,private deptService:DepartmentService,private teamService:TeamService,private activityService:ActivityService) { 
    this.options = {
    
      placeholder: "Select",
      // allowClear: true,
      width: "100%",
      templateResult: this.templateResult,
      templateSelection: this.templateSelection
  
    }
    this.deptoptions= {
    
      placeholder: "Select",
      // allowClear: true,
      width: "100%"
  
    }
  }
  public  FetchGridDataByDepartmentOrgID() {
    this.deptService.fetchGridDataByDepartmentOrgID().subscribe(
      (data:any)  => {
  this.user_info={};
  var results=[]
     
     if(data){

      if(localStorage.getItem('user_info')){
        this.user_info= JSON.parse(localStorage.getItem('user_info'));
        if(this.user_info['is_superadmin']==true){
         
           this.headerText= [  { text: 'All Employees' },{ text: 'Team' }
          //this.headerText= [ { text: 'Team' }
        ];
        data.forEach(element => {
          this.headerText.push({'text':element.dep_name})
        });
        }
        if(this.user_info['is_admin']==true && this.user_info['is_superadmin']==false){
         
          this.headerText= [{ text: 'All Employees' }, { text: 'Team' }
         
        ];
        data.forEach(element => {
          if(element.department_id==this.user_info['deptid']){
            this.headerText.push({'text':element.dep_name,'id':element.department_id})

          }
        });
        }
        if(this.user_info['is_admin']==false && this.user_info['is_superadmin']==false){
          this.headerText= [];
        }
      
      }
      


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
      public templateResult: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
        if (!state.id) {
          return state.text;
        }
      
       
      
        return jQuery('<div><b>' + state.text+ '</b> ' + '<span> '+ state.additional.teamBy + '</span></div>');
      }
      public templateSelection: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
        if (!state.id) {
          return state.text;
        }
      
        return jQuery('<span><b>' + state.text + '</b> ' + state.additional.teamBy + '</span>');
        //return jQuery('<div><b>' + state.text+ '</b></div> ' + '<div>'+ state.additional.teamBy + '</div>');
      
      }
      appChecked(e,id){
if(e.srcElement.checked==true){
  prodcheckedApps.push(id)
}else{
  prodcheckedApps.slice(id)

}

console.log('prodcheckedApps',prodcheckedApps)
      }
     
      public onAllAppsCheckChange(e,item) {
        if (e.srcElement.checked == true) {
          this.selectedDept.push({name:item.name,icon:item.icon,time:item.time})
    
        } else {
    
          for (var i = 0; i < this.selectedDept.length; i++) {
            if (this.selectedDept[i].name == item.name) {
              this.selectedDept.splice(i, 1);
            }
          }
        
    
    
        }
        
      }
      public onProdAppsCheckChange(e,item) {
        if (e.srcElement.checked == true) {
          this.selectedProdApps.push({name:item.name,icon:item.icon,time:item.time,id:item.id})
    
        } else {
    
          for (var i = 0; i < this.selectedProdApps.length; i++) {
            if (this.selectedProdApps[i].name == item.name) {
              this.selectedProdApps.splice(i, 1);
            }
          }
        
    
    
        }
        
      }
      public onUnProdAppsCheckChange(e,item) {
        if (e.srcElement.checked == true) {
          this.selectedUnProdApps.push({name:item.name,icon:item.icon,time:item.time,id:item.id})
    
        } else {
    
          for (var i = 0; i < this.selectedUnProdApps.length; i++) {
            if (this.selectedUnProdApps[i].name == item.name) {
              this.selectedUnProdApps.splice(i, 1);
            }
          }
        
    
    
        }
        
      }
      public onNeutralAppsCheckChange(e,item) {
        if (e.srcElement.checked == true) {
          this.selectedNeutralApps.push({name:item.name,icon:item.icon,time:item.time,id:item.id})
    
        } else {
    
          for (var i = 0; i < this.selectedNeutralApps.length; i++) {
            if (this.selectedNeutralApps[i].name == item.name) {
              this.selectedNeutralApps.splice(i, 1);
            }
          }
        
    
    
        }
        
      }
      
      AddEntityApps() {
        let apps=[];
        let user= JSON.parse(localStorage.getItem('user_info'));
        for(var i=0;i<this.selectedDept.length;i++){
          let icon=this.selectedDept[i].icon.split('base64,')
          apps.push({
            "id": null,
            "org_id": localStorage.getItem('org_id'),
            "entity_id": this.selectedTabValue,
            "icon": icon[1],
            "app_name": this.selectedDept[i].name,
            "start_date":  moment(this.selectedFromDateValue).format('L'),
            "end_date": moment(this.selectedToDateValue).format('L'),
            "is_productive":this.typeOfAppValue=='1'?true:false,
            "is_unproductive": this.typeOfAppValue=='2'?true:false,
            "is_neutral": this.typeOfAppValue=='3'?true:false,
            "createdby": user['full_name'],
           
          })
        }
         console.log('AddEntityApp',apps)

       this.spinner.show();

        this.activityService.AddEntityApps(apps).subscribe(
          (data:any)  => {
            if(data.status==200){
           this.typeOfAppValue='';
           this.selectedDept=[];
           this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue)
            }else{
              Swal.fire(
                'Error!',
                'Something went wrong',
                'error'
              ).then(
                (result)=> {
                   
                })
            }
  
           
          },
          error  => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(
              (result)=> {
                 
              })
          
          
          }
          
          )
      }
      UpdateProdEntityApps() {
        let apps=[];
        let user= JSON.parse(localStorage.getItem('user_info'));
        for(var i=0;i<this.selectedProdApps.length;i++){
          let icon=this.selectedProdApps[i].icon.split('base64,')
          apps.push({
            "id":  this.selectedProdApps[i].id,
            "org_id": localStorage.getItem('org_id'),
            "entity_id": this.selectedTabValue,
            "icon": icon[1],
            "app_name": this.selectedProdApps[i].name,
            "start_date":  moment(this.selectedFromDateValue).format('L'),
            "end_date": moment(this.selectedToDateValue).format('L'),
            "is_productive":this.prodAppValue=='1'?true:false,
            "is_unproductive": this.prodAppValue=='2'?true:false,
            "is_neutral": this.prodAppValue=='3'?true:false,
            "createdby": user['full_name'],
           
          })
        }
         console.log('UpdateEntityApps',apps)

       this.spinner.show();

        this.activityService.UpdateEntityApps(apps).subscribe(
          (data:any)  => {
            if(data.length!=0){
           this.prodAppValue='';
           this.selectedProdApps=[];
           this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue)
            }
  
           
          },
          error  => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(
              (result)=> {
                 
              })
          
          
          }
          
          )
      }
      UpdateUnProdEntityApps() {
        let apps=[];
        let user= JSON.parse(localStorage.getItem('user_info'));
        for(var i=0;i<this.selectedUnProdApps.length;i++){
          let icon=this.selectedUnProdApps[i].icon.split('base64,')
          apps.push({
            "id":  this.selectedUnProdApps[i].id,
            "org_id": localStorage.getItem('org_id'),
            "entity_id": this.selectedTabValue,
            "icon": icon[1],
            "app_name": this.selectedUnProdApps[i].name,
            "start_date":  moment(this.selectedFromDateValue).format('L'),
            "end_date": moment(this.selectedToDateValue).format('L'),
            "is_productive":this.unprodAppValue=='1'?true:false,
            "is_unproductive": this.unprodAppValue=='2'?true:false,
            "is_neutral": this.unprodAppValue=='3'?true:false,
            "createdby": user['full_name'],
           
          })
        }
         console.log('UpdateEntityApps',apps)

       this.spinner.show();

        this.activityService.UpdateEntityApps(apps).subscribe(
          (data:any)  => {
            if(data.length!=0){
           this.unprodAppValue='';
           this.selectedUnProdApps=[];
           this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue)
            }
  
           
          },
          error  => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(
              (result)=> {
                 
              })
          
          
          }
          
          )
      }
      UpdateNeutralEntityApps() {
        let apps=[];
        let user= JSON.parse(localStorage.getItem('user_info'));
        for(var i=0;i<this.selectedNeutralApps.length;i++){
          let icon=this.selectedNeutralApps[i].icon.split('base64,')
          apps.push({
            "id":  this.selectedNeutralApps[i].id,
            "org_id": localStorage.getItem('org_id'),
            "entity_id": this.selectedTabValue,
            "icon": icon[1],
            "app_name": this.selectedNeutralApps[i].name,
            "start_date":  moment(this.selectedFromDateValue).format('L'),
            "end_date": moment(this.selectedToDateValue).format('L'),
            "is_productive":this.neutralAppValue=='1'?true:false,
            "is_unproductive": this.neutralAppValue=='2'?true:false,
            "is_neutral": this.neutralAppValue=='3'?true:false,
            "createdby": user['full_name'],
           
          })
        }
         console.log('UpdateEntityApps',apps)

       this.spinner.show();

        this.activityService.UpdateEntityApps(apps).subscribe(
          (data:any)  => {
            if(data.length!=0){
           this.neutralAppValue='';
           this.selectedNeutralApps=[];
           this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue)
            }
  
           
          },
          error  => {
            Swal.fire(
              'Error!',
              error,
              'error'
            ).then(
              (result)=> {
                 
              })
          
          
          }
          
          )
      }
      public  EmployeeAppTrackedByEmpIDAndDate(id) {
        let user:object={};
        let teamEmpId='';
  if(localStorage.getItem('user_info')){
      user= JSON.parse(localStorage.getItem('user_info'));
  
  }
  if(localStorage.getItem('ActivityEmpID')){
    teamEmpId=localStorage.getItem('ActivityEmpID')
  }else{
    teamEmpId=''
  }
        let postData={
          
          "orgID":localStorage.getItem('org_id'),
          "entityID":id,
          "startDate": moment(this.selectedFromDateValue).format('L'),
          "endDate": moment(this.selectedToDateValue).format('L')
          
          
         
        }
        this.activityService.AppTrackedByOrgIDByEntityIDAndDate(postData).subscribe(
          (data:any)  => {
          
            if(data.length!=0){
           this.spinner.hide();
              // this.productiveApps=data;
              let AllAppsData=[];
              let prodAppsData=[];
              let unProdAppsData=[];
              let neutralAppsData=[];
              for(var i=0;i<data.all_apps.length;i++){
                AllAppsData.push({
                  name:data.all_apps[i].app_category_name,
                  time:data.all_apps[i].time_spend,
                  icon:'data:image/png;base64,'+data.all_apps[i].icon
  
                })
              }
              for(var i=0;i<data.unproductive.length;i++){
                unProdAppsData.push({
                  id:data.unproductive[i].id,
                  name:data.unproductive[i].app_name,
                  time:'',
                  icon:'data:image/png;base64,'+data.unproductive[i].icon
  
                })
              }
if(data.neutral!=null ){
  for(var i=0;i< data.neutral.length;i++){
    neutralAppsData.push({
      id:data.neutral[i].id,
      name:data.neutral[i].app_name,
      time:'',
      icon:'data:image/png;base64,'+data.neutral[i].icon

    })
  }
}
if(data.productive!=null ){
  for(var i=0;i< data.productive.length;i++){
    prodAppsData.push({
      id:data.productive[i].id,
      name:data.productive[i].app_name,
      time:'',
      icon:'data:image/png;base64,'+data.productive[i].icon

    })
  }
}
            
             
              this.allApps=AllAppsData;
              this.productiveApps=prodAppsData;
              this.neutralApps=neutralAppsData;
              this.unProductiveApps=unProdAppsData;
  
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
      public FindTeamsByOrgID(){
        this.teamService.FindTeamsByOrgID().subscribe(
                
          (data:any) => {
            
      
      var results=[]
            // let dataObj = JSON.parse(data['token']);
          // 
          if(data){
            for (var i = 0; i < data.length; i++) {
              // logik to create new items
              
              results.push({
              
                  id: data[i].id,
                  text: data[i].team_name,
                  additional:{
                    teamBy: data[i].team_by
                } 
              
                  
               
              });
              this.selectedTeamId=data[0].id;
              
              }
      
          }
      
      
          
      this.teamData =results;
      
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
      public getTodaysData(){
        this.spinner.show();
        this.selectedFromDateValue=this.today;
        this.selectedToDateValue=this.today;
this.dateText=moment(this.today).format('ddd, D MMM YYYY');
this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue);

      }
      public getWeeksData(){
        this.dateText=moment(this.weekEnd).format('ddd, D MMM YYYY')+' - '+moment(this.weekStart).format('ddd, D MMM YYYY');
this.isTodayActive=false;
this.isWeekActive=true;
this.isMonthActive=false;
this.selectedFromDateValue=this.weekEnd;
this.selectedToDateValue=this.weekStart;
this.spinner.show();
       this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue);

      }
      public getMonthsData(){
        this.selectedFromDateValue=this.monthStart;
        this.selectedToDateValue=this.monthEnd;
this.spinner.show();

        this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue);
        this.showtodaysData=false;
        this.isTodayActive=false;
        this.isWeekActive=false;
        this.isMonthActive=true;

this.dateText=moment(this.monthStart).format('ddd, D MMM YYYY')+' - '+moment(this.monthEnd).format('ddd, D MMM YYYY');

       
      }
      public nextday(){
        let dateValue;
        let dateformat;
        this.showweeksContainer=false;

        if(this.dateText.includes('-')){
          dateValue=this.dateText.split('-')
          dateformat=moment(dateValue[0]).format('L')
          
        }else{
          dateformat=moment(this.dateText).format('L')

        }
        
       let fromDate=moment(dateformat).add(1, 'day').toDate();
       this.selectedDate=fromDate;
       this.spinner.show();
       
       this.currentView="Day";
       this.dateText=moment(fromDate).format('ddd, D MMM YYYY');
       this.dateSelect=moment(this.selectedDate).format('L');
        if(this.selectedTabText=='ALL EMPLOYEES'){
          // this.ProductiveByOrgIDAndDate(localStorage.getItem('org_id'))
          // this.ProductivityGraphByOrgIDAndDate(localStorage.getItem('org_id'))
         }else if(this.selectedTabText=='TEAM'){
          // this.ProductiveByTeamIDAndDate(this.teamValue)
          // this.ProductiveGraphByTeamIDAndDate(this.teamValue)
         }else{
          // this.ProductiveByDeptIDAndDate(this.selectedDeptId)
          // this.ProductiveGraphByDeptIDAndDate(this.selectedDeptId)
         }

       if(moment(this.selectedDate).format('L')==moment(this.today).format('L')){
        this.disableNxtBtn=true
      }else{
        this.disableNxtBtn=false
      }
      this.selectedFromDateValue=fromDate;
this.selectedToDateValue=fromDate;
       this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue);
  

      //  this.TotalEmployeeDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
      //  this.TotalEmployeeAbsentDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))

      //   this.GetTimesheetDashboardDataByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
      //   this.GetAllTimesheetByOrgID(moment(fromDate).format('L'),moment(fromDate).format('L'))
        
      //  localStorage.setItem('fromDate',JSON.stringify(fromDate));
      //  localStorage.setItem('toDate',JSON.stringify(fromDate));
       
      }
      public prevday(){
        let dateValue;
        let dateformat;
        this.showweeksContainer=false;
        this.spinner.show();

        if(this.dateText.includes('-')){
          dateValue=this.dateText.split('-')
          dateformat=moment(dateValue[0]).format('L')
          
        }else{
          dateformat=moment(this.dateText).format('L')

        }
        
        let fromDate=moment(dateformat).subtract(1, 'day').toDate();
         this.selectedDate=fromDate;
         this.currentView="Day";
        this.dateText=moment(fromDate).format('ddd, D MMM YYYY');
       this.dateSelect=moment(this.selectedDate).format('L');
this.selectedFromDateValue=fromDate;
this.selectedToDateValue=fromDate;
       this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue);

        if(moment(this.selectedDate).format('L')==moment(this.today).format('L')){
          this.disableNxtBtn=true
        }else{
          this.disableNxtBtn=false
        }
        if(this.selectedTabText=='ALL EMPLOYEES'){
          // this.ProductiveByOrgIDAndDate(localStorage.getItem('org_id'))
          // this.ProductivityGraphByOrgIDAndDate(localStorage.getItem('org_id'))
           
         }else if(this.selectedTabText=='TEAM'){
          // this.ProductiveByTeamIDAndDate(this.teamValue)
          // this.ProductiveGraphByTeamIDAndDate(this.teamValue)
        
          
         }else{
          // this.ProductiveByDeptIDAndDate(this.selectedDeptId)
          // this.ProductiveGraphByDeptIDAndDate(this.selectedDeptId)
        
        
         }


   
        
       }
      
      public tabSelected(args: SelectEventArgs): void {
        console.log('tabSelected',args)
        this.showTimeSpinner=true;

     
       
     
       if(args.selectedItem.innerText=="ALL EMPLOYEES"){
        this.spinner.show();
       
         this.selectedTabText='ALL EMPLOYEES';
         this.selectedTabValue=localStorage.getItem('org_id')
         this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue);


       }else if(args.selectedItem.innerText=="TEAM"){
         this.selectedTabText='TEAM';
         this.spinner.show();
         this.selectedTabValue=this.selectedTeamId;
         this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue);
       

       }else{
         this.selectedTabText='Other';
         this.spinner.show();

         this.deptService.fetchGridDataByDepartmentOrgID().subscribe(
           (data:any)  => {
       this.user_info={};
       var results=[]
          
          if(data){
            for(var i=0;i<data.length;i++){
              if(data[i].dep_name.toLocaleLowerCase()==args.selectedItem.innerText.toLocaleLowerCase()){
                // this.selectedDeptId=data[i].department_id
         this.selectedTabValue=data[i].department_id

              }
            }
   
         this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue)
   
   
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
   changedTeam(e){
    //  this.teamValue=e.value;
      this.selectedTabValue=this.teamValue
     this.EmployeeAppTrackedByEmpIDAndDate(e.value)

  
   }
    public changedTypeofApp(e: any): void {
      this.typeOfAppValue= e.value;
     
    }  
    public changedProdApp(e: any): void {
      this.prodAppValue= e.value;
     
    }   public changedUnprodApp(e: any): void {
      this.unprodAppValue= e.value;
     
    }   public changedNeutralApp(e: any): void {
      this.neutralAppValue= e.value;
     
    }   
  ngOnInit() {
this.isTodayActive=true;
this.isWeekActive=false;
this.isMonthActive=false;
this.selectedTabValue=localStorage.getItem('org_id');
    this.FetchGridDataByDepartmentOrgID();
    this.FindTeamsByOrgID();
    this.selectedFromDateValue=this.today;
    this.selectedToDateValue=this.today;
    this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue);

    this.datePickerForm = new FormGroup({
      date: new FormControl(''),
     
  
  
          
   });  
this.dateText=moment(this.today).format('ddd, D MMM YYYY')

   this.datePickerForm.get('date').valueChanges.subscribe(() => {
    // fires when the input value has actually changed
   let dateValue=this.datePickerForm.get('date').value
   this.dateText=moment(this.datePickerForm.get('date').value).format('ddd, D MMM YYYY');
   this.dateSelect=moment(dateValue).format('L')
   sessionStorage.setItem('workforceDate',JSON.stringify(dateValue)); 
   this.selectedFromDateValue=dateValue;
   this.selectedToDateValue=dateValue;
   this.EmployeeAppTrackedByEmpIDAndDate(this.selectedTabValue);

  //  if(this.selectedTabText=='ALL EMPLOYEES'){
  //   this.WorkforceProductiveByOrgIDAndDate(localStorage.getItem('org_id'))
     
  //  }else if(this.selectedTabText=='TEAM'){
  //   this.WorkforceProductiveByTeamIDAndDate(this.teamValue)
    
  //  }else{
  //   this.WorkforceProductiveByDeptIDAndDate(this.selectedDeptId)
  
  
  
  this.spinner.show();
  this.showweeksContainer=false;
  //    this.EmpProductivityDashboard(dateValue,dateValue);
  //    //this.DesktopEmpProductivity(dateValue,dateValue);
  //    this.GetTimesheetActivityByEmpIDAndDate(dateValue,dateValue);
  // // this.EmployeeAppTrackedByEmpIDAndDate(dateValue,dateValue);
  // this.EmployeeProductivityTimeFrequencyByEmpIDAndDate(dateValue,dateValue);
  // this.GetTaskTimelineByEmpIDAndDate(dateValue,dateValue);
  
  if(moment(dateValue).format('L')==moment(this.today).format('L')){
    this.disableNxtBtn=true
  }else{
    this.disableNxtBtn=false
  }
      // this.showweeksData=true;
      this.showtodaysData=true;
  });
  }

}
