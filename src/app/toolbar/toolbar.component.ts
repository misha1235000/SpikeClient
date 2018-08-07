import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '../../../node_modules/@angular/material';
import { LoginService } from '../login/login.service';

function getCookie(name: string) {
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
    getCookie('token').length > 0 ? this.isLogged = true: this.isLogged = false;
  }

  ngOnInit() {
    this.checkLogin();
  }

  openSideNav() {
    this.isOpened = !this.isOpened;
    this.sidenavOpened.emit(this.isOpened);
  }

}
