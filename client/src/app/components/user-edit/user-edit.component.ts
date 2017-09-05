import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

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

  constructor(private _userService:UserService
  ){
    this.title = "Update User";
   }

  ngOnInit() {
    this.alertMessage = null;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;

    //console.log('Component User-edit working');
  }

  public onSubmitUpdate(){
    console.log(this.user);
    this._userService.updateUser(this.user).subscribe(
      response =>{
        let user = response.user;
        this.user = user;
       // console.log(this.user);
        if(!user._id){
          this.alertMessage = 'Error updating user';
        }else{
          this.alertMessage = 'User updated correctly';
          localStorage.setItem('identity',JSON.stringify(this.user));
        }
      },
      error => {
        var alertMessage = <any>error;

        if(alertMessage != null){
          var body = JSON.parse(error._body);
          this.alertMessage = body.message;
          console.log(this.alertMessage);
        }
      }
    );
  }

}
