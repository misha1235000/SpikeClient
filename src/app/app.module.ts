// app.module

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatToolbarModule, MatDividerModule, MatIconModule,
        MatSnackBarModule, MatTooltipModule, MatDialogModule, MatProgressSpinnerModule, MatSidenavModule, MatCheckboxModule,
        MatListModule, MatExpansionModule} from '@angular/material';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginService } from './login/login.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TokensComponent } from './tokens/tokens.component';
import { OpenRegisterComponent } from './open-register/open-register.component';
import { OpenRegisterService } from './open-register/open-register.service';
import { SidenavService } from './sidenav/sidenav.service';

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
    OpenRegisterComponent
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
  entryComponents: [OpenRegisterComponent],
  providers: [LoginService, FormBuilder, OpenRegisterService, SidenavService],
  bootstrap: [AppComponent]
})
export class AppModule { }
