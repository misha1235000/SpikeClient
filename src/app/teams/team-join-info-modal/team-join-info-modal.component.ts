// team-join-info-modal.component

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-team-join-info-modal',
  templateUrl: './team-join-info-modal.component.html',
  styleUrls: ['./team-join-info-modal.component.css']
})
export class TeamJoinInfoModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TeamJoinInfoModalComponent>) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
