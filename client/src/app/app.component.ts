import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertMessage;

  constructor(
    private _userService:UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit(){
    //console.log(this.user);
    this._userService.signup(this.user).subscribe(
      response =>{
        let identity = response.user;
        this.identity = identity;
        this.errorMessage = false;
        this.alertMessage = false;

        if(!this.identity._id){
          alert('Error, user not logged in');
        }else{
          localStorage.setItem('identity', JSON.stringify(identity));
          this._userService.signup(this.user, 'true').subscribe(
            response =>{
              let token = response.token;
              this.token = token;
              this.errorMessage = false;

              if(this.token.length <= 0){
                alert('Error, Token not generated correctly');
              }else{
                localStorage.setItem('token', token);
                this.user = new User('','','','','','ROLE_USER','');
              }
            },
            error => {
              var errorMessage = <any>error;

              if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(errorMessage);
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(errorMessage);
        }
      }
    );
  }

  public onSubmitRegister(){
    //console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response =>{
        let user = response.user;
        this.user_register = user;
        console.log(this.user_register);
        if(!user._id){
          this.alertMessage = 'Error registering user';
        }else{
          this.alertMessage = 'User registered correctly , you can now log in using: '+this.user_register.email;
          this.user_register = new User('','','','','','ROLE_USER','');
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

  logOut(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    this.identity = null;
    this.token = null;
  }
}
