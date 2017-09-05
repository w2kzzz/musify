import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
  providers: [UserService]
})
export class RegisterUserComponent implements OnInit {

  public title = 'Register';
  public user_register: User;
  public identity;
  public token;
  public register;
  public alertMessage;

  constructor(
    private _userService:UserService,
    private router: Router
  ){
    this.user_register = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
    this.register = false;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
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

  public goLogin(){
    this.router.navigate(['/login']);
  }

}
