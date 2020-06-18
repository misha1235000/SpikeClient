import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-team-add-person-modal',
  templateUrl: './team-add-person-modal.component.html',
  styleUrls: ['./team-add-person-modal.component.css']
})
export class TeamAddPersonModalComponent implements OnInit {
  @ViewChild('inputSelected') input: MatInput;
  doneLoading = false;
  isAddState: boolean;
  selectedPerson: any = {};
  selectedPersonId = '';
  loadingPersons = false;
  myControl = new FormControl();
  filteredPersons: any;
  team;

  constructor(public dialogRef: MatDialogRef<TeamAddPersonModalComponent>,
              private sharedService: SharedService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.team = data.team;
              }

  ngOnInit(): void {
    setTimeout(() => {
      this.input.focus();
    }, 200);

    const input: any = document.getElementById('person-input');

    // Init a timeout variable to be used below
    let timeout = null;
    const regex = /^[a-zA-Zא-ת]$/m;

    // Listen for keystroke events
    input.addEventListener('keyup', (e) => {
        // Clear the timeout if it has already been set.
        // This will prevent the previous task from executing
        // if it has been less than <MILLISECONDS>
        clearTimeout(timeout);
        if (regex.test(e.key) || e.key === 'Backspace' || e.key === 'Delete') {
            // Make a new timeout set to go off in 1000ms (1 second)
            timeout = setTimeout(() => {
              this.getPersons();
          }, 300);
        }
    });
  }

  /**
   * Gets persons by fullname.
   */
  async getPersons() {
    this.selectedPerson = {};
    this.selectedPersonId = '';

    if (this.myControl && this.myControl.value) {
      if (this.myControl.value.length >= 2) {
        this.loadingPersons = true;
        const result = await this.sharedService.getPersons(this.myControl.value).toPromise();

        for (const [xIndex, currPerson] of result.entries()) {
          for (const currTeamPerson of this.team.users) {
            if (currPerson.id === currTeamPerson.id) {
              result[xIndex] = null;
            }
          }
        }

        const filtered = result.filter((element) => {
          return element != null;
        });

        this.filteredPersons = filtered;
        this.loadingPersons = false;
      } else {
        this.filteredPersons = [];
      }
    } else {
      this.filteredPersons = [];
    }
  }

  /**
   * Closes the dialog (with a false value)
   */
  close(): void {
    this.dialogRef.close(false);
  }

  addPerson(): void {
    this.dialogRef.close(this.selectedPerson);
  }

  /**
   * Checks if the form is valid.
   */
  isFormValid(): boolean {
    if (this.selectedPerson.id) {
      return true;
    }

    return false;
  }

  /**
   * Selects a person (When pressing on him in the autoSelect)
   * @param selectedPerson - The person to select
   */
  selectPerson(selectedPerson) {
    this.selectedPersonId = selectedPerson;

    for (const currPerson of this.filteredPersons) {
      if (currPerson.id === selectedPerson) {
        this.selectedPerson = currPerson;
        this.myControl.setValue(currPerson.fullName);
      }
    }
  }
}
