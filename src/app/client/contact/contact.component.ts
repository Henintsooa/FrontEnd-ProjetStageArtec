import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-contacte',
  templateUrl: './contact.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./contact.component.css'],
})
export class ContactezNousComponent {
  email: string = '';
  name: string = '';
  message: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  userId: number | null = null;
  isLoading: boolean = false;

  constructor(private contactService: ContactService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.userId = this.getUserIdFromToken();
    console.log('ID de l\'utilisateur:', this.userId);
  }

  submitForm() {
    this.isLoading = true;
    const contactData = {
      email: this.email,
      name: this.name,
      message: this.message,
      id: this.userId,
    };

    this.contactService.sendContactMessage(contactData).subscribe(
      (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        this.errorMessage = null;
        // Réinitialisation du formulaire après succès
        this.email = '';
        this.name = '';
        this.message = '';
        this.renderer.selectRootElement('body', true).scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      (error) => {
        this.isLoading = false;
        this.successMessage = null;
        this.errorMessage = error.error.message || 'Erreur lors de l\'envoi du message';
        this.renderer.selectRootElement('body', true).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    );
  }

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Token décodé:', decodedToken);
        return decodedToken.sub || null;
      } catch (e) {
        console.error('Erreur lors du décodage du token', e);
        return null;
      }
    }
    return null;
  }
}
