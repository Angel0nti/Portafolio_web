import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactInfo = {
    email: 'angel0ntialv21@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/luis-angel-ontiveros-alvarez-568146345/',
    whatsappUrl: 'https://wa.me/526182945349',
  };
}
