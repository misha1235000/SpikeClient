// toolbar.component

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '../../../node_modules/@angular/material';
import { PublicFunctions } from '../shared/shared';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() sidenavOpened = new EventEmitter();
  @Input() sidenav;
  isLogged = false;
  isOpened = true;

  /**
   * Initializes the needed services.
   * @param dialog - The Dialog service.
   */
  constructor(public dialog: MatDialog) { }

  /**
   * When the component initializes, check if the team account logged in.
   */
  ngOnInit() {
    this.isLogged = PublicFunctions.checkLogin();
  }

  /**
   * Opens or closes sidenav.
   */
  toggleSidenav() {
    this.isOpened = !this.isOpened;
    this.sidenavOpened.emit(this.isOpened);
  }
}
