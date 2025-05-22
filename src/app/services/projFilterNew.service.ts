import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
    name: 'projfilternew',
    pure: false
  })

  export class ProjFilterNewPipe implements PipeTransform {
    transform(value:any[],searchString:string ){

        if(!searchString){
         return value
        }


 if(searchString!=''){
    return value.filter(it=>{
        const subtaskName = (it.SubtaskName!=''&&it.SubtaskName!=null)?it.SubtaskName.toLowerCase().toString().includes(searchString.toLowerCase()):false
        const taskName =(it.TaskName!=''&&it.TaskName!=null)? it.TaskName.toLowerCase().toString().includes(searchString.toLowerCase()):false
         const projName = (it.ProjectName!='' &&it.ProjectName!=null) ?it.ProjectName.toLowerCase().toString().includes(searchString.toLowerCase()):false
        const milestName = (it.MilestoneName!=''&&it.MilestoneName!=null)?it.MilestoneName.toLowerCase().toString().includes(searchString.toLowerCase()):false
        const statusName =(it.StatusName!=''&&it.StatusName!=null)? it.StatusName.toLowerCase().toString().includes(searchString.toLowerCase()):false
        const assignName =(it.EmployeeName!=''&&it.EmployeeName!=null)? it.EmployeeName.toLowerCase().toString().includes(searchString.toLowerCase()):false
         return (subtaskName + taskName + projName + milestName  +statusName +assignName );
    })
 }
 }

  }
