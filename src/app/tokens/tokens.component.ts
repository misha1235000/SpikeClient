// tokens.component

import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { PublicFunctions } from '../shared/shared';
import { OpenRegisterClientComponent } from '../auth/open-register-client/open-register-client.component';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {
  isLogged = false;

  // Mock tokens for now, Will be removed later.
  tokens = [{name: 'GoogleMe Token', hostname: 'https://googleme.com',
             token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNzAxMjg'},
            {name: 'Fire Token', hostname: 'https://firecool.com',
             token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNzAxYTQ0'},
            {name: 'Youtube Token', hostname: 'https://youtube.com',
             token: 'afJGWIwohtsbo.vmfPgwgSgY9V_-4FMY_52dRgu2V0vihW3pwR2GeaFPE'},
            {name: 'Waze Token', hostname: 'https://waze.com',
             token: 'FSgW9523h59haoKAu5VrplsOjeloQ5I5JAIEnCjg7VetjW76l13WujvWI'}];

  /**
  * Inject the needed services.
  * @param snackBar - The service of the snackbar.
  * @param registerDialog - The service of the register dialog.
  */
  constructor(private snackBar: MatSnackBar, private registerDialog: MatDialog) { }

  /**
   * Checks whether the team is logged in or not.
   */
  checkLogin(): void {
    if (PublicFunctions.getCookie('token').length > 0) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
      window.location.href = '/login';
    }
  }

  /**
   * When the component initialized, check if the account team is logged in.
   */
  ngOnInit() {
    this.checkLogin();
  }

  /**
   * Copies to textarea to clipboard.
   * @param inputElement - The input value.
   */
  copyClipboard(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    inputElement.blur();
    this.snackBar.open('Token Copied To Clipboard', '', {
        duration: 2000
    });
  }

  /**
   * Opens the register dialog.
   */
  openRegister() {
    const dialogRef = this.registerDialog.open(OpenRegisterClientComponent, {
      width: '410px',
      height: '420px'
    });
  }
}
