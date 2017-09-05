import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { routing, AppRoutingProviders } from './app.routing';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    LoginUserComponent,
    RegisterUserComponent,
    MainMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [AppRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
