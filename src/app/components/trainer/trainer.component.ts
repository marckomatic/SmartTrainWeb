import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent implements OnInit {

  constructor(private _router:Router, 
    private myAuth: AuthService) { }

  ngOnInit(): void {
  }

  logout(){
    this._router.navigate(['welcome/login']);
    this.myAuth.logOut();
  }

  editInfo(){
    this._router.navigate(['coach/edit']);
  }

  goHome(){
    this._router.navigate(['coach/home']);
  }
}
