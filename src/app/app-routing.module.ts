// app-routing.module

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { ClientsComponent } from './clients/clients.component';
import { TeamsComponent } from './teams/teams.component';

const appRoutes: Routes = [
    { path: 'clients', component: ClientsComponent },
    { path: 'teams', component: TeamsComponent },
    { path: '',
      redirectTo: '/login',
      pathMatch: 'full'
    },
    { path: 'login', component: LoginComponent },
    { path: '**', component: PageNotFoundComponent}
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
