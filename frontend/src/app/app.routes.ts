import { Routes } from '@angular/router';
import { AdminComponent } from './features/admin/admin.component';

export const routes: Routes = [
  { path: 'tilincv', component: AdminComponent },
  {
    path: '',
    loadComponent: () =>
      import('./features/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
  },
];
