import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate,
         CanActivateChild,
         ActivatedRouteSnapshot,
         RouterStateSnapshot } from '@angular/router';

import { UserService } from './services/user.service';

@Injectable()
export class CanActivateRouteGuard implements CanActivate, CanActivateChild {

  constructor(
    private _userService: UserService,
    private _router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (this._userService.getToken()) {
        return true;
      }else {
        this._router.navigate(['/login']);
        return false;
      }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this._userService.getToken()) {
      return true;
    }else {
      this._router.navigate(['/login']);
      return false;
    }
}
}
