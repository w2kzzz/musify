import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
  providers:[UserService]
})
export class MainMenuComponent implements OnInit {
  public title = 'MUSIFY';
  public identity;
  public token;

  constructor(
    private _userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public logOut(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    this.identity = null;
    this.token = null;
    this.router.navigate(['login']);
  }

}
