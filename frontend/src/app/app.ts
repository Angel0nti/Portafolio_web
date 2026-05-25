import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  //Decorator, tells Angular 'Hey this file its not a class of typescript, its a web component'
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html', // It tells the brain which body it is, by indicating its HTML file.
  styleUrl: './app.css', // It tells the brain which clothes it is wearing, by indicating its CSS file.
})
export class AppComponent implements OnInit {
  // Injecting Angular's HTTP tool into a variable
  private http = inject(HttpClient);

  // Here we create the variables with the information
  name: string = 'Luis Angel Ontiveros Alvarez';
  profession: string = 'Full Stack Software Developer Jr.';
  whoamI: string =
    'I am a Junior Full-Stack Developer with foundations in JavaScript, HTML, and CSS, along with practical experience in Angular, TypeScript, Node.js, MongoDB, and SQL. Although I do not have formal professional experience yet, I am highly motivated, and genuinely excited about growth opportunities in the software industry.';

  // Array of objects holding strengths and their definitions
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
  // Array of technologies with their respective Devicon classes
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
  // Array of Projects to display in the portfolio
  projects: any[] = [];
  // Variables to manage the dynamic form state and its inputs
  showform: boolean = false;
  newTitle: string = '';
  newDescription: string = '';
  newUrl: string = '';

  // Contact information links
  contactInfo = {
    email: 'angel0ntialv21@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/luis-angel-ontiveros-alvarez-568146345/',
    whatsappUrl: 'https://wa.me/526182945349',
  };
  // This function runs only when we load the page
  ngOnInit() {
    this.loadProjects();
  }

  // HTTP GET function to takes all the data from MongoDB
  loadProjects() {
    this.http.get<any[]>('https://portafolio-web-nu-one.vercel.app/api/projects').subscribe({
      next: (data) => {
        // We replace our empty array with the real live database projects
        this.projects = data;
      },
      error: (err) => {
        console.log('Could not fetch projects from database:', err);
      },
    });
  }

  // We create the function to be able to save the project
  saveProject() {
    // validation check if any field is empty
    if (!this.newTitle || !this.newDescription || !this.newUrl) {
      alert('Please fill out all fields');
      return;
    }
    // Create the package (object) that we will send to Node.js
    const projectData = {
      title: this.newTitle,
      description: this.newDescription,
      url: this.newUrl,
    };

    // We make the HTTP request POST to the backend
    // Angular http requests use Observables, so we must call .subscribe() to execute them
    this.http.post('https://portafolio-web-nu-one.vercel.app/api/projects', projectData).subscribe({
      next: (response) => {
        console.log('Project successfully saved in backend', response);

        // If the server accepted it, we also push it to our local view array
        this.projects.push(projectData);

        // Reset the input variables back to empty strings
        this.newTitle = '';
        this.newDescription = '';
        this.newUrl = '';
        // Close the form panel automatically
        this.showform = false;
      },
      error: (err) => {
        console.error('Failed to send project to backend:', err);
        alert('Could not save to server. Is the backend running?');
      },
    });
  }

  // Function to open the project URL in a new browser tab
  goToProject(url: string) {
    // window.open takes the UR and '_blank' opens it in a new tab
    window.open(url, '_blank');
  }
}
