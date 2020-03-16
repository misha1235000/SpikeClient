// toolbar.component

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() sidenavOpened = new EventEmitter();
  @Input() sidenav;
  @Input() user;
  isLogged = false;
  isOpened = true;

  /**
   * Constructor.
   */
  constructor() { }

  /**
   * When the component initializes, check if the team account logged in.
   */
  ngOnInit() {
  }

  /**
   * Opens or closes sidenav.
   */
  toggleSidenav() {
    this.isOpened = !this.isOpened;
    this.sidenavOpened.emit(this.isOpened);
  }
}
