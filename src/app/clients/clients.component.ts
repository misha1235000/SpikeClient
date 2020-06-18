// clients.component

import { SharedService } from '../shared.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar} from '@angular/material/snack-bar';
import { PublicFunctions } from '../shared/shared';
import { ClientsService } from './clients.service';
import { RegisterClientModalComponent } from './register-client-modal/register-client-modal.component';
import { VerifyClientDeleteModalComponent } from './verify-client-delete-modal/verify-client-delete-modal.component';
import { VerifyClientResetModalComponent } from './verify-client-reset-modal/verify-client-reset-modal.component';
import { ClientHostUrisModalComponent } from './client-host-uris-modal/client-host-uris-modal.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

const COLORS = ['#EF5350', '#C62828', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0',
                '#3D5AFE', '#1976D2', '#0277BD', '#0097A7', '#00897B', '#388E3C',
                '#558B2F', '#FF7043', '#BF360C', '#8D6E63', '#757575', '#78909C',
                '#000000', '#29B6F6', '#7C4DFF', '#FF5252', '#EC407A', '#388E3C',
                '#558B2F', '#1976D2'];

const redirectUrisRegex = /^(\/[a-zA-Z0-9]{1,20}){1,10}$/m;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clientsForSearch;
  selectable;
  teams;
  public get getTeam() { return this.teams; }
  public set setTeam(newValue) {
    // logic
    this.teams = newValue;
  }

  user;
  // tslint:disable-next-line:max-line-length
  hostUriRegex = /^(([A-Za-z0-9\._\-]+)([A-Za-z0-9]+))(:[1-9][0-9]{0,3}|:[1-5][0-9]{4}|:6[0-4][0-9]{3}|:65[0-4][0-9]{2}|:655[0-2][0-9]|:6553[0-5])?$/m;
  portRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/m;
  fileFormGroup: FormGroup;
  isEditable = false;
  isJohnny = false;
  saveErrMsg: string;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isLogged = false;
  isInputTriggered = false;
  clients: any[];
  filteredClients;

  /**
   * Inject the needed services.
   * @param snackBar - The service of the snackbar.
   * @param registerDialog - The service of the register dialog.
   * @param clientsService - The service of the clients.
   */
  constructor(private snackBar: MatSnackBar,
              private registerDialog: MatDialog,
              private verifyDeleteDialog: MatDialog,
              private verifyClientResetDialog: MatDialog,
              private clientHostUrisDialog: MatDialog,
              private clientsService: ClientsService,
              private formBuilder: FormBuilder,
              private router: Router,
              private sharedService: SharedService,
              private authService: AuthService) { }

  fileFormControl = new FormControl('', [
    Validators.required,
  ]);
  /**
   * When the component initialized, check if the account team is logged in.
   */
  async ngOnInit() {
    this.sharedService.onDataChange((data) => {
      this.teams = data;
    });

    if (PublicFunctions.getCookie('authorization') !== '') {
      this.user = PublicFunctions.DecodeJwt();
    } else {
      PublicFunctions.checkLogin();
    }

    if (!this.teams && this.user) {
      const teams = await this.authService.getTeams(this.user.genesisId).toPromise();

      if (teams && teams.teams && teams.teams.length > 0) {
        this.sharedService.setData = teams;
        this.teams = teams;
        const clients = await this.clientsService.getClients().toPromise();
        if (clients) {
          clients.forEach(client => {
            client.fileFormGroup = this.formBuilder.group({
              file: this.fileFormControl,
            });

            client.newRedirectUris = [];
            client.color = COLORS[client.name[0].toLowerCase().charCodeAt(0) - 97];
            if (client.name.split(' ') && client.name.split(' ').length === 1) {
              client.avatarName = client.name + ' ' + client.name[client.name.length - 1];
            } else {
              client.avatarName = client.name;
            }
          });

          clients.map(client => { client = client.hostUris.sort(); });

          for (const [clientIndex, client] of clients.entries()) {
            for (const team of teams.teams) {
              if (client.teamId === team._id) {
                clients[clientIndex].teamName = team.teamname;
              }
            }
          }

          this.clients = clients;
          }
      } else {
          this.router.navigateByUrl('/register');
      }
    }
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
    this.snackBar.open('Copied To Clipboard', '', {
      duration: 2000
    });
  }

  /**
   * Opens the register dialog.
   */
  async openRegister() {
    const dialogRef = this.registerDialog.open(RegisterClientModalComponent, {
      width: '420px',
      data: {
        teams: this.teams.teams
      }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      result.isNew = true;
      result.color = COLORS[result.name[0].toLowerCase().charCodeAt(0) - 97];
      if (result.name.split(' ') && result.name.split(' ').length === 1) {
        result.avatarName = result.name + ' ' + result.name[result.name.length - 1];
      } else {
        result.avatarName = result.name;
      }

      // tslint:disable-next-line:prefer-for-of
      for (let currTeam = 0; currTeam < this.teams.teams.length; currTeam++) {
        if (result.teamId === this.teams.teams[currTeam]._id) {
          result.teamName = this.teams.teams[currTeam].teamname;
          break;
        }
      }

      result.newRedirectUris = [];
      this.clients.push(result);
    }
  }

  /**
   * Gets all the client data.
   * @param client - The client with the data.
   * @param currClient - The current client.
   */
  async getClientData(client, currClient) {
    if (!client.secret || !client.redirectUris) {
      const clientData = await this.clientsService.getClientData(client.clientId).toPromise();
      if (clientData) {
        for (const [clientIndex, clientCurrent] of this.clients.entries()) {
          if (clientCurrent.clientId === clientData.clientId) {
            this.clients[clientIndex].teamId = clientData.teamId;
            this.clients[clientIndex].secret = clientData.secret;
            this.clients[clientIndex].redirectUris = clientData.redirectUris;
            this.clients[clientIndex].audienceId = clientData.audienceId;
            currClient.open();
            this.clients[clientIndex].start = false;
            break;
          }
        }

        // tslint:disable-next-line:prefer-for-of
        for (let currIndex = 0; currIndex < this.clients.length; currIndex++) {
          if (this.clients[currIndex].clientId === clientData.clientId) {
            this.clients[currIndex].teamId = clientData.teamId;
            this.clients[currIndex].secret = clientData.secret;
            this.clients[currIndex].redirectUris = clientData.redirectUris;
            this.clients[currIndex].audienceId = clientData.audienceId;
            currClient.open();
            this.clients[currIndex].start = false;
            break;
          }
        }
      }
    }
  }

  // Checks if the cancel button was pressed.
  isCancel(client, uri) {
    if (uri.value && uri.value.length === 0) {
      client.isInputTriggered = false;
    }
  }

  /**
   * Adds new client to the clients chip array.
   * @param client - The Client.
   * @param event - The Event.
   */
  add(client, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add the chip to the chips list.
    if ((value || '').trim() &&
      redirectUrisRegex.test(value) &&
      client.redirectUris.indexOf(value) === -1 &&
      client.newRedirectUris.indexOf(value) === -1) {
      client.isInputTriggered = false;
      client.newRedirectUris.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /**
   * Removes a client from the chip array.
   * @param client - The client.
   * @param redirectUri - The redirect Uri.
   */
  remove(client, redirectUri): void {
    const index = client.newRedirectUris.indexOf(redirectUri);

    if (index >= 0) {
      client.newRedirectUris.splice(index, 1);
    }
  }

  removeCopy(client, redirectUri): void {
    const index = client.copyRedirectUris.indexOf(redirectUri);

    if (index >= 0) {
      client.copyRedirectUris.splice(index, 1);
    }
  }

  /**
   * Saves the changes of the client.
   * @param client - The client.
   */
  async saveChanges(client) {
    client.redirectUris = client.copyRedirectUris.slice();

    // If there are new redirect Uris, add them to the redirect Uris array.
    if (client.newRedirectUris) {
      client.newRedirectUris.forEach(newRedirectUri => {
        client.redirectUris.push(newRedirectUri);
      });
    }

    if (client.fileHostUris && client.correctFile) {
      client.hostUris = client.fileHostUris.slice(0);
    }

    const data = await this.clientsService.updateClient(client.clientId,
                            {
                              redirectUris: client.redirectUris,
                              hostUris: client.hostUris.map(hostUri => {
                                if (hostUri.indexOf('https://') === -1) {
                                  hostUri = `https://${hostUri}`;
                                }

                                return hostUri.trim();
                            })}).toPromise();
    if (data) {
      this.cancelChanges(client);
      client.redirectUris = data.redirectUris;
      this.snackBar.open('Client was updated successfuly', '', {
        duration: 2000
      });
    }
  }

  /**
   * Sets the client as editable.
   * @param client - The client
   */
  setEditable(client): void {
    client.isEditable = true;
    client.copyRedirectUris = client.redirectUris.slice();
    client.hostUrisCopy = client.hostUris.map(hostUri => hostUri.substr(8));
  }

  /**
   * Cancels all the changes.
   * @param client - The client
   */
  cancelChanges(client): void {
    client.newRedirectUris = [];
    client.isEditable = false;
    client.edit = false;
    client.correctFile = undefined;
    client.fileHostUris = [];
    client.hostUriEditable = false;
    client.currFile = '';
    client.fileError = '';
    client.isInputTriggered = false;
    this.saveErrMsg = undefined;
  }

  /**
   * Remove a client.
   * @param client - The client
   */
  async removeClient(client) {
    const dialogRef = this.verifyDeleteDialog.open(VerifyClientDeleteModalComponent, {
      width: '420px',
      height: '220px'
    });

    let savedIndex: number;
    let savedClient;

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      this.clients.forEach((currClient, index) => {
        if (currClient.clientId === client.clientId) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
          this.clients.splice(index, 1);
          savedIndex = index;
          savedClient = currClient;
        }
      });
      const timer = setTimeout(async () => {
        await this.clientsService.removeClient(client.clientId).toPromise();
      }, 5000);
      this.snackBar.open('Client was removed successfuly', 'Undo', {
        duration: 5000
      }).onAction().subscribe(() => {
        this.clients.splice(savedIndex, 0, savedClient);
        clearTimeout(timer);
      });
    }
  }

  /**
   * Opens up the hosts uri management for a specific client.
   * @param client - The client
   */
  async expandUris(event, client, edit: boolean) {
    event.stopPropagation();

    const dialogRef = this.clientHostUrisDialog.open(ClientHostUrisModalComponent, {
      width: '620px',
      height: '770px',
      data: {
        client,
        edit,
      }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      client.hostUris = result.slice(0);
      client.fileHostUris = result.slice(0);
    }
  }

  /**
   * A check if client has changed.
   * @param client - The client.
   */
  isClientChanged(client): boolean {
    if (client.redirectUris.toString() === client.copyRedirectUris.toString() &&
      client.newRedirectUris && client.newRedirectUris.length === 0 &&
      (arraysEqual(client.hostUris, client.fileHostUris) || !(client.correctFile))) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Set hostUri as editable.
   * @param event - The event.
   * @param client - The client.
   */
  editHostUri(event, client): void {
    event.stopPropagation();
    client.hostUriEditable = true;
  }

  /**
   * Stop HostUri from being editable.
   * @param event - The event.
   * @param client - The client.
   */
  saveHostUri(event, client): void {
    event.stopPropagation();
    client.hostUriEditable = false;
  }

  /**
   * Checks the file info (Read the file)
   * @param client - Current Client
   * @param file - Current File
   */
  getFileInfo(client, file) {
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
      client.currFile = file.files[0].name;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (client.currFile.substr(client.currFile.length - 4) !== '.csv') {
        client.correctFile = false;
        client.fileError = INVALID_TYPE;
      } else {
        if (fileReader.result && fileReader.result.toString()) {
          let fixedHosts = fileReader.result.toString().replace(/,/g, ':');
          fixedHosts = fixedHosts.substr(0, fixedHosts.length - 1);
          const arrHosts = fixedHosts.split('\n');

          if (arrHosts && arrHosts.length > 0) {
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
              client.fileHostUris = Array.from(new Set(arrHosts.concat(client.hostUris).map((value) => {
                return value.replace('https://', '').trim();
              })));
              client.fileHostUris = client.fileHostUris.map(hostUri => `https://${hostUri.trim()}`).sort();
              client.fileError = `Succeed to upload all ${arrHosts.length} hosts`;
              client.correctFile = true;
            } else {
              client.fileHostUris = [];
              client.correctFile = false;
              client.fileError = `${errorMessage}, Error at line: ${indexLine + 1}`;
            }
          } else {
            client.fileHostUris = [];
            client.correctFile = false;
            client.fileError = INVALID_SYNTAX;
          }
        } else {
          client.fileHostUris = [];
          client.correctFile = false;
          client.fileError = 'Empty File';
        }
      }
    };

    if (file.files[0]) {
      fileReader.readAsText(file.files[0]);
    }
  }

  /**
   * Resets client credentials (Changes the client secret)
   * @param client - Current Client
   */
  async resetCredentials(client) {
    const dialogRef = this.verifyClientResetDialog.open(VerifyClientResetModalComponent, {
      width: '420px',
      height: '270px'
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      const data = await this.clientsService.resetCredentials(client.clientId).toPromise();
      if (data) {
        // tslint:disable-next-line:prefer-for-of
        for (let currIndex = 0; currIndex < this.clients.length; currIndex++) {
          if (client.clientId === this.clients[currIndex].clientId) {
            this.clients[currIndex].clientId = data.clientId;
            this.clients[currIndex].secret = data.secret;
            break;
          }
        }

        this.snackBar.open('Client Credentials Has Been Renewed Successfuly', '', {
          duration: 2000
        });
      }
    }
  }

  /**
   * Filter clients
   * @param dataToSearch - string to search
   */
  filterClients(dataToSearch) {
    if (!dataToSearch || dataToSearch === '') {
      this.filteredClients = undefined;
      return this.clients;
    } else {
      this.filteredClients = this.clients.filter((client) => {
        return client.name.toLowerCase().match(dataToSearch.toLowerCase()) ||
               client.teamName.toLowerCase().match(dataToSearch.toLowerCase());
      });

      return this.filteredClients;
    }
  }
}

/**
 * Checks if two arrays are equal.
 * @param firstArray - The first array.
 * @param secondArray - The second array.
 */
function arraysEqual(firstArray, secondArray) {
  if (firstArray && secondArray) {
    return JSON.stringify(firstArray.sort()).trim() === JSON.stringify(secondArray.sort()).trim();
  }

  return false;
}
