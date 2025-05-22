import { Component,OnInit, ViewEncapsulation, Inject, ViewChild } from '@angular/core';

import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import * as $ from 'jquery';
import * as moment from 'moment';
import { LoginService } from '../../services/login.service';

import { SidebarComponent, MenuEventArgs, MenuComponent, TreeViewComponent, NodeSelectEventArgs, NodeClickEventArgs, TreeView } from '@syncfusion/ej2-angular-navigations';
import { Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { enableRipple } from '@syncfusion/ej2-base';
import { OrganizationService } from '../../services/organization.service';
// import {AdminHeaderModule} from './adminHeader.module';

@Component({
    selector: 'project-header',
    templateUrl: './project-header.component.html',
    styleUrls: ['./project-header.component.scss'],
})


export class ProjectHeaderComponent implements OnInit {
  public pushRightClass: string;
  public time;
  public user_info:object;
public full_name:string;
public superAdmin=false;
public user_name:string;
public org_name:string;
public admin_dashboard=false;
public emp_dashboard=false;
public superAdmin_dashboard=false;
public enableGestures=false;

//  @ViewChild('sidebarTreeviewInstance ',{static:false}) public sidebarMenuInstance: SidebarComponent;

 @ViewChild('sidebarTreeviewInstance',{static:false})
 public sidebarTreeviewInstance: SidebarComponent;
@ViewChild('tree',{static:true})  tree: TreeViewComponent;
public menu: MenuComponent;
  planType: string;
  // orgService: any;

public NodeSelect(args){
// To get the actual tree data
var actualData = this.tree.getTreeData(args.nodeData.id)[0];

}
public width: string = '236px';
public mediaQuery: string = ('(min-width: 600px)');
public target: string = '.project-content';
public dockSize: string = '50px';
 public enableDock: boolean = true;

navItems: NavItem[] = [
  {
    displayName: 'DevFestFL',
    iconName: 'recent_actors',
    route: 'devfestfl',
    children: [
      {
        displayName: 'Speakers',
        iconName: 'group',
        route: 'devfestfl/speakers',
        children: [
          {
            displayName: 'Michael Prentice',
            iconName: 'person',
            route: 'devfestfl/speakers/michael-prentice',
            children: [
              {
                displayName: 'Create Enterprise UIs',
                iconName: 'star_rate',
                route: 'devfestfl/speakers/michael-prentice/material-design'
              }
            ]
          },
          {
            displayName: 'Stephen Fluin',
            iconName: 'person',
            route: 'devfestfl/speakers/stephen-fluin',
            children: [
              {
                displayName: 'What\'s up with the Web?',
                iconName: 'star_rate',
                route: 'devfestfl/speakers/stephen-fluin/what-up-web'
              }
            ]
          },
          {
            displayName: 'Mike Brocchi',
            iconName: 'person',
            route: 'devfestfl/speakers/mike-brocchi',
            children: [
              {
                displayName: 'My ally, the CLI',
                iconName: 'star_rate',
                route: 'devfestfl/speakers/mike-brocchi/my-ally-cli'
              },
              {
                displayName: 'Become an Angular Tailor',
                iconName: 'star_rate',
                route: 'devfestfl/speakers/mike-brocchi/become-angular-tailer'
              }
            ]
          }
        ]
      },
      {
        displayName: 'Sessions',
        iconName: 'speaker_notes',
        route: 'devfestfl/sessions',
        children: [
          {
            displayName: 'Create Enterprise UIs',
            iconName: 'star_rate',
            route: 'devfestfl/sessions/material-design'
          },
          {
            displayName: 'What\'s up with the Web?',
            iconName: 'star_rate',
            route: 'devfestfl/sessions/what-up-web'
          },
          {
            displayName: 'My ally, the CLI',
            iconName: 'star_rate',
            route: 'devfestfl/sessions/my-ally-cli'
          },
          {
            displayName: 'Become an Angular Tailor',
            iconName: 'star_rate',
            route: 'devfestfl/sessions/become-angular-tailer'
          }
        ]
      },
      {
        displayName: 'Feedback',
        iconName: 'feedback',
        route: 'devfestfl/feedback'
      }
    ]
  },
  {
    displayName: 'Disney',
    iconName: 'videocam',
    children: [
      {
        displayName: 'Speakers',
        iconName: 'group',
        children: [
          {
            displayName: 'Michael Prentice',
            iconName: 'person',
            route: 'michael-prentice',
            children: [
              {
                displayName: 'Create Enterprise UIs',
                iconName: 'star_rate',
                route: 'material-design'
              }
            ]
          },
          {
            displayName: 'Stephen Fluin',
            iconName: 'person',
            route: 'stephen-fluin',
            children: [
              {
                displayName: 'What\'s up with the Web?',
                iconName: 'star_rate',
                route: 'what-up-web'
              }
            ]
          },
          {
            displayName: 'Mike Brocchi',
            iconName: 'person',
            route: 'mike-brocchi',
            children: [
              {
                displayName: 'My ally, the CLI',
                iconName: 'star_rate',
                route: 'my-ally-cli'
              },
              {
                displayName: 'Become an Angular Tailor',
                iconName: 'star_rate',
                route: 'become-angular-tailer'
              }
            ]
          }
        ]
      },
      {
        displayName: 'Sessions',
        iconName: 'speaker_notes',
        children: [
          {
            displayName: 'Create Enterprise UIs',
            iconName: 'star_rate',
            route: 'material-design'
          },
          {
            displayName: 'What\'s up with the Web?',
            iconName: 'star_rate',
            route: 'what-up-web'
          },
          {
            displayName: 'My ally, the CLI',
            iconName: 'star_rate',
            route: 'my-ally-cli'
          },
          {
            displayName: 'Become an Angular Tailor',
            iconName: 'star_rate',
            route: 'become-angular-tailer'
          }
        ]
      },
      {
        displayName: 'Feedback',
        iconName: 'feedback',
        route: 'feedback'
      }
    ]
  },
  {
    displayName: 'Orlando',
    iconName: 'movie_filter',
    children: [
      {
        displayName: 'Speakers',
        iconName: 'group',
        children: [
          {
            displayName: 'Michael Prentice',
            iconName: 'person',
            route: 'michael-prentice',
            children: [
              {
                displayName: 'Create Enterprise UIs',
                iconName: 'star_rate',
                route: 'material-design'
              }
            ]
          },
          {
            displayName: 'Stephen Fluin',
            iconName: 'person',
            route: 'stephen-fluin',
            children: [
              {
                displayName: 'What\'s up with the Web?',
                iconName: 'star_rate',
                route: 'what-up-web'
              }
            ]
          },
          {
            displayName: 'Mike Brocchi',
            iconName: 'person',
            route: 'mike-brocchi',
            children: [
              {
                displayName: 'My ally, the CLI',
                iconName: 'star_rate',
                route: 'my-ally-cli'
              },
              {
                displayName: 'Become an Angular Tailor',
                iconName: 'star_rate',
                route: 'become-angular-tailer'
              }
            ]
          }
        ]
      },
      {
        displayName: 'Sessions',
        iconName: 'speaker_notes',
        children: [
          {
            displayName: 'Create Enterprise UIs',
            iconName: 'star_rate',
            route: 'material-design'
          },
          {
            displayName: 'What\'s up with the Web?',
            iconName: 'star_rate',
            route: 'what-up-web'
          },
          {
            displayName: 'My ally, the CLI',
            iconName: 'star_rate',
            route: 'my-ally-cli'
          },
          {
            displayName: 'Become an Angular Tailor',
            iconName: 'star_rate',
            route: 'become-angular-tailer'
          }
        ]
      },
      {
        displayName: 'Feedback',
        iconName: 'feedback',
        route: 'feedback'
      }
    ]
  },
  {
    displayName: 'Maleficent',
    disabled: true,
    iconName: 'report_problem',
    children: [
      {
        displayName: 'Speakers',
        iconName: 'group',
        children: [
          {
            displayName: 'Michael Prentice',
            iconName: 'person',
            route: 'michael-prentice',
            children: [
              {
                displayName: 'Create Enterprise UIs',
                iconName: 'star_rate',
                route: 'material-design'
              }
            ]
          },
          {
            displayName: 'Stephen Fluin',
            iconName: 'person',
            route: 'stephen-fluin',
            children: [
              {
                displayName: 'What\'s up with the Web?',
                iconName: 'star_rate',
                route: 'what-up-web'
              }
            ]
          },
          {
            displayName: 'Mike Brocchi',
            iconName: 'person',
            route: 'mike-brocchi',
            children: [
              {
                displayName: 'My ally, the CLI',
                iconName: 'star_rate',
                route: 'my-ally-cli'
              },
              {
                displayName: 'Become an Angular Tailor',
                iconName: 'star_rate',
                route: 'become-angular-tailer'
              }
            ]
          }
        ]
      },
      {
        displayName: 'Sessions',
        iconName: 'speaker_notes',
        children: [
          {
            displayName: 'Create Enterprise UIs',
            iconName: 'star_rate',
            route: 'material-design'
          },
          {
            displayName: 'What\'s up with the Web?',
            iconName: 'star_rate',
            route: 'what-up-web'
          },
          {
            displayName: 'My ally, the CLI',
            iconName: 'star_rate',
            route: 'my-ally-cli'
          },
          {
            displayName: 'Become an Angular Tailor',
            iconName: 'star_rate',
            route: 'become-angular-tailer'
          }
        ]
      },
      {
        displayName: 'Feedback',
        iconName: 'feedback',
        route: 'feedback'
      }
    ]
  }
];
public adminHeaderItems: IMenuItemModelChild[] = [
  {
    text: 'Overview',
    path: "/organizations",
    iconCss: 'kt-menu__link-icon flaticon2-architecture-and-city'

},
{
  text: 'Manage Organizations',
  path: "/organization-profile",
  iconCss: 'icon-globe icon',

},
  {
      text: 'System Admin Settings',
      path: "/organization-profile",
      iconCss: 'icon-globe icon',
      items: [
          { text: 'Plan', path: '/plan'},
          { text: 'Feature', path: '/feature' },
          { text: 'Price', path: '/price' },
      ]
  },
  ]

//   public data: Object[] = [
//     {
//       nodeId: '01',
//       nodeText: 'DASHBOARD',
//        path: "/dashboard",
//       iconCss: 'icon-home icon',"expanded": false,


//   },
//   {
//     nodeId: '02',
//     nodeText: 'TIME LOG',
//      path: "/dashboard-user",
//     iconCss: 'icon-clock icon',"expanded": false,


// },


//     ]
public planName;
public toProfile(){

}

public data: Object[] = [
  {
    nodeId: '01',
    nodeText: 'DASHBOARD',
     path: "/dashboard",
    icon: 'icon-home icon',"expanded": false,


},
{
  nodeId: '02',
  nodeText: 'TIME LOG',
   path: "/dashboard-user",
   icon: 'icon-clock icon',"expanded": false,


},

  // {
  //   nodeId: '03',
  //     nodeText: 'RESOURCE',
  //      icon: 'icon-resource icon',
  //     nodeChild: [

  //         { nodeId: "03-01",
  //           nodeText: 'DEPARTMENT',
  //          path: '/departments',icon: 'icon-dept icon'
  //       },
  //         {  nodeId: "03-02",
  //           nodeText: 'DESIGNATION',
  //         path: '/designation',icon: 'icon-desgn icon'
  //        },
  //        {  nodeId: "03-03",
  //        nodeText: 'EMPLOYEE',
  //      path: '/employee',icon: 'icon-emp  icon'
  //     },

  //     ]
  // },
  {
      nodeId: '14',
        nodeText: 'WORKFORCE',
        path: '/workforce',
         icon: 'icon-workforce icon',

    },


      {
        nodeId: '17',
          nodeText: 'PRODUCTIVITY',
           icon: 'icon-emp  icon',
           path: '/productivity-emp'

      },
  {
    nodeId: '04',
    nodeText: 'LEAVE',
 path: "/leave-details",
icon: 'icon-function icon',"expanded": false,


},
{
  nodeId: '15',
  nodeText: 'CUSTOMER',
  path: "/customer-contact",
 icon: 'icon-function icon'


},


{
nodeId: '06',
nodeText: 'LEAD',
path: "/customer",
icon: 'icon-function icon'


},
 {
  nodeId: '07',
  nodeText: 'ESTIMATION',
  path: "/cost-estimate",
  icon: 'icon-cost icon',"expanded": false,
//     nodeChild: [
//       { nodeId: "07-01",
//       nodeText: 'COST',
//       path: "/cost-estimate",icon: 'icon-settings icon'
//   },


// ]


}, {
nodeId: '13',
nodeText: 'QUOTATION',
path: "/quotation",
icon: 'icon-function icon',"expanded": false,
//     nodeChild: [
//       { nodeId: "07-01",
//       nodeText: 'COST',
//       path: "/cost-estimate",icon: 'icon-settings icon'
//   },


// ]


},
{
nodeId: '08',
nodeText: 'PROJECT',
     path: "/projects",
    icon: 'icon-function icon',"expanded": false,


},
{
nodeId: '09',
nodeText: 'TASK',
path: '/task-form',
icon: 'icon-task icon',
//  nodeChild: [
//      { nodeId: "10-01",
//        nodeText: 'MANAGE TASK',
//       path: '/task-form',icon: 'icon-manage-task icon'
//    },
//    { nodeId: "10-02",
//    nodeText: 'ADMINISTRATIVE TASK',
//   path: '/administrative',icon: 'icon-function icon'
// }
//  ]
},
// {
//       nodeId: '11',
//         nodeText: 'TEMPLATE ',
//          icon: 'icon-function icon',
//         nodeChild: [

//             { nodeId: "11-01",
//               nodeText: 'MILESTONE',
//              path: '/milestone-template',icon: 'icon-function icon'
//           },
//             {  nodeId: "11-02",
//               nodeText: 'TASK',
//             path: '/task-template',icon: 'icon-desgn icon'
//            },

//         ]
//     },
{
nodeId: '03',
nodeText: 'EMPLOYEE',
path: '/employee',icon: 'icon-emp  icon'


},
  {
    nodeId: '05',
    nodeText: 'TEAM',
    path: '/team',icon: 'icon-team icon'


},
{
  nodeId: '16',
    nodeText: 'USER CONTROLS',
     icon: 'icon-emp  icon',
     path: '/user-controls'

},
  {
    nodeId: '12',
      nodeText: 'SETTINGS ',
       icon: 'icon-settings icon',
       path: '/settings'

  },

// {
//   nodeId: '14',
//     nodeText: 'COST SETUP',
//      icon: 'icon-settings  icon',
//     nodeChild: [
//       { nodeId: "14-01",
//       nodeText: 'DESIGN TYPE',
//      path: '/cost-type-design',icon: 'icon-settings icon'
//   },
//       //   { nodeId: "14-02",
//       //     nodeText: 'SPECIFICATION',
//       //    path: '/cost-specification',icon: 'icon-dept icon'
//       // },
//         {  nodeId: "14-02",
//           nodeText: 'UNIT DESCRIPTION',
//         path: '/cost-unit',icon: 'icon-desgn icon',

//        },

//     ]
// },
//   {
//     nodeId: '05',
//     nodeText: 'PROJECT',
//      path: "/projects",
//     icon: 'icon-function icon',"expanded": false,


// },
//   {
//     nodeId: '06',
//       nodeText: 'TEMPLATE ',
//        icon: 'icon-function icon',
//       nodeChild: [

//           { nodeId: "06-01",
//             nodeText: 'MILESTONE',
//            path: '/milestone-template',icon: 'icon-function icon'
//         },
//           {  nodeId: "06-02",
//             nodeText: 'TASK',
//           path: '/task-template',icon: 'icon-desgn icon'
//          },

//       ]
//   },
//   {
//     nodeId: '07',
//     nodeText: 'LEAD',
//      path: "/customer",
//     icon: 'icon-function icon',"expanded": false,


// },
// {
//   nodeId: '14',
//   nodeText: 'LEAVE',
//    path: "/leave-details",
//   icon: 'icon-function icon',"expanded": false,


// },
//   {
//     nodeId: '08',
//     nodeText: 'DELEGATION',
//      path: "/delegation",
//     icon: 'icon-delegate icon',"expanded": false,


// },

// {
//   nodeId: '09',
//     nodeText: 'WORKFORCE',

//      icon: 'icon-workforce icon',
//     nodeChild: [
//         { nodeId: "09-01",
//           nodeText: 'TEAM',
//          path: '/timesheet',icon: 'icon-team icon'
//       }
//     ]
// },

// {
//   nodeId: '10',
//     nodeText: 'TASK',

//      icon: 'icon-task icon',
//     nodeChild: [
//         { nodeId: "10-01",
//           nodeText: 'MANAGE TASK',
//          path: '/task-form',icon: 'icon-manage-task icon'
//       },
//       { nodeId: "10-02",
//       nodeText: 'ADMINISTRATIVE TASK',
//      path: '/administrative',icon: 'icon-function icon'
//   }
//     ]
// },
// {
//   nodeId: '11',
//     nodeText: 'SETTINGS',

//      icon: 'icon-settings icon',
//     nodeChild: [
//         { nodeId: "11-01",
//           nodeText: 'TASK PRIORITY',
//          path: '/task-priority',icon: 'icon-function icon'
//       },
//       { nodeId: "11-02",
//       nodeText: 'TASK STATUS',
//      path: '/task-status',icon: 'icon-status icon'
//   },
//   { nodeId: "11-03",
//   nodeText: 'EMPLOYEE STATUS',
//  path: '/employee-status',icon: 'icon-status icon'
// },
// { nodeId: "11-04",
//           nodeText: 'EMPLOYEE TYPE',
//          path: '/employee-type',icon: 'icon-function icon'
//       },
//       { nodeId: "11-05",
//       nodeText: 'PROJECT TYPE',
//      path: '/project-type',icon: 'icon-function icon'
//   },
//       { nodeId: "11-06",
//           nodeText: 'INDUSTRY TYPE',
//          path: '/industry-type',icon: 'icon-function icon'
//       },
//       { nodeId: "11-07",
//       nodeText: 'EMPLOYEE LEAVE SETUP',
//      path: '/leave-setup',icon: 'icon-function icon'
//   },
//   { nodeId: "11-08",
//       nodeText: 'LEAVE TYPE',
//      path: '/leave-type',icon: 'icon-function icon'
//   },
//       { nodeId: "11-09",
//           nodeText: 'TIMEOFF TYPE',
//          path: '/timeoff-type',icon: 'icon-function icon'
//       },
//       { nodeId: "11-10",
//       nodeText: 'LEAVE STATUS',
//      path: '/leave-status',icon: 'icon-function icon'
//   },{ nodeId: "11-11",
//   nodeText: 'LEAD COMPANY',
//  path: '/lead-company',icon: 'icon-function icon'
// },
// { nodeId: "11-12",
//   nodeText: 'LEAD SOURCE',
//  path: '/lead-source',icon: 'icon-function icon'
// },
// { nodeId: "11-13",
//   nodeText: 'LEAD RATING',
//  path: '/lead-rating',icon: 'icon-function icon'
// },
// { nodeId: "11-14",
//   nodeText: 'LEAD STATUS',
//  path: '/lead-status',icon: 'icon-function icon'
// },


//     ]
// },
// {
//   nodeId: '12',
//     nodeText: '',

//      icon: '',

// },
  ]
  public superAdminData: Object[] = [
    {
      nodeId: '01',
      nodeText: 'DASHBOARD',
       path: "/dashboard",
      icon: 'icon-home icon',"expanded": false,


  },
  {
    nodeId: '02',
    nodeText: 'TIME LOG',
     path: "/dashboard-user",
     icon: 'icon-clock icon',"expanded": false,


},

    // {
    //   nodeId: '03',
    //     nodeText: 'RESOURCE',
    //      icon: 'icon-resource icon',
    //     nodeChild: [

    //         { nodeId: "03-01",
    //           nodeText: 'DEPARTMENT',
    //          path: '/departments',icon: 'icon-dept icon'
    //       },
    //         {  nodeId: "03-02",
    //           nodeText: 'DESIGNATION',
    //         path: '/designation',icon: 'icon-desgn icon'
    //        },
    //        {  nodeId: "03-03",
    //        nodeText: 'EMPLOYEE',
    //      path: '/employee',icon: 'icon-emp  icon'
    //     },

    //     ]
    // },
    {
        nodeId: '14',
          nodeText: 'WORKFORCE',
          path: '/workforce',
           icon: 'icon-workforce icon',

      },

      {
        nodeId: '17',
          nodeText: 'PRODUCTIVITY',
           icon: 'icon-emp  icon',
           path: '/productivity-emp'

      },
      {
        nodeId: '21',
          nodeText: 'NOTIFICATION',
          path: '/emp-notification',
           icon: 'icon-bell-view icon',


      },
    {
      nodeId: '04',
      nodeText: 'LEAVE',
   path: "/leave-details",
  icon: 'icon-function icon',"expanded": false,


  },
  {
    nodeId: '15',
    nodeText: 'CUSTOMER',
    path: "/customer-contact",
   icon: 'icon-function icon'


  },


{
  nodeId: '06',
  nodeText: 'LEAD',
  path: "/customer",
 icon: 'icon-function icon'


},
   {
    nodeId: '07',
    nodeText: 'ESTIMATION',
    path: "/cost-estimate",
    icon: 'icon-cost icon',"expanded": false,
//     nodeChild: [
//       { nodeId: "07-01",
//       nodeText: 'COST',
//       path: "/cost-estimate",icon: 'icon-settings icon'
//   },


// ]


}, {
  nodeId: '13',
  nodeText: 'QUOTATION',
  path: "/quotation",
  icon: 'icon-function icon',"expanded": false,
//     nodeChild: [
//       { nodeId: "07-01",
//       nodeText: 'COST',
//       path: "/cost-estimate",icon: 'icon-settings icon'
//   },


// ]


},
{
  nodeId: '08',
  nodeText: 'PROJECT',
       path: "/projects",
      icon: 'icon-function icon',"expanded": false,


},
{
  nodeId: '09',
  nodeText: 'TASK',
  path: '/task-form',
  icon: 'icon-task icon',
//  nodeChild: [
//      { nodeId: "10-01",
//        nodeText: 'MANAGE TASK',
//       path: '/task-form',icon: 'icon-manage-task icon'
//    },
//    { nodeId: "10-02",
//    nodeText: 'ADMINISTRATIVE TASK',
//   path: '/administrative',icon: 'icon-function icon'
// }
//  ]
},
// {
//       nodeId: '11',
//         nodeText: 'TEMPLATE ',
//          icon: 'icon-function icon',
//         nodeChild: [

//             { nodeId: "11-01",
//               nodeText: 'MILESTONE',
//              path: '/milestone-template',icon: 'icon-function icon'
//           },
//             {  nodeId: "11-02",
//               nodeText: 'TASK',
//             path: '/task-template',icon: 'icon-desgn icon'
//            },

//         ]
//     },
{
  nodeId: '03',
  nodeText: 'EMPLOYEE',
  path: '/employee',icon: 'icon-emp  icon'


},
    {
      nodeId: '05',
      nodeText: 'TEAM',
      path: '/team',icon: 'icon-team icon'


  },
  {
    nodeId: '20',
    nodeText: 'TRAVELS',
    path: '/travels',
    icon: 'icon-street-view icon'
  },
  {
    nodeId: '16',
      nodeText: 'USER CONTROLS',
       icon: 'icon-emp  icon',
       path: '/user-controls'

  },
  {
    nodeId: '22',
      nodeText: 'REVENUE',
       icon: 'icon-cost icon',
       path: '/project-invoice'

  },
    {
      nodeId: '12',
        nodeText: 'SETTINGS ',
         icon: 'icon-settings icon',
         path: '/settings'

    },


    ]
  public UserDBdata: Object[] = [
    {
      nodeId: '01',
      nodeText: 'DASHBOARD',
       path: "/dashboard",
       icon: 'icon-home icon',"expanded": false,


  },
    {
      nodeId: '02',
      nodeText: 'TIME LOG',
       path: "/dashboard-user",
       icon: 'icon-clock icon',"expanded": false,


  },

      {
          nodeId: '14',
            nodeText: 'WORKFORCE',
            path: '/workforce',
             icon: 'icon-workforce icon',

        },

      {
        nodeId: '04',
        nodeText: 'LEAVE',
     path: "/leave-details",
    icon: 'icon-function icon',"expanded": false,


    },
    {
      nodeId: '15',
      nodeText: 'CUSTOMER',
      path: "/customer-contact",
     icon: 'icon-function icon'


    },


  {
    nodeId: '06',
    nodeText: 'LEAD',
    path: "/customer",
   icon: 'icon-function icon'


  },
     {
      nodeId: '07',
      nodeText: 'ESTIMATION',
      path: "/cost-estimate",
      icon: 'icon-cost icon',"expanded": false,



  }, {
    nodeId: '13',
    nodeText: 'QUOTATION',
    path: "/quotation",
    icon: 'icon-function icon',"expanded": false,



  },
  {
    nodeId: '08',
    nodeText: 'PROJECT',
         path: "/projects",
        icon: 'icon-function icon',"expanded": false,


  },
  {
    nodeId: '09',
    nodeText: 'TASK',
    path: '/task-form',
    icon: 'icon-task icon',

  },

  {
    nodeId: '03',
    nodeText: 'EMPLOYEE',
    path: '/employee',icon: 'icon-emp  icon'


  },
      {
        nodeId: '05',
        nodeText: 'TEAM',
        path: '/team',icon: 'icon-team icon'


    },


  // {
  //   nodeId: '14',
  //     nodeText: 'COST SETUP',
  //      icon: 'icon-settings  icon',
  //     nodeChild: [
  //       { nodeId: "14-01",
  //       nodeText: 'DESIGN TYPE',
  //      path: '/cost-type-design',icon: 'icon-settings icon'
  //   },
  //       //   { nodeId: "14-02",
  //       //     nodeText: 'SPECIFICATION',
  //       //    path: '/cost-specification',icon: 'icon-dept icon'
  //       // },
  //         {  nodeId: "14-02",
  //           nodeText: 'UNIT DESCRIPTION',
  //         path: '/cost-unit',icon: 'icon-desgn icon',

  //        },

  //     ]
  // },
    //   {
    //     nodeId: '05',
    //     nodeText: 'PROJECT',
    //      path: "/projects",
    //     icon: 'icon-function icon',"expanded": false,


    // },
  //   {
  //     nodeId: '06',
  //       nodeText: 'TEMPLATE ',
  //        icon: 'icon-function icon',
  //       nodeChild: [

  //           { nodeId: "06-01",
  //             nodeText: 'MILESTONE',
  //            path: '/milestone-template',icon: 'icon-function icon'
  //         },
  //           {  nodeId: "06-02",
  //             nodeText: 'TASK',
  //           path: '/task-template',icon: 'icon-desgn icon'
  //          },

  //       ]
  //   },
  //   {
  //     nodeId: '07',
  //     nodeText: 'LEAD',
  //      path: "/customer",
  //     icon: 'icon-function icon',"expanded": false,


  // },
  // {
  //   nodeId: '14',
  //   nodeText: 'LEAVE',
  //    path: "/leave-details",
  //   icon: 'icon-function icon',"expanded": false,


  // },
  //   {
  //     nodeId: '08',
  //     nodeText: 'DELEGATION',
  //      path: "/delegation",
  //     icon: 'icon-delegate icon',"expanded": false,


  // },

  // {
  //   nodeId: '09',
  //     nodeText: 'WORKFORCE',

  //      icon: 'icon-workforce icon',
  //     nodeChild: [
  //         { nodeId: "09-01",
  //           nodeText: 'TEAM',
  //          path: '/timesheet',icon: 'icon-team icon'
  //       }
  //     ]
  // },

  // {
  //   nodeId: '10',
  //     nodeText: 'TASK',

  //      icon: 'icon-task icon',
  //     nodeChild: [
  //         { nodeId: "10-01",
  //           nodeText: 'MANAGE TASK',
  //          path: '/task-form',icon: 'icon-manage-task icon'
  //       },
  //       { nodeId: "10-02",
  //       nodeText: 'ADMINISTRATIVE TASK',
  //      path: '/administrative',icon: 'icon-function icon'
  //   }
  //     ]
  // },
  // {
  //   nodeId: '11',
  //     nodeText: 'SETTINGS',

  //      icon: 'icon-settings icon',
  //     nodeChild: [
  //         { nodeId: "11-01",
  //           nodeText: 'TASK PRIORITY',
  //          path: '/task-priority',icon: 'icon-function icon'
  //       },
  //       { nodeId: "11-02",
  //       nodeText: 'TASK STATUS',
  //      path: '/task-status',icon: 'icon-status icon'
  //   },
  //   { nodeId: "11-03",
  //   nodeText: 'EMPLOYEE STATUS',
  //  path: '/employee-status',icon: 'icon-status icon'
  // },
  // { nodeId: "11-04",
  //           nodeText: 'EMPLOYEE TYPE',
  //          path: '/employee-type',icon: 'icon-function icon'
  //       },
  //       { nodeId: "11-05",
  //       nodeText: 'PROJECT TYPE',
  //      path: '/project-type',icon: 'icon-function icon'
  //   },
  //       { nodeId: "11-06",
  //           nodeText: 'INDUSTRY TYPE',
  //          path: '/industry-type',icon: 'icon-function icon'
  //       },
  //       { nodeId: "11-07",
  //       nodeText: 'EMPLOYEE LEAVE SETUP',
  //      path: '/leave-setup',icon: 'icon-function icon'
  //   },
  //   { nodeId: "11-08",
  //       nodeText: 'LEAVE TYPE',
  //      path: '/leave-type',icon: 'icon-function icon'
  //   },
  //       { nodeId: "11-09",
  //           nodeText: 'TIMEOFF TYPE',
  //          path: '/timeoff-type',icon: 'icon-function icon'
  //       },
  //       { nodeId: "11-10",
  //       nodeText: 'LEAVE STATUS',
  //      path: '/leave-status',icon: 'icon-function icon'
  //   },{ nodeId: "11-11",
  //   nodeText: 'LEAD COMPANY',
  //  path: '/lead-company',icon: 'icon-function icon'
  // },
  // { nodeId: "11-12",
  //   nodeText: 'LEAD SOURCE',
  //  path: '/lead-source',icon: 'icon-function icon'
  // },
  // { nodeId: "11-13",
  //   nodeText: 'LEAD RATING',
  //  path: '/lead-rating',icon: 'icon-function icon'
  // },
  // { nodeId: "11-14",
  //   nodeText: 'LEAD STATUS',
  //  path: '/lead-status',icon: 'icon-function icon'
  // },


  //     ]
  // },
  // {
  //   nodeId: '12',
  //     nodeText: '',

  //      icon: '',

  // },
      ]
public hierarchicalData: Object[] = [{
  "nodeId": "00",
  "nodeText": "About",
  "url": "about",
},
{
  "nodeId": "01",
  "nodeText": "Angular",
  "url": "angular",
  "nodeChild": [{
    "nodeId": "01-01",
    "nodeText": "Javascript",
    "url": "javascript",
  }]
},
{
  "nodeId": "02",
  "nodeText": "Products",
  "expanded": true,
  "url": "products",
  "nodeChild": [{
    "nodeId": "02-01",
    "nodeText": "Services",
    "url": "services",
  }]
}];
  // Mapping TreeView fields property with data source properties
  // public field:Object;
selectedNode: any;
public hide(){
this.sidebarTreeviewInstance.hide();
}
public  fetchByOrgId(){
  let org_id=localStorage.getItem('org_id')



  this.orgService.FindByOrgId(org_id).subscribe(
    (data:any)  => {
 this.org_name=data['org_name']
    },
    error  => {
      // Swal.fire(
      //   'Error!',
      //   error,
      //   'error'
      // ).then(
      //   //used Arrow function here
      //   (result)=> {
      //
      //     //  this.router.navigate(['/dashboard']);
      //   })


    }

    )
    }

  public field:Object ={ dataSource: this.data, id: 'nodeId', text: 'nodeText', child: 'nodeChild', iconCss: 'iconCss', expanded: 'expanded', selected: 'selected' };
  public onSelect(event:MenuEventArgs)
  {

      // const x:IMenuItemModelChild = event.item;
      // this.router.navigate([x.path], { relativeTo: this.route });

      // let text: string = event.item.text;
      // let isbreak: boolean = false;
      // let i = 0;
      //
      // (' this.menu', this.menu);
      // let customItem = this.menu.element.querySelector('.e-custom');
      // if (customItem) {
      //   customItem.classList.remove('e-custom');
      // }
      // event.element.classList.add("e-custom");

      // //For routing while selecting menu items
      // this.menuItems.forEach(obj => {
      //   if (obj.path && !isbreak) {
      //     if (event.element.parentElement.classList.contains('e-ul') && this.menuItems[i].items) {
      //       this.menuItems[i].items.forEach(childobj => {
      //         if (childobj.text === text) {
      //           this.router.navigate([childobj.path]);
      //           this.menu.element.children[(this.menu as any).navIdx[0]].classList.add('e-custom');
      //           isbreak = true;
      //         }
      //       });
      //     }
      //     else if (obj.text === text) {
      //       this.router.navigate([obj.path]);
      //       isbreak = true;
      //     }
      //   }
      //   i++;
      // })
  }


  public navigateanotherPage($event: NodeSelectEventArgs){
  //   let data:any = this.tree.getTreeData(args.node);
  //   let routerLink: string = data[0].path;
  //  this.router.navigate([routerLink]);
    //  window.location.href = <string>data[0].navigateUrl;
    // this.selectedNode = $event.nodeData.id;


    let data12= this.tree.getTreeData($event.node)
    if(data12[0].path){
      let routerLink = data12[0].path;
      this.router.navigate([routerLink]);
    }



}
public menuItems: any[] = [

  {
      text: 'Notification',
      iconCss: 'icon-bell-alt icon',
      items: [
          { text: 'sdf', path:"/organizations"},

      ]
  },


];

public AccountMenuItem: MenuItemModel[] = [
  {
      text: 'Account',
      items: [
          { text: 'Profile' },
          { text: 'Sign out' },
      ]
  }
];
  constructor(private translate: TranslateService, public router: Router,public service:LoginService,public orgService:OrganizationService,
    private route:ActivatedRoute) {
     // this.field = { dataSource: this.hierarchicalData, id: 'nodeId', text: 'nodeText', child: 'nodeChild', expanded: 'expanded', selected: 'selected' };
    // sourceFiles.files = ['sidebar-menu.css'];

      this.router.events.subscribe(val => {
          if (
              val instanceof NavigationEnd &&
              window.innerWidth <= 992 &&
              this.isToggled()
          ) {
              this.toggleSidebar();
          }
      });
      
  }
  openClick() {
    this.sidebarTreeviewInstance.toggle();
}
closeClick() {
  this.sidebarTreeviewInstance.hide();
}
public loadRoutingContent(args: NodeSelectEventArgs): void {
  let data:any = this.tree.getTreeData(args.node);
  let routerLink: string = data[0].url;
  this.router.navigate([routerLink]);
}

  ngOnInit():void {
  //   $.getScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js');
  // $.getScript('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js');
  // this.tree.fields = this.field;
  // $("#ej2-datepicker_1_input").attr("disabled", "disabled");
this.fetchByOrgId();
    if(localStorage.getItem('user_info')){
      this.user_info= JSON.parse(localStorage.getItem('user_info'));
      this.full_name=this.user_info['first_name'];

     ;


  }
  if(localStorage.getItem('planType')){

    this.planType=localStorage.getItem('planType')
  }
  if(localStorage.getItem('user_info')){
    this.user_info= JSON.parse(localStorage.getItem('user_info'));

    this.user_name=this.user_info['full_name'];
    if(this.user_info['is_superadmin']==true){
      this.admin_dashboard=true;
      this.superAdmin_dashboard=true;
      this.emp_dashboard=false;
      this.field ={ dataSource: this.superAdminData, id: 'nodeId', text: 'nodeText', child: 'nodeChild', expanded: 'expanded' };

    }
    if(this.user_info['is_admin']==true && this.user_info['is_superadmin']==false){
      this.admin_dashboard=true;
      this.superAdmin_dashboard=false;
      this.emp_dashboard=true;
      this.field ={ dataSource: this.superAdminData, id: 'nodeId', text: 'nodeText', child: 'nodeChild', expanded: 'expanded', selected: 'selected' };

    }
    if(this.user_info['is_admin']==false && this.user_info['is_superadmin']==false){
      this.admin_dashboard=true;
      this.superAdmin_dashboard=false;
      this.emp_dashboard=true;
      // this.field ={ dataSource: this.EmpDBdata, id: 'nodeId', text: 'nodeText', child: 'nodeChild', expanded: 'expanded', selected: 'selected' };
      this.field ={ dataSource: this.UserDBdata, id: 'nodeId', text: 'nodeText', child: 'nodeChild', expanded: 'expanded', selected: 'selected' };

    }

  }

    setInterval(() => {
      // this.time=moment().format('MM/DD/YYYY hh:mm:ss A');
       this.time=moment().format('hh:mm a');
      //
      // return (moment().format('hh:mm a'));
      localStorage.setItem( 'currentTime', this.time );
      if(this.service.getVisible()==true){
        //

      }
    }, 2000);

      var api = "https://cors-anywhere.herokuapp.com/https://fcc-weather-api.glitch.me/api/current?";
      var lat, lon;
      var tempUnit = 'C';
      var currentTempInCelsius;

    $( document ).ready(function(){
      //
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = "lat=" + position.coords.latitude;
        var lon = "lon=" + position.coords.longitude;
      //  getWeather(lat, lon);

      });
    } else {

    }

    $("#tempunit").click(function () {
      var currentTempUnit = $("#tempunit").text();
      var newTempUnit = currentTempUnit == "C" ? "F" : "C";
      $("#tempunit").text(newTempUnit);
      if (newTempUnit == "F") {
        var fahTemp = Math.round(parseInt($("#temp").text()) * 9 / 5 + 32);
        $("#temp").text(fahTemp + " " + String.fromCharCode(176));
      } else {
        $("#temp").text(currentTempInCelsius + " " + String.fromCharCode(176));
      }
    });

  })

  function getWeather(lat, lon) {
    var urlString = api + lat + "&" + lon;
    $.ajax({
      url: urlString, success: function (result) {
        $("#city").text(result.name + ", ");
        $("#country").text(result.sys.country);


        currentTempInCelsius = Math.round(result.main.temp * 10) / 10;
        $("#temp").text(currentTempInCelsius + " " + String.fromCharCode(176));
        $("#tempunit").text(tempUnit);
        $("#desc").text(result.weather[0].main);
        IconGen(result.weather[0].main);
      }
    });
  }

  function IconGen(desc) {
    var desc = desc.toLowerCase()
    switch (desc) {
      case 'drizzle':
        addIcon(desc)
        break;
      case 'clouds':
        addIcon(desc)
        break;
      case 'rain':
        addIcon(desc)
        break;
      case 'snow':
        addIcon(desc)
        break;
      case 'clear':
        addIcon(desc)
        break;
      case 'thunderstom':
        addIcon(desc)
        break;
      default:
        $('div.clouds').removeClass('hide');
    }
  }

  function addIcon(desc) {
    $('div.' + desc).removeClass('hide');
  }


      this.pushRightClass = 'push-right';
//$.getScript("assets/plugins/global/plugins.bundle.js")
// $.getScript("assets/js/scripts.bundle.js")
// $.getScript('assets/js/pages/dashboard.js')

  }

  isToggled(): boolean {
      const dom: Element = document.querySelector('body');
      return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
      const dom: any = document.querySelector('body');
      dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
      const dom: any = document.querySelector('body');
      dom.classList.toggle('rtl');
  }

  onLoggedout() {
    localStorage.clear();
     this.router.navigate(["/signin"]);
}

  changeLang(language: string) {
      this.translate.use(language);
  }


}

export interface NavItem {
displayName: string;
disabled?: boolean;
iconName: string;
route?: string;
children?: NavItem[];
}
export interface IMenuItemModelChild extends MenuItemModel {

  path?:string;     //This is for your path
  query?:string;     //This is for your optional query param, add more query properties if you need them
  items?: IMenuItemModelChild[]; //We over write the exiting items property of the parent
}








