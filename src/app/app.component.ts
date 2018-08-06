import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { LoginService } from './login/login.service';

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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLogged = false;
  teamName = "";
  title = 'app';
  options: FormGroup;

  constructor(fb: FormBuilder, private loginService: LoginService) {
    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 64
    });
  }

  checkLogin() {
    getCookie('token').length > 0 ? this.isLogged = true: this.isLogged = false;
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
