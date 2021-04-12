import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  sessions: any[] = [];
  athleteName: string;
  today: number = Date.now();
  timeInterval;

  infoUsuario: any = {
    nombre: '',
    apellido: '',
    peso: 0,
    estatura: 0,
    sexo: ''
  }

  constructor(private myAuth: AuthService,
    private router: Router,
    private _snackbar: MatSnackBar,
    private http: ApiService,
    private route: ActivatedRoute) {
    this.fillSessions();
    this.fillData();
    this.timeInterval = setInterval(()=>{this.updateTime()}, 1000);

  }

  ngOnInit(): void {
  }

  //Data methods
  fillSessions(){
    let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));
    this.http.obtenerSesiones(idAtleta).subscribe(
      (result:any)=>{
        this.sessions = result.resultado;
        this.sessions = this.sessions.reverse();
      },
      (error:any)=>{
        console.log(error);
      }
    )
    this.sessions = []
  }

  fillData(){
    let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));

    this.http.obtenerInfoAtleta(idAtleta).subscribe(
      (result:any)=>{
        this.infoUsuario = result.resultado;
      },
      (error:any)=>
      {
        console.log(error);
      }
    )
  }

  //Logical Methods
  
  //Logical and technical methods
  seeData(meditionType: number, sessionId: number){
    let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));
    this.router.navigate(['coach/data', sessionId, idAtleta]);
  }

  updateTime(){
    this.today = Date.now();
  }
}
