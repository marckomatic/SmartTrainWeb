import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  nombre: string = "";
  apellido: string = "";
  usuario: string = "";
  edad: number = 12;
  sexo: string = "";
  peso: number = 0;
  estatura: number = 0;
  password: string = "";
  rol: number = -1;
  validarPassword: string = "";
  idUsuario: number = 0;

  constructor(private http: ApiService,
    private _snackbar: MatSnackBar,
    private _router: Router,
    private myAuth: AuthService) {
    this.loadInfo();
  }

  ngOnInit(): void {
  }

  loadInfo(): void {
    let infoUser = this.myAuth.getInfo();
    this.apellido = infoUser.apellido;
    this.edad = infoUser.edad;
    this.estatura = infoUser.estatura;
    this.nombre = infoUser.nombre;
    this.peso = infoUser.peso;
    this.rol = infoUser.rol.idRol; 
    this.sexo = infoUser.sexo; 
    this.usuario = infoUser.usuario; 
    this.idUsuario = infoUser.idUsuario;
  }

  updateInfoOnLocal(){
    let userInfo = this.myAuth.getInfo();
    userInfo.apellido = this.apellido;
    userInfo.edad = this.edad;
    userInfo.estatura = this.estatura;
    userInfo.nombre = this.nombre;
    userInfo.peso = this.peso;
    userInfo.sexo = this.sexo; 
    userInfo.usuario = this.usuario; 
    this.myAuth.saveInfo(userInfo);
  }

  saveInfo() {
    if (this.validateForm()) {
      let infoUsuario = {
        idUsuario: this.idUsuario,
        nombre: this.nombre,
        apellido: this.apellido,
        usuario: this.usuario,
        edad: this.edad,
        sexo: this.sexo,
        peso: this.peso,
        estatura: this.estatura,
      }

      console.log(infoUsuario);

      this.http.editInfo(infoUsuario).subscribe(
        (res) => {
          console.log(res);
          this.showSnackBar("Información guardada con éxito.");
          this.updateInfoOnLocal();
        },
        (error) => {
          console.log(error);
          if (error.status == 400) {
            this.showSnackBar(error.error.mensaje)
          } else if (error.status == 500) {
            this.showSnackBar("Error de conexión con el servidor.")
          } else {
            this.showSnackBar("Error desconcido del servidor. Status: " + error.status + ".")

          }
        }
      )
    }

  }

  validateForm() {
    if (this.nombre == "") {
      this.showSnackBar("El campo nombre no puede estar vacío.");
      return false;
    }
    if (this.apellido == "") {
      this.showSnackBar("El campo apellido no puede estar vacío.");
      return false;
    }
    if (this.usuario == "") {
      this.showSnackBar("El campo usuario no puede estar vacío.");
      return false;
    }
    if (this.rol == -1) {
      this.showSnackBar("Seleccione un rol para su usuario.");
      return false;
    }
    if (this.edad < 7) {
      this.showSnackBar("La edad no puede ser menor a 7 años.");
      return false;
    }
    if (this.peso < 1) {
      this.showSnackBar("El peso debe de ser un número positivo.");
      return false;
    }
    if (this.estatura < 1) {
      this.showSnackBar("La estatura debe de ser un número positivo.");
      return false;
    }

    if (this.sexo == "") {
      this.showSnackBar("El campo sexo no puede estar vacío.");
      return false;
    }
    return true;

  }

  showSnackBar(message: string) {
    this._snackbar.open(message, 'Ok', {
      duration: 2000
    });
  }

  cancel() {
    if(this.myAuth.getUserRol() == AuthService.ATHLETE_ROLE){
      this._router.navigate(["athlete/home"]);
    }
    else{
      this._router.navigate(["coach/home"]);
    }
  }

}
