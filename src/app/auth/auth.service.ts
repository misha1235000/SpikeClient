// auth.service

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PublicFunctions } from '../shared/shared';
import { config } from '../shared/config';

@Injectable()
export class AuthService {
  private authUrl = `${config.SERVER_HOST}:${config.SERVER_PORT}/api/auth`;
  private teamUrl = `${config.SERVER_HOST}:${config.SERVER_PORT}/api/team`;
  private clientUrl = `${config.SERVER_HOST}:${config.SERVER_PORT}/api/client`;

  /**
   * Injection of the http service.
   * @param http - The http service.
   */
  constructor(private http: HttpClient) {}

  /**
   * Gets a username by the token which is saved on the cookie.
   */
  getUser(): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({
            authorization: PublicFunctions.getCookie('authorization')
        })
    };

    return this.http.get('https://localhost/whoami').pipe(
        catchError(PublicFunctions.handleError)
    );
  }

  /**
   * Gets teams by specific email.
   * @param email - The key that the team is searched with/
   */
  getTeams(personId): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({
            authorization: PublicFunctions.getCookie('authorization')
        })
    };

    return this.http.get(`${this.teamUrl}/${personId}`, httpOptions).pipe(
        catchError(PublicFunctions.handleError)
    );
  }

  /**
   * Register a new team account.
   * @param team - The team object to register.
   */
  registerTeam(team): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({
            authorization: PublicFunctions.getCookie('authorization')
        })
    };

    return this.http.post(`${this.authUrl}/register`, { team }, httpOptions).pipe(
        catchError(PublicFunctions.handleError)
    );
  }

  /**
   * Register a new client to the team account.
   * @param client - The client object to register.
   */
  registerClient(client): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({
            authorization: PublicFunctions.getCookie('authorization')
        })
    };

    return this.http.post(this.clientUrl, {clientInformation: client}, httpOptions).pipe(
        catchError(PublicFunctions.handleError)
    );
  }

  /**
   * Login with http service.
   * @param team - The team object with login details.
   */
  login(team): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({
            authorization: PublicFunctions.getCookie('authorization')
        })
    };

    return this.http.post(this.authUrl + '/login', { team }, httpOptions).pipe(
        catchError(PublicFunctions.handleError)
    );
 }
}
