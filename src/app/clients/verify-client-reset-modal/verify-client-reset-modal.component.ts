// verify-client-reset-modal.component

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-verify-client-reset-modal',
  templateUrl: './verify-client-reset-modal.component.html',
  styleUrls: ['./verify-client-reset-modal.component.css']
})
export class VerifyClientResetModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VerifyClientResetModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: boolean) {}

  ngOnInit(): void {
  }

  /**
   * Close the dialog
   */
  close(): void {
    this.dialogRef.close(false);
  }

  /**
   * Verify the reset, and close the dialog.
   */
  verifyReset(): void {
    this.dialogRef.close(true);
  }
}
