import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../node_modules/@angular/material';
import { OpenRegisterService } from './open-register.service';
import { PublicFunctions } from '../shared/shared';

@Component({
  selector: 'app-open-register',
  templateUrl: './open-register.component.html',
  styleUrls: ['./open-register.component.css']
})
export class OpenRegisterComponent implements OnInit {
  isLogged: boolean;
  teamName: string;
  password: string;
  website = '';
  callback = '';
  appName = '';
  isDone = true;
  AUTHORIZE_HELP = 'For use with requests from a web server. This is the path' +
                   'in your application that users are redirected to after they' +
                   'have authenticated with Google. The path will be appended with the' +
                   'authorization code for access. Must have a protocol.' +
                   'Cannot contain URL fragments or relative paths. Cannot be a public IP address.';
  ORIGIN_HELP = 'For use with requests from a browser. This is the origin URI of the client' +
                'application. It can\'t contain a wildcard (https://*.example.com) or a path' +
                '(https://example.com/subdir). If you\'re using a nonstandard port, you must include it in the origin URI.';


  constructor(private openLoginService: OpenRegisterService,
  public dialogRef: MatDialogRef<OpenRegisterComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, ) {}

  checkLogin(): void {
    if (PublicFunctions.getCookie('token').length > 0) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
      document.cookie = 'token=;expires=;Thu, 01 Jan 1970 00:00:01 GMT;';
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
  }

  close(): void {
    this.dialogRef.close();
  }
}
