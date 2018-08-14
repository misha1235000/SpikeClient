import { Component, Input, OnChanges } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Input() sidenavToggle;
  sidenav;
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
    if(getCookie('token').length > 0) {
      this.isLogged = true
     } else { 
       this.isLogged = false;
       document.cookie='token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
     }
  }

  getUsername() {
    this.loginService.getUsername().subscribe((data) => {
      this.teamName = data;
    });
  }

  ngOnChanges() {
    if (this.sidenav) {
      console.log(this.sidenav.toggle(this.sidenavToggle));
    }
  }

  logout() {
    this.loginService.logout().subscribe((data) => {
      if (data) {
        document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/login'
      }
    });
  }

  ngOnInit() {
    this.checkLogin();
    if (this.isLogged) {
      this.getUsername();
    }
  }
}