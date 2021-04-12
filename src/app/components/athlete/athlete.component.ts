import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-athlete',
  templateUrl: './athlete.component.html',
  styleUrls: ['./athlete.component.css']
})
export class AthleteComponent implements OnInit {
  constructor(private myAuth:AuthService,
    private _router:Router) { 
      
    }

  ngOnInit(): void {
  }

  logout(){
    this._router.navigate(['welcome/login']);
    this.myAuth.logOut();
  }

  editInfo(){
    this._router.navigate(['athlete/edit']);
  }

  goHome(){
    this._router.navigate(['athlete/home']);
  }


}
