// app-routing.module

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterTeamComponent } from './teams/register-team/register-team.component';
import { ClientsComponent } from './clients/clients.component';
import { TeamsComponent } from './teams/teams.component';

const appRoutes: Routes = [
    { path: 'clients', component: ClientsComponent },
    { path: 'teams', component: TeamsComponent },
    { path: '',
      redirectTo: '/register',
      pathMatch: 'full'
    },
    { path: 'register', component: RegisterTeamComponent },
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
