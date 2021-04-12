import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";

  constructor(private http: ApiService, 
    private _snackbar: MatSnackBar,
    private _router: Router,
    private auth:AuthService) { }

  ngOnInit(): void {
  }

  login() {
    if (this.validateForm()) {
      this.http.login({
        usuario: this.username,
        password: this.password
      }).subscribe(
        (res: any) => {
          console.log(res);

          let rol = res.resultado.resultado.rol.idRol;
          this.auth.saveUser(res.idUsuario, rol);
          this.auth.saveInfo(res.resultado.resultado);
          console.log("El rol es " + rol);
          console.log("debería de ser rol " + AuthService.ATHLETE_ROLE);
          if(rol == AuthService.ATHLETE_ROLE){
            this._router.navigate(['athlete']);
          }else{
            this._router.navigate(['coach']);
          }
        },
        (error) => {
          if(error.status == 404){
            this.showSnackBar("El usuario no existe.");
          }else if(error.status == 400){
            this.showSnackBar("Contraseña incorrecta.")
          }else if(error.status == 500){
            this.showSnackBar("Error de conexión con el servidor.")
          }else{
            this.showSnackBar("Error desconcido del servidor. Status: " + error.status + ".")

          }

        }
      );
    }
  }

  validateForm() {
    if (this.username == "") {
      this.showSnackBar("Ingrese su nombre de usuario.");
      return false;
    }
    if (this.password == "") {
      this.showSnackBar("Ingrese su contraseña.");
      return false;
    }
    return true;
  }


  showSnackBar(message: string) {
    this._snackbar.open(message, 'Ok', {
      duration: 2000
    });
  }


}
