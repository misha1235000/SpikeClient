// login.component

import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material';
import { PublicFunctions } from '../shared/shared';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * TODO
 * @param teamname -
 * @param password -
 */
function detailsValid(teamname: string, password: string): string {
  const teamnameRegex = /[a-zA-Z0-9]{1,40}/m;
  const passwordRegex = /[a-zA-Z0-9!@#$%^&*()_+=-]{1,40}/m;

  !password ? password = '' : password = password;

  if (!teamnameRegex.test(teamname)) {
    return 'teamname must contain 1-40 letters or numbers';
  } else if (!passwordRegex.test(password)) {
    return 'password must contain 1-40 letters, numbers or special characters';
  } else {
    return '';
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /**
   * TODO
   * @param loginService -
   * @param snackBar -
   */
  constructor(private loginService: LoginService, private snackBar: MatSnackBar, private _formBuilder: FormBuilder) { }

  teamnameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9]{1,40}$'),
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9!@#$%^&*()_+=-]{1,40}$'),
  ]);

  loginFormGroup: FormGroup;
  isLogged: boolean;
  teamName: string;
  password: string;
  errorMsg: string;

  /**
   * TODO
   */
  login() {
      this.loginService.login({'teamname': this.teamName, 'password': this.password}).subscribe((data) => {
        if (data.auth) {
          this.errorMsg = undefined;
          const expiresDate: Date = new Date();

          expiresDate.setTime(expiresDate.getTime() + 1 * 1 * 10 * 60 * 1000);

          const expires = `${expiresDate.toUTCString()}`;

          document.cookie = `token=${data.token};expires=${expires};path=/`;
          window.location.href = '/tokens';
        } else {
          this.errorMsg = data.message;
        }
      }, (error) => {
        this.errorMsg = error.message;
      });
  }

  /**
   * TODO
   */
  ngOnInit() {
    this.loginFormGroup = this._formBuilder.group({
      teamname: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]{1,40}$')]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9!@#$%^&*()_+=-]{1,40}$'),
      ]),
    });

    if (PublicFunctions.getCookie('token').length > 0) {
      this.isLogged = true;
      window.location.href = '/tokens';
    } else {
      this.isLogged = false;
      document.cookie = 'token=;expires=;Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }
}
