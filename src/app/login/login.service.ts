// login.service

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginService {
  private serverUrl = 'http://localhost:3000/api/auth';

  /**
   * Injection of the http service.
   * @param http
   */
  constructor(private http: Http) {}

  login(team): Observable<any> {
     return this.http.post(this.serverUrl + '/login', {'team': team})
            .map((data) => {
                return data.json();
              }).catch((error) => {
                return Observable.throw(error.json());
              });
  }

  logout(): Observable<any> {
    return this.http.get(this.serverUrl + '/logout')
           .map((data) => {
              return data.json();
           });
  }
}
