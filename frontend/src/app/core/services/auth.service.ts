import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://portafolio-web-nu-one.vercel.app/api/auth/login';
  private tokenKey = 'admin_token';

  login(password: string) {
    return this.http
      .post<{ token: string }>(this.apiUrl, { password })
      .pipe(tap((res) => localStorage.setItem(this.tokenKey, res.token)));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
