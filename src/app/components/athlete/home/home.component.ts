import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  fechaUltimaSesion:string = "14 de Febrero de 2021";
  idLastSession:number;
  sessions:any[] = [];
  failSessions:any[] = [];
  giveUpSessions:any[] = [];

  athleteName:string; 
  today: number = Date.now();
  timeInterval;


  constructor(
private myAuth:AuthService,
    private router:Router,
    private _snackbar: MatSnackBar,
    private http:ApiService) { 
      let userInfo = myAuth.getInfo();
      this.athleteName = userInfo.nombre + ' ' + userInfo.apellido;
      this.fillSessions();
      this.fillGiveUpSessions();
      this.fillFailSessions();
      this.timeInterval = setInterval(()=>{this.updateTime()}, 1000);

    }

  ngOnInit(): void {
  }


  //Data methods  
  fillSessions(){
    let idAtleta = this.myAuth.getUserId();
    this.http.obtenerSesiones(idAtleta).subscribe(
      (result:any)=>{
        this.sessions = result.resultado;
        this.sessions = this.sessions.reverse();
        this.getLastSession();
      },
      (error:any)=>{
        console.log(error);
      }
    )
    this.sessions = []
  }

  fillGiveUpSessions(){
    let idAtleta = this.myAuth.getUserId();
    this.http.obtenerSesionesConRendiciones(idAtleta).subscribe((result:any)=>{
      console.log("Rendiciones:");
      console.log(result);
      this.giveUpSessions = result.resultado;
    },
    (error)=>{

    });
    this.giveUpSessions = [
      {
        idSesion: 23,
        fecha_hora: '9 Abril 2020', 
        repeticiones: 25
      },
      {
        idSesion: 23,
        fecha_hora: '9 Abril 2020', 
        repeticiones: 25
      },
      {

        idSesion: 23,
        fecha_hora: '9 Abril 2020', 
        repeticiones: 24
      }
    ]
  }

  
  fillFailSessions(){
    let idAtleta = this.myAuth.getUserId();
    
    this.http.obtenerSesionesConFallos(idAtleta).subscribe((result:any)=>{
      console.log("fallos:");
      console.log(result);
      this.failSessions = result.resultado;
    },
    (error)=>{

    });
  }



  //Logical and technical methods
  seeData(sessionId: number){
    let idAtleta = this.myAuth.getUserId();
    this.router.navigate(['athlete/data', sessionId, idAtleta]);
  }

  getLastSession(){
    if(this.sessions == null || this.sessions.length < 1)
      return null;
    let sesion = this.sessions[0];
    this.fechaUltimaSesion = sesion.fecha_hora;
    this.idLastSession = sesion.idSesion;
    return sesion; 
  }
  
  gotoLastSession(){
    let idAtleta = this.myAuth.getUserId();
    let sessionId = this.idLastSession;
    this.router.navigate(['athlete/data', sessionId, idAtleta]);
  }

  showSnackBar(message: string) {
    this._snackbar.open(message, 'Ok', {
      duration: 2000
    });
  }

  updateTime(){
    this.today = Date.now();
  }

}
