// tokens.service

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { PublicFunctions } from '../shared/shared';

@Injectable()
export class TokensService {
  private clientUrl = 'http://localhost:3000/api/client';

  /**
   * Injection of the http service.
   * @param http - The http service.
   */
  constructor(private http: Http) {}

  /**
   * Gets clients by the token which is saved on the cookie.
   */
  getTokens(): Observable<any> {
    const headers = new Headers();

    headers.append('authorization', PublicFunctions.getCookie('token'));

    return this.http.get(this.clientUrl, {headers})
           .map((data) => {
             return data.json();
           }).catch((error) => { // If there is any error.
             if (error.status === 401) { // If the error's status is 401 (Unauthorized), then logout.
                PublicFunctions.logout();
             }

             return Observable.throw(error.json());
           });
  }

  /**
   * Gets a specific client data by the token and the client ID.
   */
  getClientData(clientId: string): Observable<any> {
    const headers = new Headers();

    headers.append('authorization', PublicFunctions.getCookie('token'));

    return this.http.get(this.clientUrl + '/' + clientId, {headers})
           .map((data) => {
             return data.json();
           }).catch((error) => { // If there is any error.
             if (error.status === 401) { // If the error's status is 401 (Unauthorized), then logout.
                PublicFunctions.logout();
             }

             return Observable.throw(error.json());
           });
  }
}
