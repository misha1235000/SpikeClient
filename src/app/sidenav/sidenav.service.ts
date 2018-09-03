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

    headers.append('authorization', PublicFunctions.getCookie('token'));

    return this.http.get(this.serverUrl, {headers})
           .map((data) => {
             return data.json();
           }).catch((error) => {
             if (error.status === 401) {
                PublicFunctions.logout();
             }

             return Observable.throw(error.json());
           });
  }
}
