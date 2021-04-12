import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

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


  constructor(private http: ApiService, 
    private _snackbar: MatSnackBar,
    private _router: Router) {

  }

  ngOnInit(): void {
  }

  register() {
    if (this.validateForm()) {
      let infoUsuario = {
        nombre: this.nombre,
        apellido: this.apellido,
        usuario: this.usuario,
        edad: this.edad,
        sexo: this.sexo,
        peso: this.peso,
        estatura: this.estatura,
        password: this.password,
        rol: this.rol
      }
      console.log(infoUsuario);
      
      this.http.register(infoUsuario).subscribe(
        (res) => {
          console.log(res);
          this.showSnackBar("Usuario registrado con éxito.");
          this._router.navigate(["welcome/login"]);
        },
        (error) => {
          if (error.status == 400) {
            this.showSnackBar("El usuario ya existe.")
          } else if (error.status == 500) {
            this.showSnackBar("Error de conexión con el servidor.")
          } else {
            this.showSnackBar("Error desconcido del servidor. Status: " + error.status + ".")

          }


          this.showSnackBar("Ocurrió un error de conexión con el servidor.");
          console.log(error);
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
    if(this.rol == -1){
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
    if (this.password == "") {
      this.showSnackBar("El campo constraseña no puede estar vacío.");
      return false;
    }
    if (this.validarPassword == "") {
      this.showSnackBar("Debe de validar la contraseña que ingresó.");
      return false;
    }
    if (this.password != this.validarPassword) {
      this.showSnackBar("Debe de repetir la contraseña");
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
