import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DemandeService } from '../../services/demande.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


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
interface DocumentSupplementaire {
  nomdocument: string;
  filesupplementaire: string;
}
@Component({
  selector: 'app-demande-details',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule,ReactiveFormsModule],
  templateUrl: './demande-details.component.html',
  styleUrls: ['./demande-details.component.css']
})
export class DemandeDetailsComponent implements OnInit {
  public details: Response[] = [];
  public categories: any[] = [];
  public iddemande!: number;
  isCollapsed: boolean[] = [];
  isCollapsedStatic: boolean = false;
  isCollapsedDoc: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  infoRequestMessage: string = '';
  declarationDate: string = '';
  nomfichier: string = '';
  fichier: File | null = null;
  documentssupplementaires: DocumentSupplementaire[] = [];
  form: FormGroup;

  constructor(
    private demandeService: DemandeService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.isCollapsed = this.groupByCategory(this.details).map(() => true);
    this.form = this.fb.group({
      nomfichier: ['', Validators.required], // champ obligatoire
      fichier: [null, Validators.required]  // champ obligatoire
    });
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.iddemande = +params.get('iddemande')!;
      this.fetchDetails();
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({
        fichier: file
      });
      this.form.get('fichier')?.updateValueAndValidity();
    }
  }

  // Méthode de soumission du formulaire
  onSubmitDocumentSupplementaire(iddemande: number): void {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('nomfichier', this.form.get('nomfichier')?.value);
      formData.append('fichier', this.form.get('fichier')?.value);

      this.demandeService.addDocumentSupplementaire(iddemande, formData).subscribe(
        (response) => {
          this.successMessage = response.message; // Message de succès renvoyé par le backend
          this.errorMessage = null; // Réinitialiser l'erreur s'il y en avait
          console.log('Fichier ajouté avec succès :', response.fileUrl);
        },
        (error) => {
          this.successMessage = null; // Réinitialiser le message de succès
          this.errorMessage = error.error.message || 'Erreur lors de l\'ajout du fichier.';
          console.error('Erreur lors de l’ajout du fichier :', error);
        }
      );
    }
  }


  onSubmitDateDeclaration(iddemande: number) {
    if (this.declarationDate) {
      this.demandeService.addDateDeclaration(iddemande, this.declarationDate).subscribe(
        response => {
          this.successMessage = "Date de déclaration enregistrée avec succès.";
          this.errorMessage = null;
        },
        error => {
          // Gérer l'erreur et afficher les détails de l'erreur retournée par le backend
          this.errorMessage = "Erreur lors de l'enregistrement de la date. Détails : " + (error.error.message || error.message || "Une erreur est survenue.");
          if (error.error.errors) {
            // Si l'erreur contient des détails de validation, les afficher
            for (const key in error.error.errors) {
              if (error.error.errors.hasOwnProperty(key)) {
                this.errorMessage += ` ${key}: ${error.error.errors[key].join(', ')}`;
              }
            }
          }
          this.successMessage = null;
        }
      );
    } else {
      this.errorMessage = "Veuillez sélectionner une date.";
      this.successMessage = null;
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

  public getResponse(questionId: number): Response | undefined {
    return this.details.find(detail => detail.iddemande === questionId);
  }

  toggleCollapseStatic() {
    this.isCollapsedStatic = !this.isCollapsedStatic;
  }
  toggleCollapseDoc() {
    this.isCollapsedDoc = !this.isCollapsedDoc;
  }
  toggleCollapse(index: number) {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  confirmValidation(): void {
    this.demandeService.accepterDemande(this.iddemande).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Succès',
          text: response.message || 'Demande validée avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'modal-content modal-dialog modal-dialog-centered', // Utiliser les classes Bootstrap 5 pour centrer le contenu
            title: 'modal-title h5', // Titre
            confirmButton: 'btn btn-primary'  // Bouton de confirmation
          },
          width: '90vw', // Largeur responsive
          padding: '1.25rem', // Padding pour le contenu
          buttonsStyling: false, // Désactiver le style par défaut pour utiliser Bootstrap
          // Ajoutez ici du CSS inline pour le max-width
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
              popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
            }
          }
        });
        this.closeModal();
        console.log('Demande validée:', response);
      },
      error: (error) => {
        Swal.fire({
          title: 'Erreur',
          text: error.error?.error || 'Une erreur est survenue lors de la validation de la demande.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'modal-content modal-dialog modal-dialog-centered',
            title: 'modal-title h5',
            confirmButton: 'btn btn-primary'
          },
          width: '90vw', // Largeur responsive
          padding: '1.25rem', // Padding pour le contenu
          buttonsStyling: false,
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
              popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
            }
          }
        });
        this.closeModal();
        console.error('Erreur lors de la validation:', error);
      }
    });
  }

  confirmSuppression(): void {
    this.demandeService.refuserDemande(this.iddemande).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Succès',
          text: response.message || 'Demande refusée avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'modal-content modal-dialog modal-dialog-centered',
            title: 'modal-title h5',
            confirmButton: 'btn btn-primary'
          },
          width: '90vw', // Largeur responsive
          padding: '1.25rem', // Padding pour le contenu
          buttonsStyling: false,
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
              popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
            }
          }
        });
        this.closeModalSuppression();
        console.log('Demande refusée:', response);
      },
      error: (error) => {
        Swal.fire({
          title: 'Erreur',
          text: error.error?.error || 'Une erreur est survenue lors de la suppression de la demande.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'modal-content modal-dialog modal-dialog-centered',
            title: 'modal-title h5',
            confirmButton: 'btn btn-primary'
          },
          width: '90vw', // Largeur responsive
          padding: '1.25rem', // Padding pour le contenu
          buttonsStyling: false,
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
              popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
            }
          }
        });
        this.closeModalSuppression();
        console.error('Erreur lors de la suppression:', error);
      }
    });
  }

  sendInfoRequest(): void {
    if (this.infoRequestMessage.trim()) {
      this.demandeService.sendInfoRequest(this.iddemande, this.infoRequestMessage).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Succès',
            text: 'Demande d\'information envoyée avec succès.',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'modal-content modal-dialog modal-dialog-centered',
              title: 'modal-title h5',
              confirmButton: 'btn btn-primary'
            },
            width: '90vw', // Largeur responsive
            padding: '1.25rem', // Padding pour le contenu
            buttonsStyling: false,
            didOpen: () => {
              const popup = Swal.getPopup();
              if (popup) {
                popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
                popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
              }
            }
          });
          this.infoRequestMessage = ''; // Réinitialiser le message
          this.closeInfoRequestModal();
        },
        error: (error) => {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'envoi de la demande d\'information.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'modal-content modal-dialog modal-dialog-centered',
              title: 'modal-title h5',
              confirmButton: 'btn btn-danger'
            },
            width: '90vw', // Largeur responsive
            padding: '1.25rem', // Padding pour le contenu
            buttonsStyling: false,
            didOpen: () => {
              const popup = Swal.getPopup();
              if (popup) {
                popup.style.maxWidth = '450px'; // Largeur maximale pour les grands écrans
                popup.style.width = '90vw'; // Largeur responsive pour les petits écrans
              }
            }
          });
          this.closeInfoRequestModal();
          console.error('Erreur lors de l\'envoi de la demande d\'information:', error);
        }
      });
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';

        // Supprimer l'overlay sombre (backdrop)
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.parentNode?.removeChild(backdrop);
        }

        // Réactiver le scroll du corps de la page
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
    }
  }


  closeModalSuppression(): void {
    const modalElement = document.getElementById('refusModal');
    if (modalElement) {
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';

        // Supprimer l'overlay sombre (backdrop)
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.parentNode?.removeChild(backdrop);
        }

        // Réactiver le scroll du corps de la page
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
    }
  }


  closeInfoRequestModal(): void {
    const modalElement = document.getElementById('infoRequestModal');
    if (modalElement) {
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';

      // Supprimer l'overlay sombre (backdrop)
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
          backdrop.parentNode?.removeChild(backdrop);
      }

      // Réactiver le scroll du corps de la page
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return 'Refusé';
      case 2:
        return 'Accepté';
      default:
        return 'En attente d\'information supplémentaire';
    }
  }
}
