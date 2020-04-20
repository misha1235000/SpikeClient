// register-client-modal.component

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { PublicFunctions } from '../../shared/shared';
import { AuthService } from '../../auth/auth.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-client-modal',
  templateUrl: './register-client-modal.component.html',
  styleUrls: ['./register-client-modal.component.css']
})
export class RegisterClientModalComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  registerClientFormGroup: FormGroup;
  selectable;
  teams = [];
  hostUris = [];
  correctFile: boolean;
  errorMsg: string;
  currHost = '';
  currPort: string;
  currLb = -1;
  currFile: string;
  isLogged: boolean;
  appName: string;
  port: string;
  redirectUris = [];
  hostUri = '';
  password: string;
  passwordConfirm: string;
  isDone = true;
  fileError = '';
  isMultipleHosts = false;

  // tslint:disable-next-line
  hostUriRegex = /^(([A-Za-z0-9\._\-]+)([A-Za-z0-9]+))(:[1-9][0-9]{0,3}|:[1-5][0-9]{4}|:6[0-4][0-9]{3}|:65[0-4][0-9]{2}|:655[0-2][0-9]|:6553[0-5])?$/m;
  redirectUrisRegex = /^(\/[a-zA-Z0-9]{1,20}){1,10}$/m;
  portRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/m;
  knownLbs = [ { id: 0, value: 'Import From CSV (Beta)' },
             /*{ id: 1, value: 'F5 LTM' },
               { id: 2, value: 'Nginx'},
               { id: 3, value: 'Apache2' }*/ ];
  AUTHORIZE_HELP = `For use with requests from a web server. This is the path
                   'in your application that users are redirected to after they
                   'have authenticated with OSpike. The path will be appended with the
                   'authorization code for access. Must have a protocol.
                   'Cannot contain URL fragments or relative paths. Cannot be a public IP address.`;
  ORIGIN_HELP = `For use with requests from a browser. This is the origin URI of the client
                'application. It can\'t contain a wildcard (https://*.example.com) or a path
                '(https://example.com/subdir). If you\'re using a nonstandard port, you must include it in the origin URI.`;

  appnameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9]{4,20}$'),
  ]);

  hostUriFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.hostUriRegex),
  ]);

  fileFormControl = new FormControl('', [
    Validators.required,
  ]);

  teamnameFormControl = new FormControl('', [
    Validators.required,
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
  constructor(public dialogRef: MatDialogRef<RegisterClientModalComponent>, private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService) {
  }

  /**
   * Checks whether the team account is logged in or not.
   */
  ngOnInit() {
    this.isLogged = PublicFunctions.checkLogin();
    this.teams = this.data.teams;
    this.registerClientFormGroup = this.formBuilder.group({
      appname: this.appnameFormControl,
      teamname: this.teamnameFormControl,
      hostUri: this.hostUriFormControl,
      file: this.fileFormControl,
      redirectUris: this.redirectUrisFormControl,
      port: this.portFormControl,
    });

    this.redirectUrisFormControl.disable();
    this.portFormControl.disable();
    this.fileFormControl.disable();
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
  async register(event) {
    event.stopPropagation();
    this.appName = this.registerClientFormGroup.value.appname;
    this.port = this.registerClientFormGroup.value.port;
    this.hostUri = this.registerClientFormGroup.value.hostUri;

    if (!this.isMultipleHosts) {
      this.hostUris = [];
      this.hostUris.push(this.hostUri);
    }

    const data = await this.authService.registerClient({
                    name: this.appName,
                    teamId: this.registerClientFormGroup.value.teamname,
                    teamName: this.teams.map((currTeam) => {
                      if (currTeam._id === this.registerClientFormGroup.value.teamname) {
                        return currTeam.teamname;
                      }
                    }),
                    redirectUris: this.redirectUris,
                    hostUris: this.hostUris.map(hostUri => 'https://' + hostUri.trim())}).toPromise();
    if (data) {
      this.errorMsg = undefined;
      this.dialogRef.close(data);
    } else {
      this.errorMsg = data.message;
    }
  }

  /**
   * Checks if the details given in the form are valid.
   */
  isDetailsValid() {
    return (this.registerClientFormGroup.status !== 'INVALID' &&
            this.redirectUris.length > 0 && !this.isMultipleHosts) ||
           (this.appnameFormControl.valid &&
            this.correctFile &&
            this.redirectUrisFormControl.valid &&
            this.isMultipleHosts &&
            this.redirectUris.length > 0);
  }

  /**
   * Adds a chip to an array of chips.
   * @param event - The current chip
   */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add the chip to the chips list.
    if ((value || '').trim() &&
        this.redirectUrisRegex.test(value) &&
        this.redirectUris.length < 10 &&
        this.redirectUris.indexOf(value) === -1) {
      this.redirectUris.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /**
   * Removes a chip from the chips array.
   * @param redirectUri - the uri of the chip to remove.
   */
  remove(redirectUri): void {
    const index = this.redirectUris.indexOf(redirectUri);

    if (index >= 0) {
      this.redirectUris.splice(index, 1);
    }
  }

  /**
   * Checks whether the hostUri is valid or not.
   */
  isHostUriValid() {
    if (!this.isMultipleHosts) {
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
  }

  /**
   * Checks if the file given is valid.
   */
  isFileValid() {
    if (this.isMultipleHosts) {
      if (!this.correctFile) {
        this.redirectUrisFormControl.disable();
        this.portFormControl.disable();
        return false;
      } else if (this.correctFile) {
        this.redirectUrisFormControl.enable();
        this.portFormControl.enable();
        return true;
      }
    }
  }

  /**
   * Checks whether the port is entered
   */
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

  /**
   * Adds a port to the hostUri.
   */
  isPortForm() {
    const currHostUri: string = this.registerClientFormGroup.value.hostUri;
    const hostPort: RegExp = /:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/g;
    const match = hostPort.exec(currHostUri);
    if (this.portRegex.exec(this.currPort)) {
      if (match && match[1].length > 0) {
        this.currHost = this.currHost
            .replace(/([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/g, this.currPort);
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

  /**
   * Gets the file info (Reads it).
   * @param file - The file that is given
   */
  getFileInfo(file) {
    const INVALID_HOSTNAME = 'Invalid hostname.';
    const INVALID_PORT = 'Invalid port (must be between 0-65550)';
    const INVALID_SYNTAX = 'Invalid Syntax (must be tab of URL and tab of PORT)';
    const INVALID_TYPE = 'Invalid Type (must be .csv file)';
    const DUPLICATE_HOSTS = 'Duplicate hosts with same ports are not allowed.';
    let errorMessage = '';
    let indexError = false;
    let indexLine: number;

    if (!file.files[0]) {
      console.log('No file selected');
    } else {
      this.currFile = file.files[0].name;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (this.currFile.substr(this.currFile.length - 4) !== '.csv') {
        this.correctFile = false;
        this.fileError = INVALID_TYPE;
      } else {
        if (fileReader.result && fileReader.result.toString()) {
          let fixedHosts = fileReader.result.toString().replace(/,/g, ':');
          fixedHosts = fixedHosts.substr(0, fixedHosts.length - 1);
          const arrHosts = fixedHosts.split('\n');

          if (arrHosts && arrHosts.length > 0) {
            if (checkIfDuplicateExists(arrHosts)) {
              this.correctFile = false;
              this.hostUris = [];
              this.fileError = DUPLICATE_HOSTS;
            } else {
              for (let currHost = 0; currHost < arrHosts.length; currHost++) {
                if (arrHosts[currHost].match(/:/g) &&
                    arrHosts[currHost].match(/:/g).length !== 1) {
                  indexError = true;
                  indexLine = currHost;
                  errorMessage = INVALID_SYNTAX;
                  break;
                } else if (!arrHosts[currHost].split(':')[0].match(this.hostUriRegex)) {
                  indexError = true;
                  indexLine = currHost;
                  errorMessage = INVALID_HOSTNAME;
                  break;
                } else if (!arrHosts[currHost].split(':')[1].match(this.portRegex)) {
                  indexError = true;
                  indexLine = currHost;
                  errorMessage = INVALID_PORT;
                  break;
                }
              }

              if (!indexError) {
                this.hostUris = arrHosts;
                this.fileError = `Succeed to upload all ${arrHosts.length} hosts`;
                this.correctFile = true;
              } else {
                this.hostUris = [];
                this.correctFile = false;
                this.fileError = `${errorMessage}, Error at line: ${indexLine + 1}`;
              }
            }
          } else {
            this.hostUris = [];
            this.correctFile = false;
            this.fileError = INVALID_SYNTAX;
          }
        } else {
          this.hostUris = [];
          this.correctFile = false;
          this.fileError = 'Empty File';
        }
      }
    };

    if (file.files[0]) {
        fileReader.readAsText(file.files[0]);
    }
  }
}

/**
 * Checks if duplicate exists in array.
 * @param array - An Array.
 */
function checkIfDuplicateExists(array) {
  return new Set(array).size !== array.length;
}
