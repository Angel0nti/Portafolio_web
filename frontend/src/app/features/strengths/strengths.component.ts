import { Component } from '@angular/core';

@Component({
  selector: 'app-strengths',
  standalone: true,
  templateUrl: './strengths.component.html',
  styleUrl: './strengths.component.css',
})
export class StrengthsComponent {
  strengths = [
    {
      title: 'Autodidact',
      definition:
        'I have the ability to research, read documentation, and learn new technologies on my own.',
    },
    {
      title: 'Problem Solving',
      definition:
        'I focus on analyzing the root cause of bugs in code to find logical and efficient solutions.',
    },
    {
      title: 'Adaptability',
      definition:
        'I easily adjust to different workflows, team configurations, and new development tools.',
    },
  ];
}
