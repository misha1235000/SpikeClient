// app.module

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatToolbarModule, MatDividerModule, MatIconModule,
        MatSnackBarModule, MatTooltipModule, MatDialogModule, MatProgressSpinnerModule, MatSidenavModule, MatCheckboxModule,
        MatListModule, MatExpansionModule, MatChipsModule, MatProgressBarModule, MatSlideToggleModule, MatSelectModule, MatTableModule, MatPaginatorModule,
        MatSortModule } from '@angular/material';
import {MatBadgeModule} from '@angular/material/badge';
import { AvatarModule } from 'ng2-avatar';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ClientsComponent } from './clients/clients.component';
import { OpenRegisterClientComponent } from './auth/open-register-client/open-register-client.component';
import { OpenRegisterTeamComponent} from './auth/open-register-team/open-register-team.component';
import { AuthService } from './auth/auth.service';
import { ClientsService } from './clients/clients.service';
import {enableProdMode} from '@angular/core';
import { VerifyDeleteComponent } from './clients/verify-delete/verify-delete.component';
import { ClientHostUrisComponent } from './clients/client-host-uris/client-host-uris.component';

enableProdMode();
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'clients', component: ClientsComponent },
  { path: '',
    redirectTo: '/clients',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LoginComponent,
    PageNotFoundComponent,
    LoginComponent,
    SidenavComponent,
    ClientsComponent,
    OpenRegisterClientComponent,
    OpenRegisterTeamComponent,
    VerifyDeleteComponent,
    ClientHostUrisComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatDividerModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatListModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatBadgeModule,
    MatRippleModule,
    MatTableModule,
    MatPaginatorModule,
    // MatSortModule,
    AvatarModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  entryComponents: [OpenRegisterClientComponent, OpenRegisterTeamComponent, VerifyDeleteComponent, ClientHostUrisComponent],
  providers: [FormBuilder, AuthService, ClientsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
