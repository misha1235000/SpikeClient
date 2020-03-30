// client-host-uris-modal.component

import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-client-host-uris-modal',
  templateUrl: './client-host-uris-modal.component.html',
  styleUrls: ['./client-host-uris-modal.component.css']
})

export class ClientHostUrisModalComponent implements OnInit {
  @ViewChild('scrollDiv') divToScroll: ElementRef;
  addHostFormGroup: FormGroup;
  portRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/m;
  // tslint:disable-next-line:max-line-length
  hostUriRegex = /^(([A-Za-z0-9\._\-]+)([A-Za-z0-9]+))(:[1-9][0-9]{0,3}|:[1-5][0-9]{4}|:6[0-4][0-9]{3}|:65[0-4][0-9]{2}|:655[0-2][0-9]|:6553[0-5])?$/m;
  client;
  errMsg: string;
  hostUri: string;
  hostPort: string;
  CLIENT_DATA = [];
  addMode = false;
  displayedColumns: string[] = ['hostUri', 'hostPort', 'actions'];
  dataSource;

  hostUriFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.hostUriRegex),
  ]);

  portFormControl = new FormControl({value: '', disabled: true},
  [
    Validators.pattern(this.portRegex),
  ]);

  /**
   * Constructor
   * @param dialogRef - The reference for the dialog
   * @param formBuilder - The form builder
   * @param clientsService - The service of the clients
   * @param snackBar - Angular material snackbar
   * @param data - Data that the modal is filled with
   */
  constructor(public dialogRef: MatDialogRef<ClientHostUrisModalComponent>,
              private formBuilder: FormBuilder,
              private clientsService: ClientsService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.client = data.client;

                if (this.data.edit) {
                  this.client.fileHostUris.forEach(hostUri => {
                    this.CLIENT_DATA.push({
                      hostUri: `${hostUri.split(':')[0]}:${hostUri.split(':')[1]}` , hostPort: `${hostUri.split(':')[2]}`,
                      actions: [/*{ color: 'primary', icon: 'edit', tooltip: 'Edit Host', func: 'edit' },*/
                      { color: 'warn', icon: 'delete', tooltip: 'Delete Host', func: 'delete' },
                      { color: 'primary', icon: 'content_copy', tooltip: 'Copy Full HostUri', func: 'copy'}] });
                  });
                } else {
                  this.client.hostUris.forEach(hostUri => {
                    this.CLIENT_DATA.push({
                      hostUri: `${hostUri.split(':')[0]}:${hostUri.split(':')[1]}` , hostPort: `${hostUri.split(':')[2]}`,
                      actions: [/*{ color: 'primary', icon: 'edit', tooltip: 'Edit Host', func: 'edit' },*/
                      { color: 'warn', icon: 'delete', tooltip: 'Delete Host', func: 'delete' },
                      { color: 'primary', icon: 'content_copy', tooltip: 'Copy Full HostUri', func: 'copy'}] });
                  });
                }

                this.dataSource = new MatTableDataSource(this.CLIENT_DATA);
              }

  /**
   * Initializes the table with the data given.
   * Initializes the form.
   */
  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.CLIENT_DATA);

    this.addHostFormGroup = this.formBuilder.group({
      host: this.hostUriFormControl,
      port: this.portFormControl,
    });
  }

  /**
   * Closes the dialog (with a false value)
   */
  close(): void {
    this.dialogRef.close(false);
  }

  /**
   * Verify delete, and closes the dialog (with a true value)
   */
  verifyDelete(): void {
    this.dialogRef.close(true);
  }

  /**
   * Filters the needed data.
   * @param filterValue - The string for the filter
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Adds a host with a port.
   * @param hostUri - The hostUri.
   * @param hostPort - The port of the host.
   */
  addToList(hostUri, hostPort) {
    hostUri = `https://${hostUri.split(':')[0]}`;
    const currentHostUris = clientDataToArray(this.CLIENT_DATA);
    currentHostUris.push(`${hostUri}:${hostPort}`);
    if (currentHostUris.length === (new Set(currentHostUris)).size) {
      this.addMode = false;
      this.CLIENT_DATA.push({hostUri, hostPort, actions: [/*{ color: 'primary', icon: 'edit', tooltip: 'Edit Host', func: 'edit'},*/
                            { color: 'warn', icon: 'delete', tooltip: 'Delete Host', func: 'delete' },
                            { color: 'primary', icon: 'content_copy', tooltip: 'Copy Full HostUri', func: 'copy'}] });
      this.dataSource = new MatTableDataSource(this.CLIENT_DATA);
      window.setTimeout(() => { this.divToScroll.nativeElement.scrollTop = 15000; }, 10);
      this.hostPort = undefined;
      this.hostUri = undefined;
      this.errMsg = undefined;
    } else {
      this.errMsg = 'Duplicate HostUri';
    }
  }

  /**
   * Runs a specific action.
   * @param actionType - The action to run
   * @param host - The host that was given
   */
  runAction(actionType, host) {
    for (let currIndex = 0; currIndex < this.CLIENT_DATA.length; currIndex++) {
      if (host === this.CLIENT_DATA[currIndex]) {
        switch (actionType) {
          case 'delete':
            this.CLIENT_DATA.splice(currIndex, 1);
            break;
          case 'edit':
            break;
          case 'copy':
            this.copyToClipboard(`${host.hostUri}:${host.hostPort}`);
            this.snackBar.open('HostUri Was Copied To ClipBoard', '', {
              duration: 2000
            });
            break;
          default:
            break;
        }
      }
    }

    this.dataSource = new MatTableDataSource(this.CLIENT_DATA);
  }

  /**
   * Checks whether a port was entered.
   */
  isPortEntered() {
    if (this.hostUriRegex.exec(this.hostUri)) {
      this.portFormControl.enable();
    } else {
      this.portFormControl.disable();
    }

    const portRegex: RegExp = /:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/g;
    const match = portRegex.exec(this.hostUri);
    if (match && match[1].length > 0) {
      this.hostPort = match[1];
    } else {
      this.hostPort = '';
    }
  }

  /**
   * Checks if the port is formed right and concats the port to the host.
   */
  isPortForm() {
    const currHostUri: string = this.addHostFormGroup.value.host;
    const hostPort: RegExp = /:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/g;
    const match = hostPort.exec(currHostUri);
    if (this.portRegex.exec(this.hostPort)) {
      if (match && match[1].length > 0) {
        this.hostUri = this.hostUri.replace(/([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/g,
                                            this.hostPort);
      } else if (!match) {
        this.hostUri = `${currHostUri}:${this.hostPort}`;
      }
    } else if (this.hostPort === '') {
      this.hostUri = this.hostUri.replace(/:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/g, '');
    }
  }

  /**
   * Sets the mode to add mode.
   */
  setAddMode() {
    this.addMode = true;
    this.portFormControl.disable();
  }

  /**
   * Disables the add mode.
   */
  disableAddMode() {
    this.addMode = false;
    this.errMsg = undefined;
    this.hostUri = undefined;
    this.hostPort = undefined;
  }

  /**
   * Checks if the form is valid or not.
   */
  isFormInvalid() {
    return !(this.hostUriRegex.exec(this.hostUri) && this.portRegex.exec(this.hostPort));
  }

  /**
   * Checks if there were changes.
   */
  checkChanges() {
    return (arraysEqual(clientDataToArray(this.CLIENT_DATA), this.client.hostUris));
  }

  /**
   * Updates a client.
   */
  updateClient() {
    const arrayToUpdate = clientDataToArray(this.CLIENT_DATA);
    this.client.hostUris = arrayToUpdate.slice(0);
    this.clientsService.updateClient(this.client.clientId, {
      redirectUris: this.client.redirectUris,
      hostUris: this.client.hostUris,
    }).subscribe((data) => {
      if (data) {
        this.dialogRef.close(this.client.hostUris);
        this.snackBar.open('Client was updated successfuly', '', {
          duration: 2000
        });
      }
    });
  }

  /**
   * Copy text to clipboard.
   * @param item - The text to copy.
   */
  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
}

/**
 * Checks if two arrays that were given are equal.
 * @param firstArray - First Array
 * @param secondArray - Second Array
 */
function arraysEqual(firstArray, secondArray) {
  if (firstArray && secondArray) {
    return JSON.stringify(firstArray.sort()) === JSON.stringify(secondArray.sort());
  }

  return false;
}

/**
 * Transforms client data to an array.
 * @param clientData - The given data.
 */
function clientDataToArray(clientData) {
  const currArray: string[] = [];

  clientData.forEach((currClient) => {
    currArray.push(`${currClient.hostUri}:${currClient.hostPort}`);
  });

  return currArray;
}
