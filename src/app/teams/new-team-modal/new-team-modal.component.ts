// login.component

import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-new-team-modal',
  templateUrl: './new-team-modal.component.html',
  styleUrls: ['./new-team-modal.component.css']
})
export class NewTeamModalComponent implements OnInit {
  @ViewChild('inputSelected') input: MatInput;

  /**
   * The constructor of the NewTeamModalComponent
   * @param authService - The auth service that will be used for creating a team.
   * @param dialogRef - The Dialog reference.
   * @param formBuilder - The form builder.
   * @param data - The data that was given to the modal.
   */
  constructor(private authService: AuthService, private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<NewTeamModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.user = data.user;
              }

  teamnameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9]{4,40}$'),
  ]);

  descFormControl = new FormControl('', [
  ]);

  user;
  team;
  loginFormGroup: FormGroup;
  teamName: string;
  desc: string;
  errorMsg: string;

  /**
   * Create a new team.
   */
  async addTeam() {
    this.teamName = this.loginFormGroup.value.teamname;
    this.desc = this.loginFormGroup.value.desc;
    try {
      const data: any = await this.authService.registerTeam(
        {
          teamname: this.teamName,
          desc: this.desc,
          ownerId: this.user.genesisId
        }).toPromise();
      this.errorMsg = undefined;
      this.dialogRef.close({ team: data.createdTeam });
    } catch (error) {
      this.errorMsg = error.message;
    }
  }

  /**
   * Closes the dialog (with a false value)
   */
  close(): void {
    this.dialogRef.close(false);
  }

  /**
   * When the component intializes, init the login form group with necessary validators.
   */
  ngOnInit() {
    setTimeout(() => { this.input.focus(); }, 200);
    this.loginFormGroup = this.formBuilder.group({
      teamname: this.teamnameFormControl,
      desc: this.descFormControl
    });
  }

  /**
   * Checks whether there is any error in any input
   */
  isDetailsValid() {
    return this.loginFormGroup.status !== 'INVALID';
  }
}
