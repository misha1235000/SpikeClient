// tokens.component

import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { PublicFunctions } from '../shared/shared';
import { TokensService } from './tokens.service';
import { OpenRegisterClientComponent } from '../auth/open-register-client/open-register-client.component';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {
  isLogged = false;
  tokens: any[];

  /**
  * Inject the needed services.
  * @param snackBar - The service of the snackbar.
  * @param registerDialog - The service of the register dialog.
  * @param tokensService - The service of the tokens.
  */
  constructor(private snackBar: MatSnackBar, private registerDialog: MatDialog, private tokensService: TokensService) { }

  /**
   * When the component initialized, check if the account team is logged in.
   */
  ngOnInit() {
    this.isLogged = PublicFunctions.checkLogin();
    this.tokensService.getTokens().subscribe(
      tokens => {
        if (tokens) {
          this.tokens = tokens;
        }

        console.log(tokens);
      //  this.tokens = tokens;
      },
      error => {
        console.log(error);
      });
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
      width: '420px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tokens.push(result);
      }
    });
  }
}
