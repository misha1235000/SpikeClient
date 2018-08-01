import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatToolbarModule, MatDividerModule, MatIconModule, MatSnackBarModule, MatTooltipModule, MatDialogModule } from '@angular/material';
//import { RegisterService } from './register/login.service';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';
import { OpenLoginComponent } from './open-login/open-login.component';

const appRoutes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '',
    redirectTo: '/register',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    RegisterComponent,
    LoginComponent,
    PageNotFoundComponent,
    OpenLoginComponent
  ],
  imports: [
    BrowserModule,
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
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  entryComponents: [OpenLoginComponent],
  providers: [LoginService, RegisterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
