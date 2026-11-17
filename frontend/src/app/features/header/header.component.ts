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
    'Electronics Engineer and Junior Full-Stack Developer focused on web development with Node.js, Angular and MongoDB. I have built and deployed three full-stack applications with JWT authentication, REST APIs and an AI integration powered by the Gemini API. AWS Certified Cloud Practitioner, currently learning Java and Spring Boot. I am looking for a junior opportunity where I can apply what I have learned and grow alongside an experienced team.';
}
