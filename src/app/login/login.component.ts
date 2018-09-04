// login.component

import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material';
import { PublicFunctions } from '../shared/shared';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /**
   * The constructor of the component
   * @param loginService - The login service that will be used for the login.
   * @param snackBar - The snackbar that will be useed.
   * @param _formBuilder - The form builder.
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
   * Logins to a team with the details given.
   */
  login() {
      this.loginService.login({'teamname': this.teamName, 'password': this.password}).subscribe((data) => {
        if (data.auth) { // If the server returned that the login authorized.
          this.errorMsg = undefined;
          const expiresDate: Date = new Date();

          expiresDate.setTime(expiresDate.getTime() + 1 * 1 * 10 * 60 * 1000); // Set the expire date of the cookie.

          const expires = `${expiresDate.toUTCString()}`;

          document.cookie = `token=${data.token};expires=${expires};path=/`; // The cookie of the token.
          window.location.href = '/tokens';
        } else {
          this.errorMsg = data.message;
        }
      }, (error) => {
        this.errorMsg = error.message;
      });
  }

  /**
   * When the component intializes, init the login form group with necessary validators.
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

    if (PublicFunctions.getCookie('token').length > 0) { // If the token cookie isnt empty.
      this.isLogged = true;
      window.location.href = '/tokens';
    } else { // If the token cookie is empty.
      this.isLogged = false;
      document.cookie = 'token=;expires=;Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }

  /**
   * Checks whether there is any error in any input
   */
  isDetailsValid() {
    if (this.passwordFormControl.hasError('required') ||
        this.passwordFormControl.hasError('pattern') ||
        this.teamnameFormControl.hasError('required') ||
        this.teamnameFormControl.hasError('pattern')) {
        return false;
    }

    return true;
  }
}
