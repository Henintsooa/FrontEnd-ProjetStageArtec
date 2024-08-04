import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderClientComponent } from './header-client/header-client.component';
import { InscriptionClientComponent } from './inscription-client/inscription-client.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,HeaderClientComponent,InscriptionClientComponent,ConnexionComponent,ResetPasswordComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  userRole: string='';

  ngOnInit() {
    // Logique pour obtenir le rôle de l'utilisateur
    // Par exemple, depuis un service d'authentification
    this.userRole = 'admin'; // ou 'client', selon le rôle de l'utilisateur connecté
  }

}
