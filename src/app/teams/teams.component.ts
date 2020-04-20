// teams.component

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { AuthService } from '../auth/auth.service';
import { PublicFunctions } from '../shared/shared';
import { MatDialog } from '@angular/material/dialog';
import { NewTeamModalComponent } from './new-team-modal/new-team-modal.component';
import { TeamManagementModalComponent } from './team-management-modal/team-management-modal.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  user;
  teams;
  public get getTeam() { return this.teams; }
  public set setTeam(newValue) {
    // logic
    this.teams = newValue;
  }

  /**
   * The constructor of TeamsComponent.
   * @param router - The router from routing purposes.
   * @param sharedService - The shared service.
   * @param authService - The authenticate service.
   * @param newTeamDialog - The dialog of creating a new team.
   * @param teamManagementDialog - The dialog of managing a team.
   */
  constructor(private router: Router,
              private sharedService: SharedService,
              private authService: AuthService,
              private newTeamDialog: MatDialog,
              private teamManagementDialog: MatDialog) { }

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
      } else {
        this.router.navigateByUrl('/register');
      }
    }
  }

  /**
   * Opens the dialog of a team management.
   * @param team - The team to manage.
   */
  async openTeamManagement(team) {
    const dialogRef = this.teamManagementDialog.open(TeamManagementModalComponent, {
      width: '700px',
      height: '800px',
      data: {
        team,
        user: this.user,
      }
    });

    await dialogRef.afterClosed().toPromise();
  }

  /**
   * Opens the dialog for creating a new team.
   */
  async openNewTeam() {
    const dialogRef = this.newTeamDialog.open(NewTeamModalComponent, {
      width: '450px',
      height: '390px',
      data: {
        user: this.user,
      }
    });

    const data = await dialogRef.afterClosed().toPromise();

    if (data && data.team) {
      this.teams.push({
        ...data.team,
        users: [{userId: data.team.ownerId, isAdmin: true}],
        isAdmin: true,
        ownerName: `${ this.user.name.firstName } ${ this.user.name.lastName }`
      });
    }
  }
}
