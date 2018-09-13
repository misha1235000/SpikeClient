// app.module

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatToolbarModule, MatDividerModule, MatIconModule,
        MatSnackBarModule, MatTooltipModule, MatDialogModule, MatProgressSpinnerModule, MatSidenavModule, MatCheckboxModule,
        MatListModule, MatExpansionModule, MatChipsModule} from '@angular/material';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TokensComponent } from './tokens/tokens.component';
import { OpenRegisterClientComponent } from './auth/open-register-client/open-register-client.component';
import { OpenRegisterTeamComponent} from './auth/open-register-team/open-register-team.component';
import { AuthService } from './auth/auth.service';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tokens', component: TokensComponent },
  { path: '',
    redirectTo: '/tokens',
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
    TokensComponent,
    OpenRegisterClientComponent,
    OpenRegisterTeamComponent,
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
    MatListModule,
    MatExpansionModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  entryComponents: [OpenRegisterClientComponent, OpenRegisterTeamComponent],
  providers: [FormBuilder, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
