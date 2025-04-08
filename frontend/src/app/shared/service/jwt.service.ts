import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private TOKEN_KEY = 'authToken';

  constructor(private router: Router) {}

  public setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private decodeToken(token: string): any {
    try {
      return jwt_decode.jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    console.log(decoded.exp < currentTime);

    return decoded.exp < currentTime;
  }

  public handleTokenNavigation(): void {
    if (!this.isTokenExpired()) {
      this.router.navigate(['/home']);
    } else {
      alert('Your session has expired. Please log in again.');
      this.router.navigate(['/login']);
    }
  }
}
