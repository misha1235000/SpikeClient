import { Component, OnInit } from '@angular/core';
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
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {
  isLogged = false;

  constructor(private snackBar: MatSnackBar) { }

  checkLogin(): void {
    if (getCookie('token').length > 0) {
      this.isLogged = true
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
}
