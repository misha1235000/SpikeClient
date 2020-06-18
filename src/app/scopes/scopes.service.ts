import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../shared/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScopesService {
  private scopesUrl = `${config.SERVER_HOST}:${config.SERVER_PORT}/api/scopes`;

  /**
   * Injection of the http service.
   * @param http - The http service.
   */
  constructor(private http: HttpClient) { }

  updateScope(scope): Observable<any> {
    return this.http.get('/');
  }

  addScope(): Observable<any> {
    return this.http.get('/');
  }

  removeScope(): Observable<any> {
    return this.http.get('/');
  }
}
