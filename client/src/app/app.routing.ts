import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

//import user
import { UserEditComponent } from "./components/user-edit/user-edit.component";
import { LoginUserComponent } from "./components/login-user/login-user.component";
import { RegisterUserComponent } from "./components/register-user/register-user.component";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";

const appRoutes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'login', component: LoginUserComponent },
  { path: 'register', component: RegisterUserComponent },
  {
    path: 'main', component: MainMenuComponent,
    children: [
      { path: 'user-info', component: UserEditComponent }
    ]
  },
  { path: '**', component: UserEditComponent }
];

export const AppRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
