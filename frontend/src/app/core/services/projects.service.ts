import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient);
  private apiUrl = 'https://portafolio-web-nu-one.vercel.app/api/projects';

  getProjects() {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveProject(project: { title: string; description: string; url: string }) {
    return this.http.post(this.apiUrl, project);
  }
}
