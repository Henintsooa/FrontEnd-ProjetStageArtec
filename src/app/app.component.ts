import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderAsideComponent } from './header-aside/header-aside.component';
import { HeaderClientComponent } from './header-client/header-client.component';
import { InscriptionClientComponent } from './inscription-client/inscription-client.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,HeaderAsideComponent,HeaderClientComponent,InscriptionClientComponent],
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
