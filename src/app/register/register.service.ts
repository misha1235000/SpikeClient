// verify.service

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { PublicFunctions } from '../shared/shared';

@Injectable()
export class RegisterService {
  private serverUrl = 'http://localhost:3000/api/auth';

  /**
   * Injection of the http service.
   * @param http
   */
  constructor(private http: Http) {}

  login(email, password): Observable<any> {
     return this.http.post(this.serverUrl + '/login', {'email': email, 'password': password})
            .map((data) => {
                return data.json();
              });
  }

  isExist(appName): Observable<any> {
    return this.http.get(this.serverUrl + '/logout')
           .map((data) => {
              return data.json();
           });
  }
}
