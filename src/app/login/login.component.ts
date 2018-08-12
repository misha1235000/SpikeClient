import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material';

function getCookie(name) {
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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogged: boolean;
  teamName: string;
  password: string;

  constructor(private loginService: LoginService, private snackBar: MatSnackBar) { }
  
  login() {
    this.loginService.login({'username': this.teamName, 'password': this.password}).subscribe((data) => {
      if (data.auth) {
        let expiresDate: Date = new Date();
        expiresDate.setTime(expiresDate.getTime() + 1 * 1 * 10 * 60 * 1000);

        let expires: string = `${expiresDate.toUTCString()}`;

        document.cookie = `token=${data.token};expires=${expires};path=/`;
        window.location.href = '/register';
      }
    });
  }

  logout() {
    this.loginService.logout().subscribe((data) => {
      if (data) {
        document.cookie = 'token=;expires=;Thu, 01 Jan 1970 00:00:01 GMT;';
        location.reload();
      }
    });
  }

  getUsername() {
    this.loginService.getUsername().subscribe((data) => {
      this.snackBar.open(data.email, '', {duration: 1000});
  });
  }

  ngOnInit() {
    if (getCookie('token').length > 0) {
      this.isLogged = true
      window.location.href = '/register';
    } else {
      this.isLogged = false;
    }
  }

}