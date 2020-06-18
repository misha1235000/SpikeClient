// scopes.component

import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from '../shared.service';
import { MatSort } from '@angular/material/sort';
import { PublicFunctions } from '../shared/shared';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { NewScopeModalComponent } from './new-scope-modal/new-scope-modal.component';
import { ScopeManagementModalComponent } from './scope-management-modal/scope-management-modal.component';
import { ScopeVerifyDeleteModalComponent } from './scope-verify-delete-modal/scope-verify-delete-modal.component';
import { ScopesService } from './scopes.service';
import { MatSnackBar } from '@angular/material/snack-bar';

const ELEMENT_DATA: any = [
  { id: '0', scopeName: 'Test', accessType: 'Private',
    clientName: 'Spike', scopeOwner: 'שקד מנס',
    scopeDesc: 'Just testing this scope',
    permittedClients: [
      { id: '9', clientName: 'Drive', clientDesc: 'A cool application', teamName: 'KrakenTeam'},
      { id: '10', clientName: 'Dropbox', clientDesc:  'It drops a box', teamName: 'Kumar'},
      { id: '11', clientName: 'DriveInteg', clientDesc:  'It Integs Drive Crazy like', teamName: 'KrakenTeam'}
    ]
  },
  { id: '1', scopeName: 'Write', accessType: 'Private',
    clientName: 'Spike', scopeOwner: 'שקד מנס',
    scopeDesc: 'Write permission',
    permittedClients: [
      { id: '12', clientName: 'Drive', clientDesc: 'A cool application', teamName: 'KrakenTeam'},
      { id: '13', clientName: 'Dropbox', clientDesc:  'It drops a box', teamName: 'Kumar'}
    ]
  },
  { id: '2', scopeName: 'Read', accessType: 'Public', clientName: 'Spike', scopeOwner: 'שקד מנס', scopeDesc: 'Read all files', permittedClients: [] },
];

@Component({
  selector: 'app-scopes',
  templateUrl: './scopes.component.html',
  styleUrls: ['./scopes.component.css']
})

export class ScopesComponent implements OnInit {
  displayedColumns: string[] = ['scopeName', 'accessType', 'clientName', 'scopeOwner', 'scopeDesc', 'permittedClients', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  // @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
        this.dataSource.sort = sort;
  }

  user;
  teams;
  isDone = false;

  public get getTeam() { return this.teams; }
  public set setTeam(newValue) {
    this.teams = newValue;
  }

  constructor(private sharedService: SharedService,
              private authService: AuthService,
              private scopeService: ScopesService,
              private router: Router,
              private newScopeDialog: MatDialog,
              private scopeManagementDialog: MatDialog,
              private verifyDeleteDialog: MatDialog,
              private snackBar: MatSnackBar) { }

  /**
   * When the component initilizes,
   * Check whether there is an authorization cookie,
   * and get all the neccessery data (User and Teams).
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
      const data = await this.authService.getTeams(this.user.genesisId).toPromise();
      if (data && data.teams && data.teams.length > 0) {
        this.sharedService.setData = data.teams;
        this.teams = data.teams;

        for (const [teamIndex, team] of this.teams.entries()) {
          this.teams[teamIndex].isAdmin = false;

          for (const adminId of team.adminIds) {
            if (adminId === this.user.genesisId) {
              this.teams[teamIndex].isAdmin = true;
              break;
            }
          }
        }

        this.isDone = true;
        
      } else {
        this.router.navigateByUrl('/register');
      }
    }
  }

  async removeScope(scope) {
    const dialogRef = this.verifyDeleteDialog.open(ScopeVerifyDeleteModalComponent, {
      width: '420px',
      height: '220px'
    });

    let savedIndex: number;
    let savedClient;

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      const removedScope = this.scopeService.removeScope().toPromise();
      if (removedScope) {
        for (const [scopeIndex, currScope] of (this.dataSource.data as any).entries()) {
          if (currScope.id === scope.id) {
            this.dataSource.data.splice(scopeIndex, 1);
            this.dataSource._updateChangeSubscription();
            savedIndex = scopeIndex;
            savedClient = currScope;
          }
        }

        const timer = setTimeout(async () => {
          await this.scopeService.removeScope().toPromise();
        }, 5000);
        this.snackBar.open('Scope was removed successfuly', 'Undo', {
          duration: 5000
        }).onAction().subscribe(() => {
          this.dataSource.data.splice(savedIndex, 0, savedClient);
          this.dataSource._updateChangeSubscription();
          clearTimeout(timer);
        });
      }
    }
  }

  /**
   * Gets all the scopes related to the teams according to the ADFS.
   */
  getScopes(): void {
  }

  /**
   * Opens the add new scope modal.
   */
  async openNewScope() {
    const dialogRef = this.newScopeDialog.open(NewScopeModalComponent, {
      width: '450px',
      height: '480px',
      data: {
        user: this.user,
      }
    });

    const data = await dialogRef.afterClosed().toPromise();
    
    if (data) {
      this.dataSource.data.push(data);
      this.dataSource._updateChangeSubscription();
    }
  }

  async openManageScope(scope) {
    const dialogRef = this.scopeManagementDialog.open(ScopeManagementModalComponent, {
      width: '700px',
      height: '800px',
      data: {
        scope,
        isEmptyClients: scope.permittedClients.length === 0 ? true : false
      }
    });
    
    await dialogRef.afterClosed().toPromise();
  }
}
