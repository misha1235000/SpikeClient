// sidenav.component

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { PublicFunctions } from '../shared/shared';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnChanges {
  @Input() sidenavToggle;
  sidenav;
  isLogged = false;
  team = '' as any;
  title = 'app';
  options: FormGroup;

  /**
   * Inits the needed services.
   * @param fb - the form builder service
   * @param authService - The auth service.
   */
  constructor(fb: FormBuilder, private authService: AuthService) {
    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 64
    });
  }

  /**
   * Logout from the current team account.
   */
  logout() {
    PublicFunctions.logout();
  }

  /**
   * Gets the username of the current team account.
   */
  getTeamName() {
    this.authService.getTeamName().subscribe((data) => {
      this.team = data.team;
      this.team.teamname = this.team.teamname[0].toUpperCase() + this.team.teamname.substr(1);
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * When the component initializes, check if the user logged in,
   * if the user is logged in, then get the username.
   */
  ngOnInit() {
    this.isLogged = PublicFunctions.checkLogin();

    if (this.isLogged) {
      this.getTeamName();
    }
  }

  /**
   * If there is component changes with the sidenav, then toggle the sidenav.
   */
  ngOnChanges() {
    if (this.sidenav) {
      console.log(this.sidenav.toggle(this.sidenavToggle));
    }
  }
}
