import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-verify-client-reset',
  templateUrl: './verify-client-reset.component.html',
  styleUrls: ['./verify-client-reset.component.css']
})
export class VerifyClientResetComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VerifyClientResetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: boolean) {}

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close(false);
  }

  verifyReset(): void {
    this.dialogRef.close(true);
  }

}
