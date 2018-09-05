// app.component

import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sidenav = true;
  title = 'app';

  openSideNav(event) {
    this.sidenav = event;
  }
}
