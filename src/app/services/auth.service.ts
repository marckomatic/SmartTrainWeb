import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static COACH_ROLE = 1; 
  public static ATHLETE_ROLE = 2;
  
  constructor() { }

  public isAuthorizedToSeeTheContent(supossedUser: number) {
    let jsonString = localStorage.getItem('user');
    if (jsonString == null) {
      return false;
    }
    let userObject = JSON.parse(jsonString);
    return userObject.rol == supossedUser;
  }

  public saveUser(user_id:number, user_rol:number){
    let user:any = {
      id: user_id, 
      rol: user_rol
    };

    let stringifiedUser = JSON.stringify(user);
    localStorage.setItem('user', stringifiedUser);
  }

  public saveInfo(userInfo: any){
    let stringifiedUser = JSON.stringify(userInfo);
    localStorage.setItem('userInfo', stringifiedUser);
  }

  public getInfo():any{
    let stringfiedUser = localStorage.getItem('userInfo');
    let user = JSON.parse(stringfiedUser as string);
    return user; 
  }

  public getUserId(){
    let stringfiedUser = localStorage.getItem('userInfo');
    let user = JSON.parse(stringfiedUser as string);
    console.log(user);
    return user.idUsuario;
  }

  
  public getUserRol(){
    let stringfiedUser = localStorage.getItem('user');
    let user = JSON.parse(stringfiedUser as string);
    return user.rol;
  }

  public logOut(){
    localStorage.removeItem('user');
  }

}
