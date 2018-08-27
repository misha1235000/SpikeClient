// tokens.component

import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { OpenRegisterComponent } from '../open-register/open-register.component';
import { PublicFunctions } from '../shared/shared';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {
  isLogged = false;
  tokens = [{name: 'GoogleMe Token', hostname: 'https://googleme.com',
             token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNzAxMjg'},
            {name: 'Fire Token', hostname: 'https://firecool.com',
             token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNzAxYTQ0'},
            {name: 'Youtube Token', hostname: 'https://youtube.com',
             token: 'afJGWIwohtsbo.vmfPgwgSgY9V_-4FMY_52dRgu2V0vihW3pwR2GeaFPE'},
            {name: 'Waze Token', hostname: 'https://waze.com',
             token: 'FSgW9523h59haoKAu5VrplsOjeloQ5I5JAIEnCjg7VetjW76l13WujvWI'}];

  constructor(private snackBar: MatSnackBar, private registerDialog: MatDialog) { }

  checkLogin(): void {
    if (PublicFunctions.getCookie('token').length > 0) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
      window.location.href = '/login';
    }
  }

  ngOnInit() {
    this.checkLogin();
  }

  copyClipboard(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    inputElement.blur();
    this.snackBar.open('Token Copied To Clipboard', '', {
        duration: 2000
    });
  }

  openRegister() {
    const dialogRef = this.registerDialog.open(OpenRegisterComponent, {
      width: '410px',
      height: '420px'
    });
  }
}
