import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_URL = 'http://35.209.209.133:3000'
  
  constructor(private http: HttpClient) { 
  
  }

  login(usuario: any){
    return this.http.post(`${this.API_URL}/login`, usuario);
  }

  register(infoUsuario: any){
    return this.http.post(`${this.API_URL}/registrarUsuario`, infoUsuario);
  }

  editInfo(infoUsuario: any){
    return this.http.post(`${this.API_URL}/modificarUsuario`, infoUsuario);
  }

  getAtletasSinCoach(){
    return this.http.get(`${this.API_URL}/atletaSinCoach`);
  }

  getAtletasAsignados(idCoach:number){
    return this.http.post(`${this.API_URL}/atletasAsignados`, {idCoach: idCoach});
  }

  asignarAtleta(idAtleta:number, idCoach:number){
    return this.http.post(`${this.API_URL}/asignarAtleta`, {idUsuario: idAtleta, idCoach: idCoach})
  }

  
  desasignarAtleta(idAtleta:number){
    return this.http.post(`${this.API_URL}/desasignarAtleta`, {idAtleta: idAtleta})
  }

  obtenerSesiones(idAtleta:number){
    return this.http.post(`${this.API_URL}/obtenerSesiones`, {idUsuario: idAtleta})
  }

  
  obtenerSesionesConRendiciones(idAtleta:number){
    return this.http.post(`${this.API_URL}/obtenerRendiciones`, {idAtleta: idAtleta})
  }

  
  obtenerSesionesConFallos(idAtleta:number){
    return this.http.post(`${this.API_URL}/obtenerFallos`, {idAtleta: idAtleta})
  }


  
  obtenerDatos(idAtleta:number, medida: number, idSesion: number){
    return this.http.post(`${this.API_URL}/obtenerMedicionesPorSesion`, {idSesion: idSesion});
  }

  obtenerInfoAtleta(idAtleta:number){
    return this.http.post(`${this.API_URL}/getUsuarioById`, {idUsuario: idAtleta});    
  }

  
  obtenerInfoSesion(idSesion:number){
    return this.http.post(`${this.API_URL}/getSesionById`, {idSesion: idSesion});    
  }

  getDatoRendiciones(idAtleta){
    return this.http.post(`${this.API_URL}/obtenerRendiciones`, {idUsuario: idAtleta});    
  }

  getDatoFallos(idAtleta){
    console.log("Este es el body");
    console.log({idAtleta: idAtleta})
    return this.http.post(`${this.API_URL}/obtenerFallos`, {idAtleta: idAtleta})
  }
}
