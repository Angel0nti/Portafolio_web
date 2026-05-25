import { Component } from '@angular/core';

@Component({
  selector: 'app-technologies',
  standalone: true,
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.css',
})
export class TechnologiesComponent {
  technologies = [
    { name: 'HTML5', iconClass: 'devicon-html5-plain colored' },
    { name: 'CSS3', iconClass: 'devicon-css3-plain colored' },
    { name: 'JavaScript', iconClass: 'devicon-javascript-plain colored' },
    { name: 'TypeScript', iconClass: 'devicon-typescript-plain colored' },
    { name: 'Angular', iconClass: 'devicon-angularjs-plain colored' },
    { name: 'Node.js', iconClass: 'devicon-nodejs-plain colored' },
    { name: 'Express', iconClass: 'devicon-express-original colored' },
    { name: 'MongoDB', iconClass: 'devicon-mongodb-plain colored' },
  ];
}
