import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
// import * as $ from 'jquery';
import * as moment from "moment";
import { OrganizationService } from "../../../services/organization.service";
import Swal from "sweetalert2";
import { BsDropdownConfig } from "ngx-bootstrap/dropdown";
import {
  SidebarComponent,
  MenuEventArgs,
  MenuComponent,
  TreeViewComponent,
  NodeSelectEventArgs,
  NodeClickEventArgs,
  TreeView,
} from "@syncfusion/ej2-angular-navigations";
import { Menu, MenuItemModel } from "@syncfusion/ej2-navigations";
import { enableRipple } from "@syncfusion/ej2-base";
import { LoginService } from "../../../services/login.service";
import { NotificationService } from "../../../services/notification.service";
import { Subscription } from "rxjs";
import * as signalR from "@aspnet/signalr";
import { EmployeeService } from "../../../services/employee.service";
import { AdminSettingService } from "../../../services/admin-setting.service";
import { UserService } from "../../../services/user.service";
import * as _ from "lodash";
import {  ToastrService } from "ngx-toastr";

declare var $: any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class HeaderComponent implements OnInit {
  public headerTags: string;
  public pushRightClass: string;
  public time;
  public user_info: object;
  public full_name: string;
  public superAdmin = false;
  public user_name: string;
  public org_name: string;
  public admin_dashboard = false;
  public emp_dashboard = false;
  public superAdmin_dashboard = false;
  public enableGestures: boolean = false;
  public showCloseBtn = true;

  newNotificationData;

  //  @ViewChild('sidebarTreeviewInstance ',{static:false}) public sidebarMenuInstance: SidebarComponent;

  @ViewChild("sidebarTreeviewInstance", { static: false })
  public sidebarTreeviewInstance: SidebarComponent;
  @ViewChild("tree", { static: true }) tree: TreeViewComponent;
  public menu: MenuComponent;
  planType: boolean = false;
  planName: string;
  locationSubscription: Subscription;
  notify_type: any;
  notify_desc: any;
  notify_name: any;
  // orgService: any;

  public NodeSelect(args) {
    // To get the actual tree data
    var actualData = this.tree.getTreeData(args.nodeData.id)[0];
  }
  public width: string = "236px";
  public mediaQuery: string = "(min-width: 600px)";
  public target: string = ".main-content";
  public dockSize: string = "50px";
  public enableDock: boolean = true;
  navItems: NavItem[] = [
    {
      displayName: "DevFestFL",
      iconName: "recent_actors",
      route: "devfestfl",
      children: [
        {
          displayName: "Speakers",
          iconName: "group",
          route: "devfestfl/speakers",
          children: [
            {
              displayName: "Michael Prentice",
              iconName: "person",
              route: "devfestfl/speakers/michael-prentice",
              children: [
                {
                  displayName: "Create Enterprise UIs",
                  iconName: "star_rate",
                  route: "devfestfl/speakers/michael-prentice/material-design",
                },
              ],
            },
            {
              displayName: "Stephen Fluin",
              iconName: "person",
              route: "devfestfl/speakers/stephen-fluin",
              children: [
                {
                  displayName: "What's up with the Web?",
                  iconName: "star_rate",
                  route: "devfestfl/speakers/stephen-fluin/what-up-web",
                },
              ],
            },
            {
              displayName: "Mike Brocchi",
              iconName: "person",
              route: "devfestfl/speakers/mike-brocchi",
              children: [
                {
                  displayName: "My ally, the CLI",
                  iconName: "star_rate",
                  route: "devfestfl/speakers/mike-brocchi/my-ally-cli",
                },
                {
                  displayName: "Become an Angular Tailor",
                  iconName: "star_rate",
                  route:
                    "devfestfl/speakers/mike-brocchi/become-angular-tailer",
                },
              ],
            },
          ],
        },
        {
          displayName: "Sessions",
          iconName: "speaker_notes",
          route: "devfestfl/sessions",
          children: [
            {
              displayName: "Create Enterprise UIs",
              iconName: "star_rate",
              route: "devfestfl/sessions/material-design",
            },
            {
              displayName: "What's up with the Web?",
              iconName: "star_rate",
              route: "devfestfl/sessions/what-up-web",
            },
            {
              displayName: "My ally, the CLI",
              iconName: "star_rate",
              route: "devfestfl/sessions/my-ally-cli",
            },
            {
              displayName: "Become an Angular Tailor",
              iconName: "star_rate",
              route: "devfestfl/sessions/become-angular-tailer",
            },
          ],
        },
        {
          displayName: "Feedback",
          iconName: "feedback",
          route: "devfestfl/feedback",
        },
      ],
    },
    {
      displayName: "Disney",
      iconName: "videocam",
      children: [
        {
          displayName: "Speakers",
          iconName: "group",
          children: [
            {
              displayName: "Michael Prentice",
              iconName: "person",
              route: "michael-prentice",
              children: [
                {
                  displayName: "Create Enterprise UIs",
                  iconName: "star_rate",
                  route: "material-design",
                },
              ],
            },
            {
              displayName: "Stephen Fluin",
              iconName: "person",
              route: "stephen-fluin",
              children: [
                {
                  displayName: "What's up with the Web?",
                  iconName: "star_rate",
                  route: "what-up-web",
                },
              ],
            },
            {
              displayName: "Mike Brocchi",
              iconName: "person",
              route: "mike-brocchi",
              children: [
                {
                  displayName: "My ally, the CLI",
                  iconName: "star_rate",
                  route: "my-ally-cli",
                },
                {
                  displayName: "Become an Angular Tailor",
                  iconName: "star_rate",
                  route: "become-angular-tailer",
                },
              ],
            },
          ],
        },
        {
          displayName: "Sessions",
          iconName: "speaker_notes",
          children: [
            {
              displayName: "Create Enterprise UIs",
              iconName: "star_rate",
              route: "material-design",
            },
            {
              displayName: "What's up with the Web?",
              iconName: "star_rate",
              route: "what-up-web",
            },
            {
              displayName: "My ally, the CLI",
              iconName: "star_rate",
              route: "my-ally-cli",
            },
            {
              displayName: "Become an Angular Tailor",
              iconName: "star_rate",
              route: "become-angular-tailer",
            },
          ],
        },
        {
          displayName: "Feedback",
          iconName: "feedback",
          route: "feedback",
        },
      ],
    },
    {
      displayName: "Orlando",
      iconName: "movie_filter",
      children: [
        {
          displayName: "Speakers",
          iconName: "group",
          children: [
            {
              displayName: "Michael Prentice",
              iconName: "person",
              route: "michael-prentice",
              children: [
                {
                  displayName: "Create Enterprise UIs",
                  iconName: "star_rate",
                  route: "material-design",
                },
              ],
            },
            {
              displayName: "Stephen Fluin",
              iconName: "person",
              route: "stephen-fluin",
              children: [
                {
                  displayName: "What's up with the Web?",
                  iconName: "star_rate",
                  route: "what-up-web",
                },
              ],
            },
            {
              displayName: "Mike Brocchi",
              iconName: "person",
              route: "mike-brocchi",
              children: [
                {
                  displayName: "My ally, the CLI",
                  iconName: "star_rate",
                  route: "my-ally-cli",
                },
                {
                  displayName: "Become an Angular Tailor",
                  iconName: "star_rate",
                  route: "become-angular-tailer",
                },
              ],
            },
          ],
        },
        {
          displayName: "Sessions",
          iconName: "speaker_notes",
          children: [
            {
              displayName: "Create Enterprise UIs",
              iconName: "star_rate",
              route: "material-design",
            },
            {
              displayName: "What's up with the Web?",
              iconName: "star_rate",
              route: "what-up-web",
            },
            {
              displayName: "My ally, the CLI",
              iconName: "star_rate",
              route: "my-ally-cli",
            },
            {
              displayName: "Become an Angular Tailor",
              iconName: "star_rate",
              route: "become-angular-tailer",
            },
          ],
        },
        {
          displayName: "Feedback",
          iconName: "feedback",
          route: "feedback",
        },
      ],
    },
    {
      displayName: "Maleficent",
      disabled: true,
      iconName: "report_problem",
      children: [
        {
          displayName: "Speakers",
          iconName: "group",
          children: [
            {
              displayName: "Michael Prentice",
              iconName: "person",
              route: "michael-prentice",
              children: [
                {
                  displayName: "Create Enterprise UIs",
                  iconName: "star_rate",
                  route: "material-design",
                },
              ],
            },
            {
              displayName: "Stephen Fluin",
              iconName: "person",
              route: "stephen-fluin",
              children: [
                {
                  displayName: "What's up with the Web?",
                  iconName: "star_rate",
                  route: "what-up-web",
                },
              ],
            },
            {
              displayName: "Mike Brocchi",
              iconName: "person",
              route: "mike-brocchi",
              children: [
                {
                  displayName: "My ally, the CLI",
                  iconName: "star_rate",
                  route: "my-ally-cli",
                },
                {
                  displayName: "Become an Angular Tailor",
                  iconName: "star_rate",
                  route: "become-angular-tailer",
                },
              ],
            },
          ],
        },
        {
          displayName: "Sessions",
          iconName: "speaker_notes",
          children: [
            {
              displayName: "Create Enterprise UIs",
              iconName: "star_rate",
              route: "material-design",
            },
            {
              displayName: "What's up with the Web?",
              iconName: "star_rate",
              route: "what-up-web",
            },
            {
              displayName: "My ally, the CLI",
              iconName: "star_rate",
              route: "my-ally-cli",
            },
            {
              displayName: "Become an Angular Tailor",
              iconName: "star_rate",
              route: "become-angular-tailer",
            },
          ],
        },
        {
          displayName: "Feedback",
          iconName: "feedback",
          route: "feedback",
        },
      ],
    },
  ];
  public adminHeaderItems: IMenuItemModelChild[] = [
    {
      text: "Overview",
      path: "/organizations",
      iconCss: "kt-menu__link-icon flaticon2-architecture-and-city",
    },
    {
      text: "Manage Organizations",
      path: "/organization-profile",
      iconCss: "icon-globe icon",
    },
    {
      text: "System Admin Settings",
      path: "/organization-profile",
      iconCss: "icon-globe icon",
      items: [
        { text: "Plan", path: "/plan" },
        { text: "Feature", path: "/feature" },
        { text: "Price", path: "/price" },
      ],
    },
  ];

  public data: Object[] = [
    {
      nodeId: "01",
      nodeText: "DASHBOARD",
      path: "/dashboard",
      icon: "icon-home icon",
      expanded: false,
    },
    {
      nodeId: "02",
      nodeText: "TIME LOG",
      path: "/dashboard-user",
      icon: "icon-clock icon",
      expanded: false,
    },
    {
      nodeId: "011",
      nodeText: "Profile",
      path: "/HR-Employee",
      icon: "fa fa-user",
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
      nodeId: "14",
      nodeText: "WORKFORCE",
      path: "/workforce",
      icon: "icon-workforce icon",
    },

    {
      nodeId: "17",
      nodeText: "PRODUCTIVITY",
      icon: "icon-emp  icon",
      path: "/productivity-emp",
    },
    {
      nodeId: "21",
      nodeText: "NOTIFICATION",
      path: "/emp-notification",
      icon: "icon-bell-view icon",
    },
    {
      nodeId: "04",
      nodeText: "LEAVE",
      path: "/leave-details",
      icon: "icon-function icon",
      expanded: false,
    },
    {
      nodeId: "15",
      nodeText: "CUSTOMER",
      path: "/customer-contact",
      icon: "icon-function icon",
    },

    {
      nodeId: "06",
      nodeText: "LEAD",
      path: "/customer",
      icon: "icon-function icon",
    },
    {
      nodeId: "07",
      nodeText: "ESTIMATION",
      path: "/cost-estimation",
      icon: "icon-cost icon",
      expanded: false,
      //     nodeChild: [
      //       { nodeId: "07-01",
      //       nodeText: 'COST',
      //       path: "/cost-estimate",icon: 'icon-settings icon'
      //   },

      // ]
    },
    {
      nodeId: "13",
      nodeText: "QUOTATION",
      path: "/quotation",
      icon: "icon-function icon",
      expanded: false,
      //     nodeChild: [
      //       { nodeId: "07-01",
      //       nodeText: 'COST',
      //       path: "/cost-estimate",icon: 'icon-settings icon'
      //   },

      // ]
    },
    {
      nodeId: "08",
      nodeText: "PROJECT",
      path: "/projects",
      icon: "icon-function icon",
      expanded: false,
    },
    {
      nodeId: "09",
      nodeText: "TASK",
      path: "/task-form",
      icon: "icon-task icon",
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
      nodeId: "03",
      nodeText: "EMPLOYEE",
      path: "/employee",
      icon: "icon-emp  icon",
    },
    {
      nodeId: "05",
      nodeText: "TEAM",
      path: "/team",
      icon: "icon-team icon",
    },
    {
      nodeId: "20",
      nodeText: "TRAVELS",
      path: "/travels",
      icon: "icon-street-view icon",
    },
    {
      nodeId: "19",
      nodeText: "Travel Claim",
      icon: "icon-street-view icon",
      path: "/travels",
    },
    {
      nodeId: "16",
      nodeText: "USER CONTROLS",
      icon: "icon-emp  icon",
      path: "/user-controls",
    },
    {
      nodeId: "12",
      nodeText: "SETTINGS ",
      icon: "icon-settings icon",
      path: "/settings",
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
  ];
  public EmpDBdata: Object[] = [
    {
      nodeId: "01",
      nodeText: "DASHBOARD",
      path: "/dashboard-user",
      icon: "icon-clock icon",
      expanded: false,
    },

    {
      nodeId: "02",
      nodeText: "TASK",
      path: "/task-form",
      icon: "icon-task icon",
      // nodeChild: [
      //     { nodeId: "02-01",
      //       nodeText: 'MANAGE TASK',
      //      path: '/task-form',iconCss: 'icon-manage-task icon'
      //   },

      // ]
    },
    {
      nodeId: "03",
      nodeText: "LEAVE",
      path: "/leave-details",
      icon: "icon-function icon",
      expanded: false,
    },
  ];
  public superAdminData: Object[] = [
    {
      nodeId: "039",
      nodeText: "Delegate",
      path: "/delegate-User",
      icon: "icon-workforce icon",
      expanded: false,
    },
    {
      nodeId: "01",
      nodeText: "DASHBOARD",
      path: "/dashboard",
      icon: "icon-home icon",
      expanded: false,
      nodeChild: [
        {
          nodeId: "01-01",
          nodeText: "DASHBOARD TEST",
          path: "/dashboard-dashboardtest",
          icon : "icon-home icon"
        }


      ]
    },
    {
      nodeId: "97",
      nodeText: "DEVELOPER DASHBOARD",
      path: "/dev-dashboard",
      icon: "fa fa-pie-chart",
    },
    {
      nodeId: "02",
      nodeText: "TIME LOG",
      path: "/dashboard-user",
      icon: "icon-clock icon",
    },
    {
      nodeId: "011",
      nodeText: "Profile",
      path: "/HR-Employee",
      icon: "fa fa-user",
    },
    {
      nodeId: "03",
      nodeText: "WORKFORCE",
      path: "/workforce",
      icon: "icon-workforce icon",
      expanded: false,
      nodeChild: [
        {
          nodeId: "03-01",
          nodeText: "WorkForce New",
          icon: "icon-workforce icon",
          path: "/workforce-new",
        },
        {
          nodeId: "03-02",
          nodeText: "WorkForce Management",
          icon: "icon-users icon",
          path: "/Workforce-Members",
        },
        {
          nodeId: "03-03",
          nodeText: "PRODUCTIVITY",
          icon: "icon-emp  icon",
          path: "/productivity-emp",
        },
      ],
    },

    {
      nodeId: "04",
      nodeText: "NOTIFICATION",
      path: "/emp-notification",
      icon: "icon-bell-view icon",
    },
    {
      nodeId: "05",
      nodeText: "LEAVE",
      path: "/leave-details",
      icon: "icon-function icon",
      expanded: false,
    },
    {
      nodeId: "32",
      nodeText: "Asset",
      path: "/Asset",
      icon: "fa fa-archive",
      expanded: false,
    },
    {
      nodeId: "16",
      nodeText: "Human Resource",
      icon: "icon-users icon",
      path: "/HR-Employee",
      expanded: false,
      nodeChild: [
        {
          nodeId: "16-01",
          nodeText: "Team Members",
          path: "/settings-new/team-members",
          icon: "icon-emp icon",
        },
        {
          nodeId: "16-03",
          nodeText: "Teams",
          path: "/settings-new/teams",
          icon: "icon-file-text icon",
        },
        {
          nodeId: "16-02",
          nodeText: "Attendence",
          path: "/human-resource",
          icon: "icon-file-text icon",
        },
        {
          nodeId: "16-04",
          nodeText: "Attendence Exception",
          path: "/attexp",
          icon: "icon-file-text icon",
        },
      ],
    },
    {
      nodeId: "99",
      nodeText: "Payment",
      path: "/payment",
      icon: "icon-cost icon",
      expanded: false,
    },
    {
      nodeId: "17",
      nodeText: "Payroll",
      path: "/Payroll",
      icon: "icon-cost icon",
      expanded: false,
      nodeChild: [
        {
          nodeId: "17-01",
          nodeText: "Variable Pay",
          path: "/Payroll/variablepay",
          icon: "icon-emp icon",
        },
        {
          nodeId: "17-02",
          nodeText: "Adjustments",
          path: "/Payroll/adjustments",
          icon: "icon-emp icon",
        },
        {
          nodeId: "17-03",
          nodeText: "Expensess",
          path: "/Payroll/expensess",
          icon: "icon-file-text icon",
        },
        {
          nodeId: "17-04",
          nodeText: "Advance & Loan",
          path: "/Payroll/loanpayments",
          icon: "icon-file-text icon",
        },
      ],
    },

    {
      nodeId: "06",
      nodeText: "CUSTOMER",
      path: "/customer-contact",
      icon: "icon-function icon",
    },
    {
      nodeId: "07",
      nodeText: "LEAD",
      path: "/customer",
      icon: "icon-function icon",
    },
    {
      nodeId: "22",
      nodeText: "Inventory ",
      icon: "icon-home icon",
      path: "/inventory",
    },
    {
      nodeId: "08",
      nodeText: "ESTIMATION",
      path: "/cost-estimation",
      icon: "icon-cost icon",
    },
    {
      nodeId: "09",
      nodeText: "QUOTATION",
      path: "/quotation",
      icon: "icon-function icon",
    },
    {
      nodeId: "10",
      nodeText: "PROJECT",
      path: "/projects",
      icon: "icon-function icon",
    },
    {
      nodeId: "11",
      nodeText: "Travel",
      icon: "icon-street-view icon",
      path: "/travel-claim",
    },
    {
      nodeId: "19",
      nodeText: "Travel Claim",
      icon: "icon-street-view icon",
      path: "/travels",
    },
    {
      nodeId: "12",
      nodeText: "Productivity",
      icon: "icon-cost icon",
      path: "/project-invoice",
    },
    {
      nodeId: "13",
      nodeText: "Finance",
      icon: "icon-cost icon",
      path: "/invoice",
      expanded: false,
      nodeChild: [
        {
          nodeId: "13-01",
          nodeText: "Revenue",
          path: "/invoice",
          icon: "icon-cost icon",
        },
        {
          nodeId: "13-02",
          nodeText: "Receipts",
          path: "/receipts",
          icon: "icon-file-text icon",
        },
        {
          nodeId: "13-03",
          nodeText: "Adjustments",
          path: "/adjustments",
          icon: "icon-file-text icon",
        },
        {
          nodeId: "13-04",
          nodeText: "Other Income",
          path: "/commission",
          icon: "icon-cost icon",
        },
        {
          nodeId: "13-05",
          nodeText: "Vendors",
          path: "/vendors",
          icon: "icon-users icon",
        },
      ],
    },
    {
      nodeId: "14",
      nodeText: "Settings",
      icon: "icon-settings icon",
      path: "/settings-new",
      expanded: false,
      nodeChild: [
        {
          nodeId: "14-01",
          nodeText: "Settings Old",
          path: "/settings",
          icon: "icon-settings icon",
        },
      ],
    },
  ];

  public UserDBdata: Object[] = [
    {
      nodeId: "039",
      nodeText: "Delegate",
      path: "/delegate-User",
      icon: "icon-workforce icon",
    },
    {
      nodeId: "01",
      nodeText: "DASHBOARD",
      path: "/dashboard",
      icon: "icon-home icon",
      expanded: false,
      nodeChild: [
        {
          nodeId: "01-01",
          nodeText: "DASHBOARD TEST",
          path: "/dashboard-dashboardtest",
          icon : "icon-home icon"
        }
      ]
    },
    {
      nodeId: "02",
      nodeText: "TIME LOG",
      path: "/dashboard-user",
      icon: "icon-clock icon",
    },
    {
      nodeId: "04",
      nodeText: "NOTIFICATION",
      path: "/emp-notification",
      icon: "icon-bell-view icon",
    },
    {
      nodeId: "011",
      nodeText: "Profile",
      path: "/HR-Employee",
      icon: "fa fa-user",
    },
    {
      nodeId: "05",
      nodeText: "LEAVE",
      path: "/leave-details",
      icon: "icon-function icon",
      expanded: false,
    },
    {
      nodeId: "32",
      nodeText: "Asset",
      path: "/Asset",
      icon: "icon-function icon",
      expanded: false,
    },

    {
      nodeId: "16",
      nodeText: "Human Resource",
      icon: "icon-users icon",
      path: "/HR-Employee",
      expanded: false,
      nodeChild: [
        {
          nodeId: "16-01",
          nodeText: "Team Members",
          path: "/settings-new/team-members",
          icon: "icon-emp icon",
        },
        {
          nodeId: "16-03",
          nodeText: "Teams",
          path: "/settings-new/teams",
          icon: "icon-file-text icon",
        },
        {
          nodeId: "16-02",
          nodeText: "Attendence",
          path: "/human-resource",
          icon: "icon-file-text icon",
        },
        {
          nodeId: "16-04",
          nodeText: "Attendence Exception",
          path: "/attexp",
          icon: "icon-file-text icon",
        },
      ],
    },
    {
      nodeId: "99",
      nodeText: "Payment",
      path: "/payment",
      icon: "icon-cost icon",
      expanded: false,
    },
    {
      nodeId: "17",
      nodeText: "Payroll",
      path: "/Payroll",
      icon: "icon-cost icon",
      expanded: false,
      nodeChild: [
        {
          nodeId: "17-01",
          nodeText: "Variable Pay",
          path: "/Payroll/variablepay",
          icon: "icon-emp icon",
        },
        {
          nodeId: "17-02",
          nodeText: "Adjustments",
          path: "/Payroll/adjustments",
          icon: "icon-emp icon",
        },
        {
          nodeId: "17-03",
          nodeText: "Expensess",
          path: "/Payroll/expensess",
          icon: "icon-file-text icon",
        },
        {
          nodeId: "17-04",
          nodeText: "Advance & Loan",
          path: "/Payroll/loanpayments",
          icon: "icon-file-text icon",
        },
      ],
    },
    {
      nodeId: "06",
      nodeText: "CUSTOMER",
      path: "/customer-contact",
      icon: "icon-function icon",
    },

    {
      nodeId: "06",
      nodeText: "CUSTOMER",
      path: "/customer-contact",
      icon: "icon-function icon",
    },
    {
      nodeId: "07",
      nodeText: "LEAD",
      path: "/customer",
      icon: "icon-function icon",
    },
    {
      nodeId: "22",
      nodeText: "Inventory ",
      icon: "icon-home icon",
      path: "/inventory",
    },
    {
      nodeId: "08",
      nodeText: "ESTIMATION",
      path: "/cost-estimation",
      icon: "icon-cost icon",
    },
    {
      nodeId: "09",
      nodeText: "QUOTATION",
      path: "/quotation",
      icon: "icon-function icon",
    },
    {
      nodeId: "10",
      nodeText: "PROJECT",
      path: "/projects",
      icon: "icon-function icon",
    },
    {
      nodeId: "11",
      nodeText: "Travel",
      icon: "icon-street-view icon",
      path: "/travel-claim",
    },
    {
      nodeId: "19",
      nodeText: "Travel Claim",
      icon: "icon-street-view icon",
      path: "/travels",
    },
    {
      nodeId: "12",
      nodeText: "Productivity",
      icon: "icon-cost icon",
      path: "/project-invoice",
    },
    {
      nodeId: "13",
      nodeText: "Finance",
      icon: "icon-cost icon",
      path: "/invoice",
      expanded: false,
      nodeChild: [
        {
          nodeId: "13-01",
          nodeText: "Revenue",
          path: "/invoice",
          icon: "icon-cost icon",
        },
        {
          nodeId: "13-02",
          nodeText: "Receipts",
          path: "/receipts",
          icon: "icon-file-text icon",
        },
        {
          nodeId: "13-03",
          nodeText: "Adjustments",
          path: "/adjustments",
          icon: "icon-file-text icon",
        },
        {
          nodeId: "13-04",
          nodeText: "Other Income",
          path: "/commission",
          icon: "icon-cost icon",
        },
        {
          nodeId: "13-05",
          nodeText: "Vendors",
          path: "/vendors",
          icon: "icon-users icon",
        },
      ],
    },
    {
      nodeId: "14",
      nodeText: "Settings",
      icon: "icon-settings icon",
      path: "/settings-new",
      expanded: false,
      nodeChild: [
        {
          nodeId: "14-01",
          nodeText: "Settings Old",
          path: "/settings",
          icon: "icon-settings icon",
        },
      ],
    },
  ];

  public hierarchicalData: Object[] = [
    {
      nodeId: "00",
      nodeText: "About",
      url: "about",
    },
    {
      nodeId: "01",
      nodeText: "Angular",
      url: "angular",
      nodeChild: [
        {
          nodeId: "01-01",
          nodeText: "Javascript",
          url: "javascript",
        },
      ],
    },
    {
      nodeId: "02",
      nodeText: "Products",
      expanded: true,
      url: "products",
      nodeChild: [
        {
          nodeId: "02-01",
          nodeText: "Services",
          url: "services",
        },
      ],
    },
  ];
  // Mapping TreeView fields property with data source properties
  // public field:Object;
  selectedNode: any;
  public hide() {
    this.sidebarTreeviewInstance.hide();
  }
  public fetchByOrgId() {
    let org_id = localStorage.getItem("org_id");

    this.orgService.FindByOrgId(org_id).subscribe(
      (data: any) => {
        this.org_name = data["org_name"];
      },
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  public toProfile() {
    // this.router.navigate(["/user-profile"]);
    let emp_id = this.user_info["id"];
    this.router.navigate(["/HR-Employee"], {
      queryParams: { key: this.xorEncryptDecrypt(emp_id, this.key) },
    });
  }

  public field: Object;
  public onSelect(event: MenuEventArgs) {
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
  xorEncryptDecrypt(input: string, key: string): string {
    let output = "";
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
    }
    return output;
  }
  key = "secret";
  checkUserAccess() {
    let delegateAccess = JSON.parse(localStorage.getItem("delegateDetails"));
    console.log(delegateAccess);
    if (delegateAccess &&delegateAccess.length > 0) {
     return true
    } else {
      return false
    }
  }

  public navigateanotherPage($event: NodeSelectEventArgs) {
    let data: any = this.tree.getTreeData($event.node);
    console.log(data, "CLICKED DATA");
    if(data[0].nodeText == "Delegate"){
      let checkAccess=this.checkUserAccess()
      if(!checkAccess){
        this.toast.error('You do not have permission to access this page');
        return
      }
    }
    this.headerTags = data[0].nodeText ? data[0].nodeText : "";
    localStorage.setItem("currentNodeTxt", this.headerTags);
    if (data[0].path) {
      let routerLink: string = data[0].path;
      console.log(routerLink);
      if (data[0].nodeText == "Profile") {
        console.log("Profile");
        let emp_id = this.user_info["id"];
        this.router.navigate(["/HR-Employee"], {
          queryParams: { key: this.xorEncryptDecrypt(emp_id, this.key) },
        });
      } else {
        this.router.navigate([routerLink]);
      }

      // window.location.href = <string>data[0].navigateUrl;
      this.selectedNode = $event.nodeData.id;

      $event.nodeData.selected = false;
      $event.isInteracted = false;
      $event.node.classList.remove("e-active");
    }

    // let data12= this.tree.getTreeData($event.node)
    // if(data12[0].path){
    //   let routerLink = data12[0].path;
    //   this.router.navigate([routerLink]);
    // }
  }
  public menuItems: any[] = [
    {
      text: "Notification",
      iconCss: "icon-bell-alt icon",
      items: [{ text: "sdf", path: "/organizations" }],
    },
  ];

  public AccountMenuItem: MenuItemModel[] = [
    {
      text: "Account",
      items: [{ text: "Profile" }, { text: "Sign out" }],
    },
  ];
  public notificationData: any = [];

  public payload = "payload1";
  constructor(
    private translate: TranslateService,
    private notifyService: NotificationService,
    public router: Router,
    public service: LoginService,
    public orgService: OrganizationService,
    private route: ActivatedRoute,
    private EmpService: EmployeeService,
    public AdminSettingService: AdminSettingService,
    private userService: UserService,
    private toast:ToastrService

  ) {
    // this.field = { dataSource: this.hierarchicalData, id: 'nodeId', text: 'nodeText', child: 'nodeChild', expanded: 'expanded', selected: 'selected' };
    // sourceFiles.files = ['sidebar-menu.css'];

    this.router.events.subscribe((val) => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });

    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl("https://timeapi.enforcesolutions.com/notify")
      .build();

    connection
      .start()
      .then(function () {
        console.log("Connected!");
      })
      .catch(function (err) {
        return console.error(err.toString());
      });

    connection.on("BroadcastMessage", (data: string) => {
      //console.log('BroadcastMessage!',data);
      this.notificationData = data;
    });
    //console.log('notificationData!',this.notificationData);
  }
  openNotifyModal(id, notify_name, notify_desc, notify_type) {
    this.notify_type = notify_type;
    this.notify_name = notify_name;
    this.notify_desc = notify_desc;
    this.UpdateNotifyIsViewedByEmpID(id);
    this.GetAllViewedNotifyByEmpID();
    $("#notify_log_modal").modal("show");
  }
  GetAllViewedNotifyByEmpID() {
    this.notifyService.GetAllViewedNotifyByEmpID().subscribe(
      (data: any) => {},
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }
  UpdateNotifyIsViewedByEmpID(id) {
    let user_info = localStorage.getItem("user_info");
    let postData = {
      notify_id: id,
      emp_id: this.user_info["id"],
      is_view: true,
    };

    this.EmpService.UpdateNotifyIsViewedByEmpID(postData).subscribe(
      (data: any) => {},
      (error) => {
        Swal.fire("Error!", error, "error").then(
          //used Arrow function here
          (result) => {
            //  this.router.navigate(['/dashboard']);
          }
        );
      }
    );
  }

  OnNotifyClose() {
    $("#notify_log_modal").modal("hide");
  }
  openClick() {
    this.showCloseBtn = !this.showCloseBtn;
    this.sidebarTreeviewInstance.toggle();
  }
  closeClick() {
    this.showCloseBtn = false;
    this.sidebarTreeviewInstance.hide();
  }
  public loadRoutingContent(args: NodeSelectEventArgs): void {
    let data: any = this.tree.getTreeData(args.node);
    let routerLink: string = data[0].url;
    this.router.navigate([routerLink]);
  }

  ngOnInit(): void {
    this.getAllNotificationForOrg();
    this.AdminSettingService.subsVar =
      this.AdminSettingService.communicateWithHeaderCompFunction.subscribe(
        (notValue: string) => {
          console.log(notValue);
          if (notValue === "run-Notification") {
            this.getAllNotificationForOrg();
          }
        }
      );

    this.headerTags = localStorage.getItem("currentNodeTxt");
    if (window.screen.width <= 600) {
      // 768px portrait
      this.showCloseBtn = false;
    }
    let planType = localStorage.getItem("planType");
    if (planType != null) {
      this.planType = true;
    } else {
      this.planType = false;
    }
    if (localStorage.getItem("planName")) {
      this.planName = localStorage.getItem("planName");
    }
    if (localStorage.getItem("user_info")) {
      this.user_info = JSON.parse(localStorage.getItem("user_info"));

      this.user_name = this.user_info["full_name"];
      if (this.user_info["is_superadmin"] == true) {
        this.admin_dashboard = true;
        this.superAdmin_dashboard = true;
        this.emp_dashboard = false;
        this.field = {
          dataSource: this.superAdminData,
          id: "nodeId",
          text: "nodeText",
          child: "nodeChild",
          expanded: "expanded",
        };
      }
      if (
        this.user_info["is_admin"] == true &&
        this.user_info["is_superadmin"] == false
      ) {
        this.admin_dashboard = true;
        this.superAdmin_dashboard = false;
        this.emp_dashboard = true;
        this.field = {
          dataSource: this.superAdminData,
          id: "nodeId",
          text: "nodeText",
          child: "nodeChild",
          expanded: "expanded",
          selected: "selected",
        };
      }
      if (
        this.user_info["is_admin"] == false &&
        this.user_info["is_superadmin"] == false
      ) {
        this.admin_dashboard = true;
        this.superAdmin_dashboard = false;
        this.emp_dashboard = true;
        // this.field ={ dataSource: this.EmpDBdata, id: 'nodeId', text: 'nodeText', child: 'nodeChild', expanded: 'expanded', selected: 'selected' };
        this.field = {
          dataSource: this.UserDBdata,
          id: "nodeId",
          text: "nodeText",
          child: "nodeChild",
          expanded: "expanded",
          selected: "selected",
        };
      }
    }

    this.fetchByOrgId();
    if (localStorage.getItem("user_info")) {
      this.user_info = JSON.parse(localStorage.getItem("user_info"));
      this.full_name = this.user_info["first_name"];
    }

    setInterval(() => {
      // this.time=moment().format('MM/DD/YYYY hh:mm:ss A');
      this.time = moment().format("hh:mm a");
      //
      // return (moment().format('hh:mm a'));
      localStorage.setItem("currentTime", this.time);
      if (this.service.getVisible() == true) {
        //
      }
    }, 2000);

    var api =
      "https://cors-anywhere.herokuapp.com/https://fcc-weather-api.glitch.me/api/current?";
    var lat, lon;
    var tempUnit = "C";
    var currentTempInCelsius;

    $(document).ready(function () {
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
          var fahTemp = Math.round((parseInt($("#temp").text()) * 9) / 5 + 32);
          $("#temp").text(fahTemp + " " + String.fromCharCode(176));
        } else {
          $("#temp").text(
            currentTempInCelsius + " " + String.fromCharCode(176)
          );
        }
      });
    });

    function getWeather(lat, lon) {
      var urlString = api + lat + "&" + lon;
      $.ajax({
        url: urlString,
        success: function (result) {
          $("#city").text(result.name + ", ");
          $("#country").text(result.sys.country);

          currentTempInCelsius = Math.round(result.main.temp * 10) / 10;
          $("#temp").text(
            currentTempInCelsius + " " + String.fromCharCode(176)
          );
          $("#tempunit").text(tempUnit);
          $("#desc").text(result.weather[0].main);
          IconGen(result.weather[0].main);
        },
      });
    }

    function IconGen(desc) {
      var desc = desc.toLowerCase();
      switch (desc) {
        case "drizzle":
          addIcon(desc);
          break;
        case "clouds":
          addIcon(desc);
          break;
        case "rain":
          addIcon(desc);
          break;
        case "snow":
          addIcon(desc);
          break;
        case "clear":
          addIcon(desc);
          break;
        case "thunderstom":
          addIcon(desc);
          break;
        default:
          $("div.clouds").removeClass("hide");
      }
    }

    function addIcon(desc) {
      $("div." + desc).removeClass("hide");
    }

    this.pushRightClass = "push-right";
    $.getScript("assets/plugins/global/plugins.bundle.js");
    $.getScript("assets/js/scripts.bundle.js");
    $.getScript("assets/js/pages/dashboard.js");
  }

  getAllNotificationForOrg() {
    let userInfo = JSON.parse(localStorage.getItem("user_info"));
    let postData = {
      orgID: localStorage.getItem("org_id"),
      empID: userInfo.id,
    };
    this.AdminSettingService.GetLeaveRelatedNotificationsByOrgIDandEmpID(
      postData
    ).subscribe((data: any) => {
      this.newNotificationData = [];
      data.map((elm) => {
        if (elm.read_status === false) {
          this.newNotificationData.push(elm);
        }
      });
    });
  }

  notificationPageRoute() {
    this.router.navigate(["emp-notification"]);
  }

  // ngAfterViewInit() {
  //    this.notifyService.connect();
  //   this.locationSubscription = this.notifyService.
  //       locationCordinates.subscribe(loc => {
  //         console.log('locationCordinates',loc)
  //         // this.latitude = loc.latitude;
  //         // this.longitude = loc.longitude;
  //       });
  //        console.log('locationSubscription',this.notifyService.connect());
  // }
  isToggled(): boolean {
    const dom: Element = document.querySelector("body");
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector("body");
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector("body");
    dom.classList.toggle("rtl");
  }

  public onLoggedout() {
    localStorage.removeItem("user_info");
    localStorage.removeItem("user_id");
    localStorage.removeItem("timeLeft");
    localStorage.removeItem("ProjectName");
    localStorage.clear();
    sessionStorage.clear();
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
  path?: string; //This is for your path
  query?: string; //This is for your optional query param, add more query properties if you need them
  items?: IMenuItemModelChild[]; //We over write the exiting items property of the parent
}
