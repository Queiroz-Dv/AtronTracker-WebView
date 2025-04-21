import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(): boolean {
    const token = JSON.parse(localStorage.getItem('authToken')).token;
    if (!token) {
      console.log('Token não encontrado. Redirecionando para a página de login.');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
