import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { Router} from '@angular/router';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public identity;
  public token;

  constructor(
    private _userService:UserService,
    private router: Router
  ){ }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

}
