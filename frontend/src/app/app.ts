import { Component } from '@angular/core';
import { HeaderComponent } from './features/header/header.component';
import { StrengthsComponent } from './features/strengths/strengths.component';
import { TechnologiesComponent } from './features/technologies/technologies.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { ContactComponent } from './features/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    StrengthsComponent,
    TechnologiesComponent,
    ProjectsComponent,
    ContactComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {}
