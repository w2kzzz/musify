import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { GLOBAL} from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public title;
  public user: User;
  public identity;
  public token;
  public alertMessage;
  public filesToUpload: Array<File>;
  public url;

  constructor(private _userService: UserService
  ) {
    this.title = 'Update User';
   }

  ngOnInit() {
    this.alertMessage = null;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;

    // console.log('Component User-edit working');
  }

  public onSubmitUpdate() {
    let fileInput = <HTMLInputElement>document.getElementById('inputFile');
    //  console.log(this.user);
    this._userService.updateUser(this.user).subscribe(
      response => {
       // console.log(this.user);
        if (!response.user) {
          this.alertMessage = 'Error updating user';
        }else {
          localStorage.setItem('identity', JSON.stringify(this.user));

          if (!this.filesToUpload) {
            // redirect
          }else {
            this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).then(
              function(result: any){
                var identity = JSON.parse(localStorage.getItem('identity'));
                // console.log('identity current image: '+identity.image);
                identity.image = result.image;
                // console.log('identity new image: '+identity.image);
                localStorage.setItem('identity', JSON.stringify(identity));
              }
            );
          }
          // console.log('previous image: '+this.user.image);
          // console.log(this._userService.getIdentity());
          this.user = this._userService.getIdentity();
          // console.log(this.user.image);
          // console.log(this.user);
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
