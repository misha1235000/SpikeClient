import { Component, OnInit, Input } from '@angular/core';
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
  @Input() sidenav;
  isLogged = false;
  teamName;

  constructor(public dialog: MatDialog, public loginService: LoginService) { }

  checkLogin() {
    getCookie('token').length > 0 ? this.isLogged = true: this.isLogged = false;
  }

  logout() {
    this.loginService.logout().subscribe((data) => {
      if (data) {
        document.cookie = 'token=;expires=;Thu, 01 Jan 1970 00:00:01 GMT;';
        location.reload();
      }
    });
  }

  getEmail() {
    this.loginService.getEmail().subscribe((data) => {
      this.teamName = data;
    });
  }

  ngOnInit() {
    this.checkLogin();
    if (this.isLogged) {
      this.getEmail();
    }
  }

}
