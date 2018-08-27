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
  teamName = '';
  title = 'app';
  options: FormGroup;

  constructor(fb: FormBuilder, private loginService: LoginService, private sidenavService: SidenavService) {
    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 64
    });
  }

  checkLogin() {
    if (PublicFunctions.getCookie('token').length > 0) {
      this.isLogged = true;
     } else {
       this.isLogged = false;
       document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
     }
  }

  getUsername() {
    this.sidenavService.getUsername().subscribe((data) => {
      this.teamName = data;
    });
  }


  logout() {
    this.loginService.logout().subscribe((data) => {
      if (data) {
        document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/login';
      }
    });
  }

  ngOnInit() {
    this.checkLogin();
    if (this.isLogged) {
      this.getUsername();
    }
  }

  ngOnChanges() {
    if (this.sidenav) {
      console.log(this.sidenav.toggle(this.sidenavToggle));
    }
  }
}
