import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scope-new-permitted-client',
  templateUrl: './scope-new-permitted-client.component.html',
  styleUrls: ['./scope-new-permitted-client.component.css']
})
export class ScopeNewPermittedClientComponent implements OnInit {
  myControl = new FormControl();
  @ViewChild('inputSelected') input: MatInput;
  selectedClientId: string;
  selectedClient;

  constructor(public dialogRef: MatDialogRef<ScopeNewPermittedClientComponent>) { }
  
  loadingClients = true;
  clients = [{
              id: '1',
              clientName: 'Drive',
              teamName: 'KrakenTeam',
              clientDesc: 'Cool client that is cool very much and'
            },
            {
              id: '2',
              clientName: 'DriveInteg',
              teamName: 'KrakenTeam',
              clientDesc: 'Integration cool that is very cool and no one knows what to do'
            },
            {
              id: '3',
              clientName: 'Karting',
              teamName: 'KartoffelTeam',
              clientDesc: 'Its a karting game ofcourse'
            },
            ];
  filteredClients = [];

  ngOnInit(): void {
    this.loadingClients = false;
    setTimeout(() => { this.input.focus() }, 200);

    
    const input: any = document.getElementById('client-input');

    // Init a timeout variable to be used below
    let timeout = null;
    const regex = /^[a-zA-Zא-ת]$/m;

    // Listen for keystroke events
    input.addEventListener('keyup', (e) => {
      // Clear the timeout if it has already been set.
      // This will prevent the previous task from executing
      // if it has been less than <MILLISECONDS>
      clearTimeout(timeout);
      if (regex.test(e.key) || e.key === 'Backspace' || e.key === 'Delete') {
          // Make a new timeout set to go off in 1000ms (1 second)
          timeout = setTimeout(() => {
            this.getFilteredClients();
        }, 300);
      }
    });
  }

  getFilteredClients() {

  }
  
  close() {
    this.dialogRef.close(false);
  }

  selectClient(clientId) {
    this.selectedClientId = clientId;

    for (const currClient of this.clients) {
      if (currClient.id === clientId) {
        this.selectedClient = currClient;
        this.myControl.setValue(currClient.clientName);
      }
    }

  }

  addClient() {
    this.dialogRef.close(this.selectedClient);
  }

  isFormValid() {
    return true;
  }
}
