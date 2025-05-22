import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
  name: 'filter',
  pure: false
})

export class FilterPipe implements PipeTransform {
  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }


 if(searchString!=''){

    return value.filter(it=>{

        const subtaskName = (it.subTaskName!=''&&it.subTaskName!=null)?it.subTaskName.toLowerCase().toString().includes(searchString.toLowerCase()):false
        const taskName =(it.taskName!=''&&it.taskName!=null)? it.taskName.toLowerCase().toString().includes(searchString.toLowerCase()):false
         const projName = (it.projectName!='' &&it.projectName!=null) ?it.projectName.toLowerCase().toString().includes(searchString.toLowerCase()):false
        const milestName = (it.milestoneName!=''&&it.milestoneName!=null)?it.milestoneName.toLowerCase().toString().includes(searchString.toLowerCase()):false
        const statusName =(it.statusName!=''&&it.statusName!=null)? it.statusName.toLowerCase().toString().includes(searchString.toLowerCase()):false

        return (subtaskName + taskName + projName + milestName  +statusName );
    })
  }
 }
}
