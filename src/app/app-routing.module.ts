import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AthleteComponent } from './components/athlete/athlete.component';

import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TrainerComponent } from './components/trainer/trainer.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthService } from './services/auth.service';

import { HomeComponent } from './components/athlete/home/home.component';
import { InfoComponent } from './components/athlete/info/info.component';
import { HomecoachComponent } from './components/trainer/homecoach/homecoach.component';
import { GraphicComponent } from './components/graphic/graphic.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { 
    path: 'welcome', component: WelcomeComponent,
    children: [
      {
        path: '', redirectTo: 'login', pathMatch: 'full'
      },
      {
        path: 'login', component: LoginComponent
      }, 
      {
        path: 'register', component: RegisterComponent
      }
    ]
  }, 
  {
    path: 'coach', component: TrainerComponent, canActivate: [AuthGuard], 
    data: {
      expectedUserType: AuthService.COACH_ROLE
    }, 
    children:[
      {
        path: '', redirectTo: 'home', pathMatch: 'full'
      },
      {
        path: "edit", component: InfoComponent
      },
      {
        path: 'home', component: HomecoachComponent
      },
      {
        path: 'sessions/:idAtleta', component: SessionsComponent
      },
      
      {
        path: "data/:idSesion/:idAtleta", component: GraphicComponent
      }, 
      {
        path: "reports/:idSesion/:idAtleta", component: ReportsComponent
      }
    ]
  },
  {
    path: 'athlete',  component: AthleteComponent, 
    canActivate: [AuthGuard],
    data: {
      expectedUserType: AuthService.ATHLETE_ROLE
    }, children: [
      {
        path: '', redirectTo: 'home', pathMatch: 'full'
      },
      {
        path: "home", component: HomeComponent
      },
      {
        path: "edit", component: InfoComponent
      },
      {
        path: "data/:idSesion/:idAtleta", component: GraphicComponent
      }, 
      {
        path: "reports/:idSesion/:idAtleta", component: ReportsComponent
      }
    ]
  },
  {
    path: '', redirectTo: 'welcome/login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
