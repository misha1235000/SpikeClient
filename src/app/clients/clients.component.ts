// clients.component

import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog, MatChipInputEvent } from '@angular/material';
import { PublicFunctions } from '../shared/shared';
import { ClientsService } from './clients.service';
import { OpenRegisterClientComponent } from '../auth/open-register-client/open-register-client.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

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
  isEditable = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isLogged = false;
  isInputTriggered = false;
  clients: any[];

  /**
  * Inject the needed services.
  * @param snackBar - The service of the snackbar.
  * @param registerDialog - The service of the register dialog.
  * @param clientsService - The service of the clients.
  */
  constructor(private snackBar: MatSnackBar, private registerDialog: MatDialog, private clientsService: ClientsService) { }

  /**
   * When the component initialized, check if the account team is logged in.
   */
  ngOnInit() {
    this.isLogged = PublicFunctions.checkLogin();
    this.clientsService.getClients().subscribe(
      clients => {
        if (clients) {
          clients.forEach(client => {
            client.newRedirectUris = [];
            client.color = COLORS[client.name[0].toLowerCase().charCodeAt(0) - 97];
            if (client.name.split(' ').length === 1) {
              client.avatarName = client.name + ' ' + client.name[client.name.length - 1];
            } else {
              client.avatarName = client.name;
            }
          });
          this.clients = clients;
        }
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
    this.snackBar.open('Copied To Clipboard', '', {
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
        result.isNew = true;
        result.color = COLORS[result.name[0].toLowerCase().charCodeAt(0) - 97];
        if (result.name.split(' ').length === 1) {
          result.avatarName = result.name + ' ' + result.name[result.name.length - 1];
        } else {
          result.avatarName = result.name;
        }
        this.clients.push(result);
      }
    });
  }

  getClientData(client, currClient) {
    if (!client.secret || !client.redirectUris) {
      this.clientsService.getClientData(client.clientId).subscribe(
        clientData => {
          if (clientData) {
            for (let currIndex = 0; currIndex < this.clients.length; currIndex++) {
              if (this.clients[currIndex].clientId === clientData.clientId) {
                this.clients[currIndex].secret = clientData.secret;
                this.clients[currIndex].redirectUris = clientData.redirectUris;
                currClient.open();
                this.clients[currIndex].start = false;
                break;
              }
            }
          }
        },
        error => {
          console.log(error);
        });
    }
  }

 /* newChip(client) {
    client.isInputTriggered = false;
    client.redirectUris.push(client.uri);
    client.uri = '';
  }*/

  isCancel(client, uri) {
    if (uri.value.length === 0) {
      client.isInputTriggered = false;
    }
  }

  add(client, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add the chip to the chips list.
    if ((value || '').trim() && redirectUrisRegex.test(value)) {
      client.isChanged = true;
      client.isInputTriggered = false;
      client.newRedirectUris.push(client.hostUri + value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(client, redirectUri): void {
    const index = client.newRedirectUris.indexOf(redirectUri);
    if (index >= 0) {
      client.isChanged = true;
      client.newRedirectUris.splice(index, 1);
    }
  }

  saveChanges(client) {
    client.newRedirectUris.forEach(newRedirectUri => {
      client.redirectUris.push(newRedirectUri);
    });

    this.clientsService.updateClient(client.clientId, {redirectUris: client.redirectUris}).subscribe((data) => {
      if (data) {
        this.cancelChanges(client);
        client.redirectUris = data.redirectUris;
      }
    });
  }

  cancelChanges(client) {
    client.isChanged = false;
    client.newRedirectUris = [];
    client.isEditable = false;
  }
}
