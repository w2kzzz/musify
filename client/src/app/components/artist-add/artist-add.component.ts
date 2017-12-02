import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { GLOBAL} from '../../services/global';
import { Artist} from '../../models/artist';

@Component({
  selector: 'app-artist-add',
  templateUrl: './artist-add.component.html',
  styleUrls: ['./artist-add.component.css']
})
export class ArtistAddComponent implements OnInit {
  public title: String;
  public artist: Artist;
  public token;
  public identity;
  public url: string;
  public alertMessage;
  public filesToUpload: Array<File>;

  constructor(
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = 'Artists';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('','','');
   }

  ngOnInit() {
    console.log('artist component');
  }

  public onSubmitAddArtist() {
    let fileInput = <HTMLInputElement>document.getElementById('inputFile');
    let profileImage = <HTMLImageElement>document.getElementById('profileImage');
    //  console.log(this.user);
    this._userService.updateUser(this.artist).subscribe(
      response => {
       // console.log(this.user);
        if (!response.user) {
          this.alertMessage = 'Error updating user';
        }else {
          localStorage.setItem('identity', JSON.stringify(this.artist));

          if (!this.filesToUpload) {
            // redirect
          }else {
            this.makeFileRequest(this.url + '/upload-image-artist/' + this.artist.name, [], this.filesToUpload).then(
              (result: any) => {
                this.artist.image = result.image;
                localStorage.setItem('identity', JSON.stringify(this.artist));
              }
            );
          }

          profileImage.src = this.url + 'get-image-user/' + this.artist.image;
          fileInput.value = '';


          this.alertMessage = 'User updated correctly';
        }
      },
      error => {
        var alertMessage = <any>error;

        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.alertMessage = body.message;
          console.log(this.alertMessage);
        }
      }
    );
  }

  public fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

  public makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    var token = this.token;

    return new Promise(function(resolve, reject){
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();

      for (var i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
      }

      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          }else {
            reject(xhr.response);
          }
        }
      }

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }

}
