import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../node_modules/@angular/material';

@Component({
  selector: 'app-open-login',
  templateUrl: './open-login.component.html',
  styleUrls: ['./open-login.component.css']
})
export class OpenLoginComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OpenLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}



  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }

}
