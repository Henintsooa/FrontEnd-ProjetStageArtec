import { Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { InscriptionClientComponent } from './inscription-client/inscription-client.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminComponent } from './admin/admin.component';
import { FormulairesComponent } from './admin/admin-formulaires/formulaires.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { FormulaireDetailsComponent } from './admin/admin-formulaireDetails/formulaire-details.component';
import { NouveauFormulaireComponent } from './admin/admin-nouveauFormulaire/formulaire-nouveau.component';
import { ModifierFormulaireComponent } from './admin/admin-modifier-formulaire/admin-modifier-formulaire.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminOperateurCiblesComponent } from './admin/admin-operateur-cibles/admin-operateur-cibles.component';
import { AdminNouvelOperateurComponent } from './admin/admin-nouvel-operateur/admin-nouvel-operateur.component';
import { AdminModifierOperateurComponent } from './admin/admin-modifier-operateur/admin-modifier-operateur.component';
import { AdminConvertirOperateurComponent } from './admin/admin-convertir-operateur/admin-convertir-operateur.component';
import { ClientComponent } from './client/client.component';
import { ClientAccueilComponent } from './client/client-accueil/client-accueil.component';
import { ClientSeDeclarerComponent } from './client/client-seDeclarer/client-seDeclarer.component';

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
  },
  {
    path: 'client',
    component: ClientComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' },
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', component: ClientAccueilComponent , canActivate: [AuthGuard], data: { expectedRole: 'user' } },
      { path: 'seDeclarer/:idtypeformulaire', component: ClientSeDeclarerComponent , canActivate: [AuthGuard], data: { expectedRole: 'user' } },


    ]
  }
];
