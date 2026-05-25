import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../core/services/projects.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  private projectsService = inject(ProjectsService);

  projects: any[] = [];
  showform = false;
  newTitle = '';
  newDescription = '';
  newUrl = '';

  ngOnInit() {
    this.projectsService.getProjects().subscribe({
      next: (data) => (this.projects = data),
      error: (err) => console.log('Could not fetch projects from database:', err),
    });
  }

  saveProject() {
    if (!this.newTitle || !this.newDescription || !this.newUrl) {
      alert('Please fill out all fields');
      return;
    }

    const projectData = {
      title: this.newTitle,
      description: this.newDescription,
      url: this.newUrl,
    };

    this.projectsService.saveProject(projectData).subscribe({
      next: (response) => {
        console.log('Project successfully saved in backend', response);
        this.projects.push(projectData);
        this.newTitle = '';
        this.newDescription = '';
        this.newUrl = '';
        this.showform = false;
      },
      error: (err) => {
        console.error('Failed to send project to backend:', err);
        alert('Could not save to server. Is the backend running?');
      },
    });
  }

  goToProject(url: string) {
    window.open(url, '_blank');
  }
}
