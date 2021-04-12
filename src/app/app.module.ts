import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TrainerComponent } from './components/trainer/trainer.component';
import { AthleteComponent } from './components/athlete/athlete.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/athlete/home/home.component';
import { InfoComponent } from './components/athlete/info/info.component';
import { HomecoachComponent } from './components/trainer/homecoach/homecoach.component';
import { GraphicComponent } from './components/graphic/graphic.component';
import { ChartsModule } from 'ng2-charts';
import { SessionsComponent } from './components/sessions/sessions.component';
import { ReportsComponent } from './components/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LoginComponent,
    RegisterComponent,
    TrainerComponent,
    AthleteComponent,
    InfoComponent,
    HomeComponent,
    HomecoachComponent,
    GraphicComponent,
    SessionsComponent,
    ReportsComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ChartsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
