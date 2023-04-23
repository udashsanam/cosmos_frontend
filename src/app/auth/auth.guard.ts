import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { AppService } from "../app.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private _appService: AppService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getRole();
      console.log(userRole);

      if (route.data.role && route.data.role.indexOf(userRole) === -1) {
        // this.router.navigate(['/login']);
        
        if (userRole === 'ROLE_ADMIN') {
          this.router.navigate(['admin']);
        } else if (userRole === 'ROLE_MODERATOR') {
          this.router.navigate(['moderators'])
        } else if (userRole === 'ROLE_ASTROLOGER') {
          this.router.navigate(['astrologers'])
          console.log(`welcome astrologer`);
          console.log(`need to listen to connection after astrologer logs in`);
        }

        // this.router.navigate(['moderators']);
        // return false;

      } else {
        console.log(`issue found in if clause`);
      }
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
