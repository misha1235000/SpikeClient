// teams.service

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PublicFunctions } from '../shared/shared';
import { config } from '../shared/config';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TeamsService {
  private teamUrl = `${config.SERVER_HOST}:${config.SERVER_PORT}/api/team`;

  /**
   * Injection of the http service.
   * @param http - The http service.
   */
  constructor(private http: HttpClient) { }

  /**
   * Updates a team
   * @param team - The team that will be updated.
   */
  updateTeam(team): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({
            authorization: PublicFunctions.getCookie('authorization')
        })
    };

    return this.http.put(`${this.teamUrl}`, {
      teamname: team.teamname,
      userIds: team.userIds,
      adminIds: team.adminIds,
      _id: team._id,
      desc: team.desc,
      ownerId: team.ownerId
    }, httpOptions).pipe(
        catchError(PublicFunctions.handleError)
    );
  }
}
