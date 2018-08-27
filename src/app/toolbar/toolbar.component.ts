// toolbar.component

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '../../../node_modules/@angular/material';
import { LoginService } from '../login/login.service';
import { PublicFunctions } from '../shared/shared';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() sidenavOpened = new EventEmitter();
  @Input() sidenav;
  isLogged = false;
  isOpened = true;

  constructor(public dialog: MatDialog, public loginService: LoginService) { }

  checkLogin() {
    PublicFunctions.getCookie('token').length > 0 ? this.isLogged = true : this.isLogged = false;
  }

  ngOnInit() {
    this.checkLogin();
  }

  openSideNav() {
    this.isOpened = !this.isOpened;
    this.sidenavOpened.emit(this.isOpened);
  }
}
