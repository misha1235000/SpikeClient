// sidenav.component

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { PublicFunctions } from '../shared/shared';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  team;
  public get getTeam() { return this.team; }
  public set setTeam(newValue) {
  // logic
  this.team = newValue;
  }

  @Input() sidenavToggle;
  @Input() user;
  sidenav;
  isLogged = false;
  options: FormGroup;

  /**
   * Inits the needed services.
   * @param fb - the form builder service
   * @param authService - The auth service.
   */
  constructor(fb: FormBuilder, private authService: AuthService, private sharedService: SharedService) {
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
   * When the component initializes, check if the user logged in,
   * if the user is logged in, then get the username.
   */
  ngOnInit() {
    this.sharedService.onDataChange((data) => {
      this.team = data;
    });

    if (PublicFunctions.getCookie('authorization') !== '') {
      this.user = PublicFunctions.DecodeJwt();
    } else {
      PublicFunctions.logout();
    }
  }
}
