import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  password = '';
  error = '';

  login() {
    this.authService.login(this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        if (err.status === 429) {
          this.error = 'Too many attempts. Try again in 15 minutes.';
        } else {
          this.error = 'Invalid password';
        }
      },
    });
  }
}
