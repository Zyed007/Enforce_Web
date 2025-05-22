// import { Pipe, PipeTransform } from '@angular/core';
// @Pipe({
//   name: 'filter'
// })
// export class FilterPipe implements PipeTransform {
//   transform(items: any[], searchText: string): any[] {
//     if(!items) return [];
//     if(!searchText) return items;
//     console.log('searchText',searchText)
// searchText = searchText.toString().toLowerCase();
// console.log('items',items)

// return items.filter( it => {
//       return it.toString().toLowerCase().includes(searchText);
//     });
//    }
// }

import { Pipe, PipeTransform, Injectable } from '@angular/core';

    // @Pipe({
    //   name: 'filter'
    // })
    // export class FilterPipe implements PipeTransform {

    //   transform(value: any[], input: string) {
    //     if (input) {
    //         input = input.toString().toLowerCase();
    //         return value.filter(function (el: any[]) {
    //             return el.toString().toLowerCase().indexOf(input) > -1;
    //         });
    //     }console.log('filtervalue',value);
    //     return value;
    // }

    // }

    
@Pipe({
    name: 'projfilter',
    pure: false
  })
 
  export class ProjFilterPipe implements PipeTransform {
  
    // constructor() { }
  
    // transform(value: any, query: string, field: string): any {
    //     return query ? value.reduce((prev, next) => {
    //       if (next[field].includes(query)) { prev.push(next); }
    //       return prev;
    //     }, []) : value;
    //   }
    transform(value:any[],searchString:string ){

        if(!searchString){
        //   console.log('no search')
         return value  
        }
       
      
 if(searchString!=''){
    return value.filter(it=>{   
        // console.log('projfilter',it)
        const subtaskName = (it.sub_task_name!=''&&it.sub_task_name!=null)?it.sub_task_name.toLowerCase().toString().includes(searchString.toLowerCase()):false
        const taskName =(it.task_name!=''&&it.task_name!=null)? it.task_name.toLowerCase().toString().includes(searchString.toLowerCase()):false
         const projName = (it.project_name!='' &&it.project_name!=null) ?it.project_name.toLowerCase().toString().includes(searchString.toLowerCase()):false
        const milestName = (it.activity_name!=''&&it.activity_name!=null)?it.activity_name.toLowerCase().toString().includes(searchString.toLowerCase()):false
        const statusName =(it.status_name!=''&&it.status_name!=null)? it.status_name.toLowerCase().toString().includes(searchString.toLowerCase()):false
        
        //  console.log( builderId + groupName + companyPersonName);
         return (subtaskName + taskName + projName + milestName  +statusName );      
        //return (builderId  );      
    }) 
 }
 }
       
  }