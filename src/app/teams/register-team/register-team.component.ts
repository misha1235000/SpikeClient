// register-team.component

import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { PublicFunctions } from '../../shared/shared';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamJoinInfoModalComponent } from 'src/app/teams/team-join-info-modal/team-join-info-modal.component';

@Component({
  selector: 'app-register-team',
  templateUrl: './register-team.component.html',
  styleUrls: ['./register-team.component.css']
})
export class RegisterTeamComponent implements OnInit {
  /**
   * The constructor of the component
   * @param authService - The service that will be used for creating a team.
   * @param router - The router.
   * @param sharedService - The shared service.
   * @param formBuilder - The form builder.
   * @param teamJoinInfoDialog - The dialog of the team join info.
   */
  constructor(private authService: AuthService, private formBuilder: FormBuilder,
              private router: Router, private sharedService: SharedService,
              private teamJoinInfoDialog: MatDialog) { }

  teamnameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9]{4,40}$'),
  ]);

  descFormControl = new FormControl('', [
  ]);

  user;
  team: any = [];
  registerTeamFormGroup: FormGroup;
  isLogged: boolean;
  teamName: string;
  desc: string;
  errorMsg: string;

  /**
   * Create a new team with the details given.
   */
  async registerTeam() {
    this.teamName = this.registerTeamFormGroup.value.teamname;
    this.desc = this.registerTeamFormGroup.value.desc;
    const data = await this.authService.registerTeam({
                                                      teamname: this.teamName,
                                                      desc: this.desc,
                                                      ownerId: this.user.genesisId
                                                    }
    ).toPromise().catch((error) => {
      this.errorMsg = error.message;
    });

    if (data) {
      if (data.auth) { // If the server returned that the token is authorized.
        this.errorMsg = undefined;
        this.sharedService.setData = data;
        this.router.navigateByUrl('/clients');
      } else {
        this.errorMsg = data.message;
      }
    }
  }

  /**
   * When the component intializes, init the registerFormGroup with necessary validators.
   */
  ngOnInit() {
    this.user = PublicFunctions.DecodeJwt();
    this.registerTeamFormGroup = this.formBuilder.group({
      teamname: this.teamnameFormControl,
      desc: this.descFormControl
    });

    if (this.user) {
      this.authService.getTeams(this.user.genesisId).subscribe((data) => {
        if (data && data.teams && data.teams.length > 0) { // If the server returned that the teams were given back.
          this.team = data.teams;
          this.sharedService.setData = this.team;
          this.router.navigateByUrl('/teams');
        } else {
          this.team = null;
          // console.log('no data');
        }
      }, (error) => {
        this.team = [];
        console.log(error);
      });
    } else {
    }
  }

  /**
   * Checks whether there is any error in any input
   */
  isDetailsValid() {
    return this.registerTeamFormGroup.status !== 'INVALID';
  }

  /**
   * Opens the register dialog.
   */
  openInfo() {
    this.teamJoinInfoDialog.open(TeamJoinInfoModalComponent,
      {
        width: '500px',
        height: '300px',
      }
    );
  }
}
