// sidenav.component

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { SidenavService } from './sidenav.service';
import { LoginService } from '../login/login.service';
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
  team = '';
  title = 'app';
  options: FormGroup;

  /**
   * Inits the needed services.
   * @param fb - the form builder service
   * @param loginService - The login service.
   * @param sidenavService - The sidenav service.
   */
  constructor(fb: FormBuilder, private loginService: LoginService, private sidenavService: SidenavService) {
    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 64
    });
  }

  /**
   * Checks whether the team account is logged in or not.
   */
  checkLogin() {
    PublicFunctions.getCookie('token').length > 0 ? this.isLogged = true : this.isLogged = false;
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
  getUsername() {
    this.sidenavService.getUsername().subscribe((data) => {
      this.team = data.team;
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * When the component initializes, check if the user logged in,
   * if the user is logged in, then get the username.
   */
  ngOnInit() {
    this.checkLogin();
    if (this.isLogged) {
      this.getUsername();
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
