import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, ActivatedRoute, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public auth:AuthService, public router:Router) { }

  canActivate(route: ActivatedRouteSnapshot){
    const expectedUserType = route.data.expectedUserType;
    if(!this.auth.isAuthorizedToSeeTheContent(expectedUserType)){
      this.router.navigate(['welcome/login']);
      return false; 
    }
    return true;
  }
}
