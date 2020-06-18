import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ScopeNewPermittedClientComponent } from './scope-new-permitted-client/scope-new-permitted-client.component';
import { ScopesService } from '../scopes.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-scope-management-modal',
  templateUrl: './scope-management-modal.component.html',
  styleUrls: ['./scope-management-modal.component.css']
})
export class ScopeManagementModalComponent implements OnInit {
  scope;
  
  constructor(
    private scopeAddClientDialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ScopeManagementModalComponent>,
    private scopeService: ScopesService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.scope = data.scope;
      if (data.isEmptyClients) {
        setTimeout(() => {this.openAddClient()}, 350);
      }
    }

  ngOnInit(): void {
  }

  removeClient(permittedClient) {
    for (const [index, currClient] of this.scope.permittedClients.entries()) {
      if (permittedClient.id === currClient.id) {
        this.scope.permittedClients.splice(index, 1);

        this.scopeService.updateScope(this.scope);

        this.snackBar.open('Permitted Client Was Removed Successfully', '', {
          duration: 2000
        });
      }
    }
  }

  async openAddClient() {
    const dialogRef = this.scopeAddClientDialog.open(ScopeNewPermittedClientComponent, {
        width: '380px',
        height: '260px'
    });

    const returnedClient = await dialogRef.afterClosed().toPromise();
    if (returnedClient) {
      this.scope.permittedClients.push(returnedClient);

      this.scopeService.updateScope(this.scope);

      this.snackBar.open('Permitted Client Was Added Successfully', '', {
        duration: 2000
      });
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
