// open-register-team.component

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PublicFunctions } from '../../shared/shared';
import { AuthService } from '../auth.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { EqualValidator } from './equal.validator';

@Component({
  selector: 'app-open-register',
  templateUrl: './open-register-team.component.html',
  styleUrls: ['./open-register-team.component.css']
})
export class OpenRegisterTeamComponent implements OnInit {
  registerFormGroup: FormGroup;
  errorMsg: string;
  isLogged: boolean;
  teamName: string;
  password: string;
  passwordConfirm: string;
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

  teamnameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9]{4,20}$'),
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,50}$'),
  ]);

  passwordConfirmFormControl = new FormControl('', [
    Validators.required,
  ]);

  /**
   * Inits the needed services.
   * @param openLoginService - The open login service.
   * @param dialogRef - The dialog ref service.
   * @param data - The data service.
   */
  constructor(public dialogRef: MatDialogRef<OpenRegisterTeamComponent>, private formBuilder: FormBuilder,
  @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService) {}

  /**
   * Checks whether the team account is logged in or not.
   */
  ngOnInit() {
    this.isLogged = PublicFunctions.checkLogin();

    this.registerFormGroup = this.formBuilder.group({
      teamname: this.teamnameFormControl,
      password: this.passwordFormControl,
      passwordConfirm: this.passwordConfirmFormControl
    },
    {
      validator: EqualValidator.MatchPassword
    });
  }

  /**
   * Closes the dialog.
   */
  close(): void {
    this.dialogRef.close();
  }

  /**
   * Registers a team with the details given.
   */
  register() {
    this.teamName = this.registerFormGroup.value.teamname;
    this.password = this.registerFormGroup.value.password;
    this.passwordConfirm = this.registerFormGroup.value.passwordConfirm;

    this.authService.registerTeam({'teamname': this.teamName, 'password': this.password}).subscribe((data) => {
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

  isDetailsValid() {
    return this.registerFormGroup.status !== 'INVALID';
  }
}
