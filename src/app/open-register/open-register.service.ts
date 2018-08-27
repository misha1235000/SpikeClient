// open-register.service

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { PublicFunctions } from '../shared/shared';

@Injectable()
export class OpenRegisterService {
  private serverUrl = 'http://localhost:3000/api/auth';

  /**
   * Injection of the http service.
   * @param http
   */
  constructor(private http: Http){}

  login(email, password): Observable<any> {
     return this.http.post(this.serverUrl + '/login', {'email': email, 'password': password})
            .map((data) => {
                return data.json();
              });
  }

  logout(): Observable<any> {
    return this.http.get(this.serverUrl + '/logout')
           .map((data) => {
              return data.json();
           });
  }

  getEmail(): Observable<any> {
    const headers = new Headers();

    headers.append('authorization', PublicFunctions.getCookie('token'));

    return this.http.get(this.serverUrl, {headers: headers})
           .map((data) => {
             return data.json();
           }).catch((error) => {
              location.reload();
              return Observable.throw(error);
           });
  }
}
