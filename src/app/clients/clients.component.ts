// clients.component

import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { PublicFunctions } from '../shared/shared';
import { ClientsService } from './clients.service';
import { OpenRegisterClientComponent } from '../auth/open-register-client/open-register-client.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  isLogged = false;
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
    this.snackBar.open('Token Copied To Clipboard', '', {
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
                this.clients[currIndex].redirectUris = clientData.redirectUris
                    .map(data => data.substr(8).substr(data.substr(8).indexOf('/')));
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
}
