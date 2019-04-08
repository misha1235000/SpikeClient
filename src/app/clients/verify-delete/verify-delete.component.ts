import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-verify-delete',
  templateUrl: './verify-delete.component.html',
  styleUrls: ['./verify-delete.component.css']
})
export class VerifyDeleteComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VerifyDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: boolean) {}

  ngOnInit() {}

  close(): void {
    this.dialogRef.close(false);
  }

  verifyDelete(): void {
    this.dialogRef.close(true);
  }
}
