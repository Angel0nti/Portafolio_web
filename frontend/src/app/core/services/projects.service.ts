import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'https://portafolio-web-nu-one.vercel.app/api/projects';

  private getAuthHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  getProjects() {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveProject(project: { title: string; description: string; url: string }) {
    return this.http.post(this.apiUrl, project, { headers: this.getAuthHeaders() });
  }
}
