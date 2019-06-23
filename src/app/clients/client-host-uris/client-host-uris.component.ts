import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-client-host-uris',
  templateUrl: './client-host-uris.component.html',
  styleUrls: ['./client-host-uris.component.css']
})

export class ClientHostUrisComponent implements OnInit {
  client;
  CLIENT_DATA = [];
  displayedColumns: string[] = ['hostUri', 'hostPort'];
  dataSource;

  constructor(public dialogRef: MatDialogRef<ClientHostUrisComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.client = data.client;
                this.client.hostUris.forEach(hostUri => {
                  this.CLIENT_DATA.push({ hostUri: `${hostUri.split(':')[0]}:${hostUri.split(':')[1]}` , hostPort: `${hostUri.split(':')[2]}` });
                });

                this.dataSource = new MatTableDataSource(this.CLIENT_DATA);
              }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.CLIENT_DATA);
  }

  close(): void {
    this.dialogRef.close(false);
  }

  verifyDelete(): void {
    this.dialogRef.close(true);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
