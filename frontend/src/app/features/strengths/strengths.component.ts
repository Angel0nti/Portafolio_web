import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StrengthsService } from '../../core/services/strengths.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-strengths',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './strengths.component.html',
  styleUrl: './strengths.component.css',
})
export class StrengthsComponent implements OnInit {
  private strengthsService = inject(StrengthsService);
  public authService = inject(AuthService);

  strengths: any[] = [];
  loading = true;
  showform = false;
  newTitle = '';
  newDefinition = '';

  editingId: string | null = null;
  editTitle = '';
  editDefinition = '';

  ngOnInit() {
    this.strengthsService.getStrengths().subscribe({
      next: (data) => {
        this.strengths = data;
        this.loading = false;
      },
      error: (err) => {
        console.log('Could not fetch strengths:', err);
        this.loading = false;
      },
    });
  }

  saveStrength() {
    if (!this.newTitle || !this.newDefinition) {
      alert('Please fill out all fields');
      return;
    }

    const strengthData = { title: this.newTitle, definition: this.newDefinition };
    this.strengthsService.saveStrength(strengthData).subscribe({
      next: (response: any) => {
        this.strengths.push(response.data);
        this.newTitle = '';
        this.newDefinition = '';
        this.showform = false;
      },
      error: (_err: unknown) => alert('Could not save strength'),
    });
  }

  deleteStrength(id: string) {
    if (!confirm('Are you sure you want to delete this strength?')) return;

    this.strengthsService.deleteStrength(id).subscribe({
      next: () => {
        this.strengths = this.strengths.filter((s) => s._id !== id);
      },
      error: (_err: unknown) => alert('Could not delete strength.'),
    });
  }

  startEdit(strength: any) {
    this.editingId = strength._id;
    this.editTitle = strength.title;
    this.editDefinition = strength.definition;
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveEdit() {
    if (!this.editTitle || !this.editDefinition) {
      alert('Please fill out all fields');
      return;
    }

    const updated = { title: this.editTitle, definition: this.editDefinition };

    this.strengthsService.updateStrength(this.editingId!, updated).subscribe({
      next: () => {
        const index = this.strengths.findIndex((s) => s._id === this.editingId);
        this.strengths[index] = { ...this.strengths[index], ...updated };
        this.editingId = null;
      },
      error: (_err: unknown) => alert('Could not update strength.'),
    });
  }
}
