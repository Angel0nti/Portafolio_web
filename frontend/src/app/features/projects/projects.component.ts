import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../core/services/projects.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  public authService = inject(AuthService);

  loading = true;
  projects: any[] = [];
  showform = false;
  newTitle = '';
  newDescription = '';
  newUrl = '';

  // Edit state
  editingId: string | null = null;
  editTitle = '';
  editDescription = '';
  editUrl = '';

  ngOnInit() {
    this.projectsService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        console.log('Could not fetch projects from database:', err);
        this.loading = false;
      },
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
      error: (_err: unknown) => {
        alert('Could not save to server. Is the backend running?');
      },
    });
  }

  deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    this.projectsService.deleteProject(id).subscribe({
      next: () => {
        this.projects = this.projects.filter((p) => p._id !== id);
      },
      error: (_err: unknown) => alert('Could not delete project.'),
    });
  }

  startEdit(proj: any) {
    this.editingId = proj._id;
    this.editTitle = proj.title;
    this.editDescription = proj.description;
    this.editUrl = proj.url;
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveEdit() {
    if (!this.editTitle || !this.editDescription || !this.editUrl) {
      alert('Please fill out all fields');
      return;
    }

    const updated = { title: this.editTitle, description: this.editDescription, url: this.editUrl };

    this.projectsService.updateProject(this.editingId!, updated).subscribe({
      next: () => {
        const index = this.projects.findIndex((p) => p._id === this.editingId);
        this.projects[index] = { ...this.projects[index], ...updated };
        this.editingId = null;
      },
      error: (_err: unknown) => alert('Could not update project.'),
    });
  }

  goToProject(url: string) {
    window.open(url, '_blank');
  }
}
