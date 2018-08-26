import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material';
import { PublicFunctions } from '../shared/shared';

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
    this.loginService.login({'teamname': this.teamName, 'password': this.password}).subscribe((data) => {
      if (data.auth) {
        const expiresDate: Date = new Date();
        expiresDate.setTime(expiresDate.getTime() + 1 * 1 * 10 * 60 * 1000);

        const expires = `${expiresDate.toUTCString()}`;

        document.cookie = `token=${data.token};expires=${expires};path=/`;
        window.location.href = '/tokens';
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

  ngOnInit() {
    if (PublicFunctions.getCookie('token').length > 0) {
      this.isLogged = true;
      window.location.href = '/tokens';
    } else {
      this.isLogged = false;
      document.cookie = 'token=;expires=;Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }

}
