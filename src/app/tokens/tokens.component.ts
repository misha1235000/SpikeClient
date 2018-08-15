import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { OpenRegisterComponent } from '../open-register/open-register.component';

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
  tokens = [{name: 'GoogleMe Token', hostname: 'https://googleme.com', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNzAxMjg5NTJlY2VkMzIzMGI0YmNkMyIsImlhdCI6MTUzNDA3MTQzMywiZXhwIjoxNTM0MDcxNDkzfQ.gSnFbauA67xG7oM9xa7wvAhBHa8Ot-KM-G-yo3NL8XI'},
            {name: 'Fire Token', hostname: 'https://firecool.com', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNzAxYTQ0YTM3YzJmMTEwNDViODI4ZSIsImlhdCI6MTUzNDEzOTI0MSwiZXhwIjoxNTM0MTM5ODQxfQ.ubnwdVzNqkWxbxMRxep2LEu0YGU4EHFPu8o4mcebMZs'},
            {name: 'Youtube Token', hostname: 'https://youtube.com', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNzAxYTQ0YTM3YzJmMTEwNDViODI4ZSIsImlhdCI6MTUzNDEzOTI1NSwiZXhwIjoxNTM0MTM5ODU1fQ.vmfPgwgSgY9V_-4FMY_52dRgu2V0vihW3pwR2GeaFPE'},
            {name: 'Waze Token', hostname: 'https://waze.com', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNzAxYTQ0YTM3YzJmMTEwNDViODI4ZSIsImlhdCI6MTUzNDEzOTI2MywiZXhwIjoxNTM0MTM5ODYzfQ.KAu5VrplsOjeloQ5I5JAIEnCjg7VetjW76l13WujvWI'},];
  constructor(private snackBar: MatSnackBar, private registerDialog: MatDialog) { }

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

  openRegister() {
    const dialogRef = this.registerDialog.open(OpenRegisterComponent, {
      width: '410px',
      height: '420px'
    });
  }
}
