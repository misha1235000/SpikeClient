// login.component

import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { PublicFunctions } from '../../shared/shared';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /**
   * The constructor of the component
   * @param loginService - The login service that will be used for the login.
   * @param snackBar - The snackbar that will be useed.
   * @param _formBuilder - The form builder.
   */
  constructor(private authService: AuthService, private formBuilder: FormBuilder,
              private router: Router, private sharedService: SharedService) { }

  teamnameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9]{1,40}$'),
  ]);

  descFormControl = new FormControl('', [
  ]);

  user;
  team;
  loginFormGroup: FormGroup;
  isLogged: boolean;
  teamName: string;
  desc: string;
  errorMsg: string;

  /**
   * Logins to a team with the details given.
   */
  login() {
    this.teamName = this.loginFormGroup.value.teamname;
    this.desc = this.loginFormGroup.value.desc;
    this.authService.registerTeam({'teamname': this.teamName, 'desc': this.desc, 'ownerId': this.user.email}).subscribe((data) => {
      if (data.auth) { // If the server returned that the login authorized.
        this.errorMsg = undefined;
        this.sharedService.setData = data;
        this.router.navigateByUrl('/clients');
      } else {
        this.errorMsg = data.message;
      }
    }, (error) => {
      this.errorMsg = error.message;
    });
  }

  /**
   * When the component intializes, init the login form group with necessary validators.
   */
  ngOnInit() {
    this.user = PublicFunctions.DecodeJwt();
    this.loginFormGroup = this.formBuilder.group({
      teamname: this.teamnameFormControl,
      desc: this.descFormControl
    });

    if (this.user) {
      this.authService.getTeams(this.user.email).subscribe((data) => {
        if (data && data.teams && data.teams.length > 0) { // If the server returned that the login authorized.
          this.team = data.teams;
          this.sharedService.setData = this.team;
          this.router.navigateByUrl('/clients');
        } else {
          console.log('no data');
        }
      }, (error) => {
        console.log(error);
      });
    } else {
      
    }
  }

  /**
   * Checks whether there is any error in any input
   */
  isDetailsValid() {
    return this.loginFormGroup.status !== 'INVALID';
  }

    /**
   * Opens the register dialog.
   */
  openRegister() {
    
  }
}
