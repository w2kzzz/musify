import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { GLOBAL} from '../../services/global';
import { Artist} from '../../models/artist';


@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
  providers: [UserService]
})
export class ArtistListComponent implements OnInit {
  public title: String;
  public artists: Artist[];
  public token;
  public identity;
  public url: string;

  constructor(
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = 'Artists';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit() {
    console.log('artist component');
  }

}
