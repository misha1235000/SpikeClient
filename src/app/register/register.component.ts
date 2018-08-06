import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { RegisterService } from './register.service';
import { MatDialog } from '../../../node_modules/@angular/material';
import { timeout } from '../../../node_modules/rxjs/operators';

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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  website = "";
  callback = "";
  appName = "";
  isLogged: boolean;
  isDone = true;

  AUTHORIZE_HELP = "For use with requests from a web server. This is the path in your application that users are redirected to after they have authenticated with Google. The path will be appended with the authorization code for access. Must have a protocol. Cannot contain URL fragments or relative paths. Cannot be a public IP address.";
  ORIGIN_HELP = "For use with requests from a browser. This is the origin URI of the client application. It can't contain a wildcard (https://*.example.com) or a path (https://example.com/subdir). If you're using a nonstandard port, you must include it in the origin URI.";


  constructor(private registerService: RegisterService, private loginService: LoginService, public dialog: MatDialog) { }
  
  checkLogin(): void {
    if (getCookie('token').length > 0) {
      this.isLogged = true
    } else {
      this.isLogged = false;
      window.location.href = '/login';
    }
  }

  isExist() {
    this.isDone = false;
   // this.registerService.isExist(this.appName).subscribe((data) => {
    setTimeout(() => {
      this.isDone = true;
      if (this.appName.length > 3) {
          alert('Registered successfuly.');
        } else {
        alert('App already exists.');
      }
    }, 2000); 
}


  ngOnInit() {
   this.checkLogin();
  }

}
