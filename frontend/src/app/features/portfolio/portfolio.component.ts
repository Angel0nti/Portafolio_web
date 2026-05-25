import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { StrengthsComponent } from '../strengths/strengths.component';
import { TechnologiesComponent } from '../technologies/technologies.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    HeaderComponent,
    StrengthsComponent,
    TechnologiesComponent,
    ProjectsComponent,
    ContactComponent,
  ],
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent {}
