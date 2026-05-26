import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  name = 'Luis Angel Ontiveros Alvarez';
  profession = 'Full Stack Software Developer Jr.';
  photoUrl = '/Angel.png';
  whoamI =
    'I am a Junior Full-Stack Developer with foundations in JavaScript, HTML, and CSS, along with practical experience in Angular, TypeScript, Node.js, MongoDB, and SQL. Although I do not have formal professional experience yet, I am highly motivated, and genuinely excited about growth opportunities in the software industry.';
}
