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
import Swal from 'sweetalert2';
import { SubscriptionService } from '../../services/subscription.service';
import { ToastrService } from 'ngx-toastr';
// import {AdminHeaderModule} from './adminHeader.module';

@Component({
    selector: 'admin-header',
    templateUrl: './adminHeader.component.html',
    styleUrls: ['./adminHeader.component.scss'],
    providers: [LoginService],
    encapsulation: ViewEncapsulation.None


})
export class AdminHeaderComponent implements OnInit {
    public pushRightClass: string;
    public time;
    public superAdmin=true;
    public visible=false;
    public visibility;
    public user_info:object;
  public full_name:string;
  public enableGestures: boolean = false;
  host: {
    '(document:storage)': 'onStorageChange($event)'
  }

  //  @ViewChild('sidebarTreeviewInstance ',{static:false}) public sidebarMenuInstance: SidebarComponent;

   @ViewChild('sidebarTreeviewInstance',{static:false})
   public sidebarTreeviewInstance: SidebarComponent;
 @ViewChild('tree',{static:true})  tree: TreeViewComponent;
  public menu: MenuComponent;
  planType: string='';

public NodeSelect(args){
  // To get the actual tree data
  var actualData = this.tree.getTreeData(args.nodeData.id)[0];

}
  public width: string = '236px';
  public mediaQuery: string = ('(min-width: 600px)');
  public target: string = '.main-content';
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
    iconCss: 'icon-globe icon'

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

  public data: Object[] = [
    {
      nodeId: '01',
      nodeText: 'Overview',
      path: "/organizations",
      iconCss: 'icon-overview icon',"expanded": false,
    },
    {
      nodeId: '02',
      nodeText: 'New Organization',
       path: "/organization-profile",
       iconCss: 'icon-agenda icon'
    },
    {
      nodeId: '03',
      nodeText: 'System Admin Settings',
      iconCss: 'icon-settings icon',
      nodeChild: [
        {
          nodeId: "03-01",
          nodeText: 'Delegate Users',
          path: '/delegate-User',iconCss: 'icon-task icon'
        },
        {
          nodeId: "03-02",
          nodeText: 'Plan',
          path: '/plan',iconCss: 'icon-task icon'
        },
        {
          nodeId: "03-03",
          nodeText: 'Feature',
          path: '/feature',iconCss: 'icon-function icon'
        },
        {
          nodeId: "03-04",
          nodeText: 'Price',
          path: '/price' ,iconCss: 'icon-cost icon'
        },
      ]
    },
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
      let userInfo = JSON.parse(localStorage.getItem('user_info'));
      console.log(userInfo,"****")
      if(!userInfo.is_superadmin){
        this.toastr.error("You don't have permission to access this page");
        return
      }
      let data12= this.tree.getTreeData($event.node)
      if(data12[0].path){
        let routerLink = data12[0].path;
        this.router.navigate([routerLink]);
      }
    if(data12[0].nodeId=='02'){
      sessionStorage.clear();
    }


      this.tree.getNode("1");

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
    constructor(private translate: TranslateService,public profileService:OrganizationService, public router: Router,public service:LoginService,private subscribeService:SubscriptionService,private toastr: ToastrService,
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
 public findByPlanId(){

  let postData={
    id:localStorage.getItem('plan_id')
  }
  this.subscribeService.FindByPlanID(postData).subscribe(
    (data:any)  => {

     if(data){
      this.planType=data.plan_name

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
onStorageChange(ev:KeyboardEvent) {
  // do something meaningful with it

}
private _listener = () => {
  // your logic here
  if(localStorage.getItem('plan_id')!='null'){

    setTimeout(() => {
      this.findByPlanId();



    }, 1000);
  }

}
    ngOnInit():void {
    //   $.getScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js');
    // $.getScript('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js');
    // this.tree.fields = this.field;
  //   if (window.addEventListener) {
  //     window.addEventListener("storage", this._listener, false);
  // }
      if(localStorage.getItem('user_info')){
        this.user_info= JSON.parse(localStorage.getItem('user_info'));
        this.full_name=this.user_info['first_name'];

       ;


    }
    this.planType='';
    // if(localStorage.getItem('plan_id')!='null'){
    //   //
    //   setTimeout(() => {
    //     this.findByPlanId();



    //   }, 1000);
    // }
    if( this.profileService.getOrgID()){


      this.selectedNode =2;
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
         // getWeather(lat, lon);

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
$.getScript("assets/plugins/global/plugins.bundle.js")
$.getScript("assets/js/scripts.bundle.js")
$.getScript('assets/js/pages/dashboard.js')

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





