import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class StrengthsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'https://portafolio-web-nu-one.vercel.app/api/strengths';

  private getAuthHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  getStrengths() {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveStrength(strength: { title: string; definition: string }) {
    return this.http.post(this.apiUrl, strength, { headers: this.getAuthHeaders() });
  }

  updateStrength(id: string, strength: { title: string; definition: string }) {
    return this.http.patch(`${this.apiUrl}/${id}`, strength, { headers: this.getAuthHeaders() });
  }

  deleteStrength(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
