import { Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { InscriptionClientComponent } from './inscription-client/inscription-client.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminComponent } from './admin/admin.component';
import { FormulairesComponent } from './admin-formulaires/formulaires.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FormulaireDetailsComponent } from './admin-formulaireDetails/formulaire-details.component';
import { NouveauFormulaireComponent } from './admin-nouveauFormulaire/formulaire-nouveau.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch:'full' },
  { path: 'login', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionClientComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'formulaire', component: FormulairesComponent },
      { path: 'formulaires/:idtypeformulaire', component: FormulaireDetailsComponent },
      { path: 'nouveauFormulaire', component: NouveauFormulaireComponent }

    ]
  }
];
