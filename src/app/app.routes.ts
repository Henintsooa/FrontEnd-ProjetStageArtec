import { Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { InscriptionClientComponent } from './inscription-client/inscription-client.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch:'full' },
  { path: 'login', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionClientComponent }
];
