import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import user
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';

// import Guard
import { CanActivateRouteGuard } from './app.guard';

const appRoutes: Routes = [
  { path: '', component: MainMenuComponent , canActivate: [CanActivateRouteGuard]},
  { path: 'login', component: LoginUserComponent },
  { path: 'register', component: RegisterUserComponent },
  {
    path: 'main',
      component: MainMenuComponent,
      canActivate: [CanActivateRouteGuard],
    children: [
      { path: 'user-info', component: UserEditComponent, canActivateChild: [CanActivateRouteGuard] }
    ]
  },
  { path: '**', component: LoginUserComponent }
];

export const AppRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
