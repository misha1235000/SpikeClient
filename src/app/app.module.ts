// app.module

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// import { AvatarModule } from 'ng2-avatar';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared-module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientsComponent } from './clients/clients.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterClientModalComponent } from './auth/register-client-modal/register-client-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VerifyClientResetModalComponent } from './clients/verify-client-reset-modal/verify-client-reset-modal.component';
import { VerifyClientDeleteModalComponent } from './clients/verify-client-delete-modal/verify-client-delete-modal.component';
import { ClientHostUrisModalComponent } from './clients/client-host-uris-modal/client-host-uris-modal.component';
import { AuthService } from './auth/auth.service';
import { ClientsService } from './clients/clients.service';

@NgModule({
  declarations: [
    AppComponent,
    ClientsComponent,
    PageNotFoundComponent,
    SidenavComponent,
    ToolbarComponent,
    LoginComponent,
    RegisterClientModalComponent,
    VerifyClientResetModalComponent,
    VerifyClientDeleteModalComponent,
    ClientHostUrisModalComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    SharedModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  entryComponents: [RegisterClientModalComponent, VerifyClientDeleteModalComponent,
                    VerifyClientResetModalComponent, ClientHostUrisModalComponent],
  providers: [FormBuilder, AuthService, ClientsService, SidenavComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
