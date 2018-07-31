// verify.service

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


function getCookie(name) {
  let ca: Array<string> = document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = `${name}=`;
        let c: string;

        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return '';
}

@Injectable()
export class LoginService {
  private serverUrl = "http://localhost:3000/api/auth";

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
    let headers = new Headers();

    headers.append('authorization', getCookie('token'));
    return this.http.get(this.serverUrl, {headers: headers})
           .map((data) => {
             return data.json();
           }).catch((error) => {
              location.reload();
              return Observable.throw(error);
           });
  }

  /*
  verifyCode(code, reqId, appointment, user): Observable<any> {
    return this.http.post(this.serverUrl + '/verify', {'code': code, 'request_id': reqId, 'appointment': appointment, 'user': user})
           .map((res: Response) => {
              return res.json();
           }).catch((error) => {
              return error.json().error;
           });
  }*/

}
