// open-register-client.component

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../node_modules/@angular/material';
import { PublicFunctions } from '../../shared/shared';

@Component({
  selector: 'app-open-register',
  templateUrl: './open-register-client.component.html',
  styleUrls: ['./open-register-client.component.css']
})
export class OpenRegisterClientComponent implements OnInit {
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


  /**
   * Inits the needed services.
   * @param openLoginService - The open login service.
   * @param dialogRef - The dialog ref service.
   * @param data - The data service.
   */
  constructor(public dialogRef: MatDialogRef<OpenRegisterClientComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) {}

  /**
   * Checks whether the team account is logged in or not.
   */
  checkLogin(): void {
    if (PublicFunctions.getCookie('token').length > 0) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
      document.cookie = 'token=;expires=;Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/login';
    }
  }

  ngOnInit() {
  }

  /**
   * Closes the dialog.
   */
  close(): void {
    this.dialogRef.close();
  }
}
