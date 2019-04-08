// open-register-client.component

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { PublicFunctions } from '../../shared/shared';
import { AuthService } from '../auth.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-open-register',
  templateUrl: './open-register-client.component.html',
  styleUrls: ['./open-register-client.component.css']
})
export class OpenRegisterClientComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  registerClientFormGroup: FormGroup;
  errorMsg: string;
  currHost: string;
  currPort: string;
  isLogged: boolean;
  appName: string;
  port: string;
  redirectUris = [];
  hostUri = '';
  password: string;
  passwordConfirm: string;
  isDone = true;

  // tslint:disable-next-line
  // |(?:(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}-\x{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$
  // tslint:disable-next-line
  //hostUriRegex = /^(([A-Za-z0-9\._\-]+)([A-Za-z0-9]+))(:[1-9][0-9]{0,3}|:[1-5][0-9]{4}|:6[0-4][0-9]{3}|:65[0-4][0-9]{2}|:655[0-2][0-9]|:6553[0-5])?$/m;
  // tslint:disable-next-line
  hostUriRegex = /^(?:(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$/;

  redirectUrisRegex = /^(\/[a-zA-Z0-9]{1,20}){1,10}$/m;
  portRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/m;

  AUTHORIZE_HELP = 'For use with requests from a web server. This is the path' +
                   'in your application that users are redirected to after they' +
                   'have authenticated with Google. The path will be appended with the' +
                   'authorization code for access. Must have a protocol.' +
                   'Cannot contain URL fragments or relative paths. Cannot be a public IP address.';
  ORIGIN_HELP = 'For use with requests from a browser. This is the origin URI of the client' +
                'application. It can\'t contain a wildcard (https://*.example.com) or a path' +
                '(https://example.com/subdir). If you\'re using a nonstandard port, you must include it in the origin URI.';

  appnameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9]{4,20}$'),
  ]);

  hostUriFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.hostUriRegex),
  ]);

  redirectUrisFormControl = new FormControl({ value: '', disabled: true });

  portFormControl = new FormControl({value: '', disabled: true},
  [
    Validators.pattern(this.portRegex),
  ]);

  /**
   * Inits the needed services.
   * @param openLoginService - The open login service.
   * @param dialogRef - The dialog ref service.
   * @param data - The data service.
   */
  constructor(public dialogRef: MatDialogRef<OpenRegisterClientComponent>, private formBuilder: FormBuilder,
  @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService) {
  }


  /**
   * Checks whether the team account is logged in or not.
   */
  ngOnInit() {
    this.isLogged = PublicFunctions.checkLogin();

    this.registerClientFormGroup = this.formBuilder.group({
      appname: this.appnameFormControl,
      hostUri: this.hostUriFormControl,
      redirectUris: this.redirectUrisFormControl,
      port: this.portFormControl,
    });

    this.redirectUrisFormControl.disable();
    this.portFormControl.disable();
  }

  /**
   * Closes the dialog.
   */
  close(): void {
    this.dialogRef.close();
  }

  /**
   * Registers a client with the details given.
   */
  register(event) {
    event.stopPropagation();
    this.appName = this.registerClientFormGroup.value.appname;
    this.port = this.registerClientFormGroup.value.port;
    this.hostUri = this.registerClientFormGroup.value.hostUri;

    this.authService.registerClient({'name': this.appName,
                                     'redirectUris': this.redirectUris.map(value => 'https://' + this.hostUri + value),
                                     'hostUri': 'https://' + this.hostUri}).subscribe((data) => {
      if (data) {
        this.errorMsg = undefined;
        this.dialogRef.close(data);
      } else {
        this.errorMsg = data.message;
      }
    }, (error) => {
      this.errorMsg = error.message;
    });
  }

  isDetailsValid() {
    return this.registerClientFormGroup.status !== 'INVALID' && this.redirectUris.length > 0;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add the chip to the chips list.
    if ((value || '').trim() && this.redirectUrisRegex.test(value) && this.redirectUris.length < 10) {
      this.redirectUris.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(redirectUri): void {
    const index = this.redirectUris.indexOf(redirectUri);

    if (index >= 0) {
      this.redirectUris.splice(index, 1);
    }
  }

  isHostUriValid() {
    if (!this.hostUriRegex.test(this.registerClientFormGroup.value.hostUri)) {
      this.redirectUrisFormControl.disable();
      this.portFormControl.disable();
      return false;
    } else {
      this.redirectUrisFormControl.enable();
      this.portFormControl.enable();
      return true;
    }
  }

  isPortEntered() {
    const currHostUri: string = this.registerClientFormGroup.value.hostUri;
    const hostPort: RegExp = /:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/g;
    const match = hostPort.exec(currHostUri);
    if (match && match[1].length > 0) {
      this.currPort = match[1];
    } else {
      this.currPort = '';
    }
  }

  isPortForm() {
    const currHostUri: string = this.registerClientFormGroup.value.hostUri;
    const hostPort: RegExp = /:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/g;
    const match = hostPort.exec(currHostUri);
    if (this.portRegex.exec(this.currPort)) {
      if (match && match[1].length > 0) {
        this.currHost = this.currHost.replace(/([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/g, this.currPort);
      } else if (!match) {
        this.currHost = `${currHostUri}:${this.currPort}`;
      }
    } else if (this.currPort === '') {
      this.currHost = this.currHost.replace(/:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/g, '');
    }
    // if (currHostUri.match(/a/g)) {
      // this.currHost = `${currHostUri}:${this.currPort}`;
    // }
  }

}
