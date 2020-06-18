import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scope-verify-delete-modal',
  templateUrl: './scope-verify-delete-modal.component.html',
  styleUrls: ['./scope-verify-delete-modal.component.css']
})
export class ScopeVerifyDeleteModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ScopeVerifyDeleteModalComponent>) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close(false);
  }
  
  verifyDelete(): void {
  this.dialogRef.close(true);
  }
}
