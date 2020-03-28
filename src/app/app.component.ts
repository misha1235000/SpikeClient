// app.component

import { Component, OnInit } from '@angular/core';
import { PublicFunctions } from './shared/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SpikeClient';

  ngOnInit() {
    PublicFunctions.checkLogin();
  }
}
