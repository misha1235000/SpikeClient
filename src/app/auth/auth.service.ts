// auth.service

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { PublicFunctions } from '../shared/shared';

@Injectable()
export class AuthService {
  private authUrl = 'http://localhost:3000/api/auth';
  private teamUrl = 'http://localhost:3000/api/team';
  private clientUrl = 'http://localhost:3000/api/client';

  /**
   * Injection of the http service.
   * @param http - The http service.
   */
  constructor(private http: Http) {}

  /**
   * Gets a username by the token which is saved on the cookie.
   */
  getTeamName(): Observable<any> {
    const headers = new Headers();

    headers.append('authorization', PublicFunctions.getCookie('token'));

    return this.http.get(this.teamUrl, {headers})
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
   * Register a new team account.
   * @param team - The team object to register.
   */
  registerTeam(team): Observable<any> {
    return this.http.post(this.authUrl + '/register', {'team': team})
            .map((data) => {
                return data.json();
            }).catch((error) => {
                return Observable.throw(error.json());
            });
  }

   /**
   * Register a new client to the team account.
   * @param client - The client object to register.
   */
  registerClient(client): Observable<any> {
    return this.http.post(this.clientUrl, {'clientInformation': client})
            .map((data) => {
                return data.json();
            }).catch((error) => {
                return Observable.throw(error.json());
            });
  }

  /**
   * Login with http service.
   * @param team - The team object with login details.
   */
  login(team): Observable<any> {
    return this.http.post(this.authUrl + '/login', {'team': team})
           .map((data) => {
               return data.json();
             }).catch((error) => {
               return Observable.throw(error.json());
             });
 }
}
