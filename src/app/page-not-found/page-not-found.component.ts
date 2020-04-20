// page-not-found.component

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicFunctions } from '../shared/shared';
import { SharedService } from '../shared.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  user;
  teams;
  public get getTeam() { return this.teams; }
  public set setTeam(newValue) {
    this.teams = newValue;
  }

  constructor(private router: Router,
              private sharedService: SharedService,
              private authService: AuthService) { }

  async ngOnInit() {
    this.sharedService.onDataChange((data) => {
      this.teams = data;
    });

    if (PublicFunctions.getCookie('authorization') !== '') {
      this.user = PublicFunctions.DecodeJwt();
    } else {
      PublicFunctions.checkLogin();
    }

    if (!this.teams && this.user) {
      const data = await this.authService.getTeams(this.user.genesisId).toPromise();
      if (data && data.teams && data.teams.length > 0) {
        this.sharedService.setData = data.teams;
        this.teams = data.teams;
      } else {
        this.router.navigateByUrl('/register');
      }
    }
  }

}
