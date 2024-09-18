import { Component } from '@angular/core';
import { DemandeService } from '../../services/demande.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule,Location } from '@angular/common';

interface DocumentSupplementaire {
  nomdocument: string;
  filesupplementaire: string;
}

interface Response {
  iddemande: number;
  datedemande: string;
  datedeclaration: string;
  dateexpiration: string;
  status: number;
  idoperateurinformation: number;
  email: string;
  nomoperateur: string;
  adresse: string;
  telephone: string;
  telecopie: string;
  nomville: string;
  nomstructurejuridique: string;
  nomtypeformulaire: string;
  textquestion: string;
  textereponse?: string;
  nombrereponse?: number;
  filereponse?: string;
  typequestion: string;
  nomcategoriequestion: string;

}
@Component({
  selector: 'app-demande-details',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule,ReactiveFormsModule],
  templateUrl: './demande-details.component.html',
  styleUrl: './demande-details.component.css'
})
export class ClientDemandeDetailsComponent {
  public details: Response[] = [];
  public categories: any[] = [];
  public iddemande!: number;
  isCollapsed: boolean[] = [];
  isCollapsedStatic: boolean = false;
  isCollapsedDoc: boolean = false;
  documentssupplementaires: DocumentSupplementaire[] = [];


  constructor(
    private demandeService: DemandeService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location
  ){
    this.isCollapsed = this.groupByCategory(this.details).map(() => true);

  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.iddemande = +params.get('iddemande')!;
      this.fetchDetails();
    });
  }

  getStatusLabel(status: number | null): string {
    switch (status) {
      case 1:
        return 'En attente de validation';
      case 2:
        return 'Validée';
      case 0:
        return 'Refusée';
      case null:
        return 'En attente d\'information supplémentaire';
      default:
        return 'Inconnu';
    }
  }


  hasDeclarationDate(): boolean {
    return this.details.length > 0 && this.details[0].datedeclaration != null;
  }
  exportPdf(idDemande: number): void {
    this.demandeService.exportPdf(idDemande).subscribe(
      (response: string) => {
        // Nettoyez l'URL pour enlever les barres obliques échappées
        const cleanedUrl = response
          .replace(/^"|"$/g, '') // Supprimer les guillemets autour de l'URL
          .replace(/\\\//g, '/'); // Remplacer les barres obliques échappées par des barres obliques normales

        console.log('URL nettoyée :', cleanedUrl); // Affichez l'URL nettoyée pour vérification

        window.open(cleanedUrl, '_blank');
      },
      (error) => {
        console.error('Erreur lors de l\'export PDF', error);
      }
    );
  }

  fetchDetails(): void {
    this.demandeService.getResponsesByDemande(this.iddemande).subscribe(
      (data: any[]) => {
        console.log('Données récupérées:', data);
        this.details = data;
        this.documentssupplementaires = [];

        data.forEach(item => {
          if (item.documentssupplementaires) {
            try {
              const docs = JSON.parse(item.documentssupplementaires);
              // Filtrer les documents dont les valeurs ne sont pas null
              const filteredDocs = docs.filter((doc: DocumentSupplementaire) =>
                doc.nomdocument && doc.filesupplementaire
              );
              this.documentssupplementaires = [
                ...this.documentssupplementaires,
                ...filteredDocs
              ];
            } catch (error) {
              console.error('Erreur lors de l\'analyse JSON:', error);
            }
          }
        });

        // Enlève les doublons des documents
        this.documentssupplementaires = this.removeDuplicates(this.documentssupplementaires);

        console.log('Documents supplémentaires:', this.documentssupplementaires);
        this.categorizeDetails();  // Organiser les détails par catégorie
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails:', error);
      }
    );
  }

  removeDuplicates(array: DocumentSupplementaire[]): DocumentSupplementaire[] {
    const uniqueDocs = new Map();
    array.forEach(doc => {
      uniqueDocs.set(doc.filesupplementaire, doc);
    });
    return Array.from(uniqueDocs.values());
  }

  private categorizeDetails(): void {
    this.categories = this.groupByCategory(this.details);
    this.isCollapsed = this.categories.map(() => false);
  }

  private groupByCategory(details: Response[]): any[] {
    const grouped: { [key: string]: { name: string, questions: Response[] } } = {};
    details.forEach(detail => {
      const categoryName = detail.nomcategoriequestion || 'Sans catégorie';
      if (!grouped[categoryName]) {
        grouped[categoryName] = { name: categoryName, questions: [] };
      }
      grouped[categoryName].questions.push(detail);
    });
    return Object.values(grouped);
  }

  toggleCollapseStatic() {
    this.isCollapsedStatic = !this.isCollapsedStatic;
  }
  toggleCollapseDoc() {
    this.isCollapsedDoc = !this.isCollapsedDoc;
    console.log('Toggle button clicked!');
  }
  toggleCollapse(index: number) {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

}
