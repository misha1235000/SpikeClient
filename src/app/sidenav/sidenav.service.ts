// sidenav.service

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { PublicFunctions } from '../shared/shared';

@Injectable()
export class SidenavService {
  private serverUrl = 'http://localhost:3000/api/team';

  /**
   * Injection of the http service.
   * @param http
   */
  constructor(private http: Http) {}

   getUsername(): Observable<any> {
    const headers = new Headers();

    // TODO: Think about a way to get all the data needed in the login itself.
    headers.append('authorization', PublicFunctions.getCookie('token'));
    return this.http.get(this.serverUrl, {headers: headers})
           .map((data) => {
             return data.json();
           }).catch((error) => {
        //    document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        //    window.location.href = '/login';
              return Observable.throw(error);
           });
  }
}
