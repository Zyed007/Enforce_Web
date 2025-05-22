import { Injectable } from '@angular/core';
import {ClientService} from './clientUtilService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable(
{ providedIn: 'root'}
)
export class CountryService {
  public visible=false;

  constructor(private http: HttpClient, private clientService: ClientService) {

   }
    // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':'*/*',
      'Access-Control-Allow-Origin':'*',


    })
  }


  getCountryList()  {
    let countryListUrl=this.clientService.getCountryList();
    return this.http.get(countryListUrl,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  getTZList()  {
    let countryListUrl=this.clientService.getTZList();
    return this.http.get(countryListUrl,this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
 getAllPhoneCode(){
  let countryListUrl=this.clientService.getAllPhoneCode();
  return this.http.get(countryListUrl,this.httpOptions)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )

 }

   // Error handling
   handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Internal Server Error`;
    }
    return throwError(errorMessage);
 }
}
