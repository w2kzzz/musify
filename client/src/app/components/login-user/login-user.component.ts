import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css'],
  providers: [UserService]
})
export class LoginUserComponent implements OnInit {
  public title = 'MUSIFY';
  public user: User;
  public identity;
  public token;
  public errorMessage;

  constructor(
    private _userService:UserService,
    private router: Router
  ) {
    this.user = new User('','','','','','ROLE_USER','');
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){
    //console.log(this.user);
    this._userService.signup(this.user).subscribe(
      response =>{
        let identity = response.user;
        this.identity = identity;
        this.errorMessage = false;

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
                this.router.navigate(['main']);
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

  public goRegister(){
   // console.log('it works register');
    this.router.navigate(['/register']);
  }

}
