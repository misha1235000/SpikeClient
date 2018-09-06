// login.component

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { PublicFunctions } from '../../shared/shared';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { OpenRegisterTeamComponent } from '../open-register-team/open-register-team.component';


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
  constructor(private authService: AuthService, private snackBar: MatSnackBar, private formBuilder: FormBuilder,
              private registerDialog: MatDialog) { }

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
    this.teamName = this.loginFormGroup.value.teamname;
    this.password = this.loginFormGroup.value.password;

    this.authService.login({'teamname': this.teamName, 'password': this.password}).subscribe((data) => {
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
    this.loginFormGroup = this.formBuilder.group({
      teamname: this.teamnameFormControl,
      password: this.passwordFormControl
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
    return this.loginFormGroup.status === 'INVALID';
  }

    /**
   * Opens the register dialog.
   */
  openRegister() {
    const dialogRef = this.registerDialog.open(OpenRegisterTeamComponent, {
      width: '410px',
      height: '430px'
    });
  }
}
