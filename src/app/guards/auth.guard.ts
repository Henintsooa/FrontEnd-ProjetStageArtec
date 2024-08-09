import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    const expectedRole = route.data['expectedRole'];

    if (currentUser && (!expectedRole || currentUser.role === expectedRole)) {
      // L'utilisateur est connecté et a le rôle requis (ou aucun rôle requis spécifié)
      return true;
    }

    // L'utilisateur n'est pas connecté, rediriger vers la page de connexion
    this.router.navigate(['/login']);
    return false;
  }
}
