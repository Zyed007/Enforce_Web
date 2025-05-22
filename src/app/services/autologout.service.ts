import { Injectable } from "@angular/core";
import { Router } from '@angular/router'
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
const MINUTES_UNITL_AUTO_LOGOUT = 20 // in mins
const CHECK_INTERVAL = 5000 // in ms
const STORE_KEY =  'lastAction';
@Injectable(
 {
  providedIn: 'root'
}
)
export class AutoLogoutService {
  val: any;
 public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }
 public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());

  }

  constructor(private router: Router,private spinner:NgxSpinnerService,private modalService:NgbModal) {
    this.check();
    this.initListener();
    this.initInterval();
    localStorage.setItem(STORE_KEY,Date.now().toString());
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover',()=> this.reset());
    document.body.addEventListener('mouseout',() => this.reset());
    document.body.addEventListener('keydown',() => this.reset());
    document.body.addEventListener('keyup',() => this.reset());
    document.body.addEventListener('keypress',() => this.reset());
     window.addEventListener("storage",() => this.storageEvt());

  }

  reset() {

    this.setLastAction(Date.now());

  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    if (isTimeout)  {
      this.modalService.dismissAll()
      this.router.navigate(['/signin']);
      $(".modal-backdrop").hide();
      $(".modal-backdrop").remove();
      this.spinner.hide();
      sessionStorage.clear();
     localStorage.clear();
    //  window.location.reload();
      //this.router.navigate(['/signin']);
    }
  }
  storageEvt(){
  this.val = localStorage.getItem(STORE_KEY);
}
}

