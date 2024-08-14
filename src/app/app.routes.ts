import { Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { InscriptionClientComponent } from './inscription-client/inscription-client.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminComponent } from './admin/admin.component';
import { FormulairesComponent } from './admin-formulaires/formulaires.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FormulaireDetailsComponent } from './admin-formulaireDetails/formulaire-details.component';
import { NouveauFormulaireComponent } from './admin-nouveauFormulaire/formulaire-nouveau.component';
import { ModifierFormulaireComponent } from './admin-modifier-formulaire/admin-modifier-formulaire.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminOperateurCiblesComponent } from './admin-operateur-cibles/admin-operateur-cibles.component';
import { AdminNouvelOperateurComponent } from './admin-nouvel-operateur/admin-nouvel-operateur.component';
import { AdminModifierOperateurComponent } from './admin-modifier-operateur/admin-modifier-operateur.component';
import { AdminConvertirOperateurComponent } from './admin-convertir-operateur/admin-convertir-operateur.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch:'full' },
  { path: 'login', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionClientComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent , canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'formulaire', component: FormulairesComponent , canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'formulaires/:idtypeformulaire', component: FormulaireDetailsComponent , canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'nouveauFormulaire', component: NouveauFormulaireComponent , canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'editFormulaire/:id', component: ModifierFormulaireComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'operateurCibles', component: AdminOperateurCiblesComponent  , canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'nouvelOperateur', component: AdminNouvelOperateurComponent , canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'editOperateurCible/:id', component: AdminModifierOperateurComponent , canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'convertirOperateur', component: AdminConvertirOperateurComponent  , canActivate: [AuthGuard], data: { expectedRole: 'admin' } },

    ]
  }
];
