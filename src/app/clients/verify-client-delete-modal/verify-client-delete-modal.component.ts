// verify-client-delete-modal.component

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-verify-client-delete-modal',
  templateUrl: './verify-client-delete-modal.component.html',
  styleUrls: ['./verify-client-delete-modal.component.css']
})
export class VerifyClientDeleteModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VerifyClientDeleteModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: boolean) {}

  ngOnInit() {}

  close(): void {
  this.dialogRef.close(false);
  }

  verifyDelete(): void {
  this.dialogRef.close(true);
  }

}
