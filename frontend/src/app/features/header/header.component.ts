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
    'As a Junior Full-Stack Developer starting my professional journey, I am driven by curiosity and a desire to learn from experienced teams. I am looking for a growth-oriented opportunity where I can apply my web development foundations, face new challenges, and evolve into a stronger professional';
}
