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
  nombreTipo: string;
  timeInterval;
  imageUrl:string; 
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
    this.timeInterval = setInterval(() => { this.updateTime() }, 1000);
    let tipo = Number(this.route.snapshot.paramMap.get("tipo"));
    switch (tipo) {
      case 1:
        this.nombreTipo = 'Entrenamiento Común';
        this.imageUrl = 'https://cdn.pixabay.com/photo/2017/04/25/20/18/sport-2260736_1280.jpg'
        break;
      case 2:
        this.nombreTipo = 'Test Course Navette';
        this.imageUrl = 'https://cdn.pixabay.com/photo/2016/11/14/03/06/woman-1822459_1280.jpg'
        break;
      case 3:
        this.nombreTipo = 'Espirometría';
        this.imageUrl = 'data:image/jpeg;base64,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';
        break;
    }
  }

  ngOnInit(): void {
  }

  //Data methods
  fillSessions() {
    let tipo = Number(this.route.snapshot.paramMap.get("tipo"));

    let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));
    this.http.obtenerSesionesPorTipo(idAtleta, tipo).subscribe(
      (result: any) => {
        this.sessions = result.resultado;
        this.sessions = this.sessions.reverse();
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  fillData() {
    let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));

    this.http.obtenerInfoAtleta(idAtleta).subscribe(
      (result: any) => {
        this.infoUsuario = result.resultado;
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  //Logical Methods

  //Logical and technical methods
  seeData(meditionType: number, sessionId: number) {
    let tipo = Number(this.route.snapshot.paramMap.get("tipo"));
    if(tipo == 3){
      let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));
      this.router.navigate(['../../../spiro', sessionId, idAtleta], {relativeTo: this.route});
    }else{
      let idAtleta = Number(this.route.snapshot.paramMap.get("idAtleta"));
      this.router.navigate(['../../../data', sessionId, idAtleta], {relativeTo: this.route});
    }
  }

  updateTime() {
    this.today = Date.now();
  }
}
