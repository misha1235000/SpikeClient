// team-management-modal.component

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TeamsService } from '../teams.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../shared.service';
import { TeamAddPersonModalComponent } from './team-add-person-modal/team-add-person-modal.component';

@Component({
  selector: 'app-team-management-modal',
  templateUrl: './team-management-modal.component.html',
  styleUrls: ['./team-management-modal.component.css']
})
export class TeamManagementModalComponent implements OnInit {
  doneLoading = false;
  team;
  user;

  /**
   * Constructor of TeamManagementModalComponent
   * @param teamsService - The Team Service.
   * @param snackBar - Material Snackbar.
   * @param sharedService - Shared Service.
   * @param dialogRef - The dialog reference.
   * @param data - Data given.
   */
  constructor(private teamsService: TeamsService,
              private snackBar: MatSnackBar,
              private sharedService: SharedService,
              private teamAddPersonDialog: MatDialog,
              public dialogRef: MatDialogRef<TeamManagementModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.team = data.team;
                this.user = data.user;
              }

  /**
   * On the initialize of the component
   * Sets a new object of users to work with it.
   */
  async ngOnInit() {
    this.team.users = [];
    for (const userId of this.team.userIds) {
      this.team.users.push({ id: userId, isAdmin: false });
    }

    for (const userId of this.team.adminIds) {
      this.team.users.push({ id: userId, isAdmin: true });
    }

    const persons = await this.sharedService.getPersonsByPersonIds(this.team.users.map(currUser => currUser.id)).toPromise();

    for (const userId of this.team.userIds) {
      this.team.users.push({ id: userId, isAdmin: false });
    }

    for (const userId of this.team.adminIds) {
      this.team.users.push({ id: userId, isAdmin: true });
    }

    for (const [index, person] of persons.entries()) {
      if (this.team.adminIds.includes(person.id)) {
        persons[index].isAdmin = true;
      } else if (this.team.userIds.includes(person.id)) {
        persons[index].isAdmin = false;
      }
    }

    this.team.users = persons;
    this.doneLoading = true;
  }

  /**
   * Closes the dialog (with a false value)
   */
  close(): void {
    this.dialogRef.close(false);
  }

  /**
   * Removes a person from a team.
   * @param user - The person to remove
   */
  async removePerson(user) {
    if (user.isAdmin) {
      const adminIndex = this.team.adminIds.indexOf(user.id);

      this.team.adminIds.splice(adminIndex, 1);
    } else {
      const userIndex = this.team.userIds.indexOf(user.id);

      this.team.userIds.splice(userIndex, 1);
    }

    for (const [index, currUser] of this.team.users.entries()) {
        if (currUser.id === user.id) {
          this.team.users.splice(index, 1);
          break;
        }
    }

    const data = await this.teamsService.updateTeam(this.team).toPromise();

    if (data) {
      this.snackBar.open('Person was removed Successfully', '', {
        duration: 2000
      });
    }
  }

  /**
   * Changes permission of a dedicated person.
   * @param user - The person to set permission to.
   */
  async setPermission(user) {
    if (user.isAdmin) {
      for (let currUser = 0; currUser < this.team.adminIds.length; currUser++) {
        if (user.id === this.team.adminIds[currUser]) {
          this.team.adminIds.splice(currUser, 1);
          this.team.userIds.push(user.id);
          this.team = this.team;
          break;
        }
      }
    } else {
      for (let currUser = 0; currUser < this.team.userIds.length; currUser++) {
        if (user.id === this.team.userIds[currUser]) {
          this.team.userIds.splice(currUser, 1);
          this.team.adminIds.push(user.id);
          this.team = this.team;
          break;
        }
      }
    }

    this.team.users.map((currUser) => {
      if (currUser.id === user.id) {
        return currUser.isAdmin = !currUser.isAdmin;
      }
    });

    const data = await this.teamsService.updateTeam(this.team).toPromise();
    if (data) {
      this.snackBar.open('Person was updated Successfully', '', {
        duration: 2000
      });
    }
  }

  /**
   * Sets the state to 'Add State'
   */
  async addPerson() {
    const addPersonDialogRef = this.teamAddPersonDialog.open(TeamAddPersonModalComponent,
                               {
                                 width: '380px',
                                 height: '260px',
                                 data: {
                                   team: this.team,
                                 }
                               });

    const personReturned = await addPersonDialogRef.afterClosed().toPromise();

    if (personReturned) {
      if (personReturned.id !== '') {
          this.team.userIds.push(personReturned.id);
          this.team.users.push({...personReturned, isAdmin: false });

          const data = await this.teamsService.updateTeam(this.team).toPromise();

          if (data) {
            this.snackBar.open('Person was added Successfully', '', {
              duration: 2000
            });
          }
        }
      }
    }
}
