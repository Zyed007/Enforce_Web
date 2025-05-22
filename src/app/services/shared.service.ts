import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root' // Makes it available application-wide
})
export class SharedService {
  // Create a Subject to emit events
  private buttonClickSource = new Subject<{source: string, data: any}>();
  
  // Expose as Observable to prevent external emissions
  buttonClicked$ = this.buttonClickSource.asObservable();

  // Method to emit the event
  emitButtonClick(data: any) {
    this.buttonClickSource.next(data);
  }
}