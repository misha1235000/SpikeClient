import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-new-scope-modal',
  templateUrl: './new-scope-modal.component.html',
  styleUrls: ['./new-scope-modal.component.css']
})
export class NewScopeModalComponent implements OnInit {
  @ViewChild('inputSelected') input: MatInput;
  
  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<NewScopeModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.user = data.user;
              }

  scopeNameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9]{3,30}$'),
  ]);

  descFormControl = new FormControl('', [
  ]);

  clientFormControl = new FormControl('', [
    Validators.required,
  ]);

  user;
  team;
  scopeFormGroup: FormGroup;
  teamName: string;
  desc: string;
  errorMsg: string;
  privateActive: string = 'active-class';
  publicActive: string = 'inactive-class'; 

  selectedClient;
  clients = [{id: '1', name: 'SpikeDev'}, {id: '2', name: 'SpikeProd'}, {id: '3', name: 'SpikeInteg'}];

  ngOnInit(): void {
    setTimeout(() => { this.input.focus(); }, 250);
    this.scopeFormGroup = this.formBuilder.group({
      scopeName: this.scopeNameFormControl,
      desc: this.descFormControl,
      client: this.clientFormControl,
    });
  }

  close() {
    this.dialogRef.close(false);
  }

  changeActive() {
    if (this.privateActive === 'active-class') {
      this.privateActive = 'inactive-class';
      this.publicActive = 'active-class';
    } else {
      this.publicActive = 'inactive-class';
      this.privateActive = 'active-class';
    }
  }

  /**
   * Checks whether there is any error in any input
   */
  isDetailsValid() {
    return this.scopeFormGroup.status !== 'INVALID';
  }

  addScope() {
    this.dialogRef.close({
      id: Math.random().toString(36).substring(7),
      scopeName: this.scopeFormGroup.value.scopeName,
      accessType: this.privateActive === 'active-class' ? 'Private' : 'Public',
      clientName: this.selectedClient,
      scopeOwner: this.user.fullName || `${this.user.name.firstName} ${this.user.name.lastName}`,
      scopeDesc: this.scopeFormGroup.value.desc,
      permittedClients: []
    })
  }
}
