import { Component, OnInit, Renderer2 } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DemandeService } from '../../services/demande.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './admin-header.component.html'
})
export class AdminHeaderComponent implements OnInit {
  notifications: any[] = [];
  bellClicked = false;
  dropdownOpen = false;

  constructor(private demandeService: DemandeService,private sidebarService: SidebarService,private authService: AuthService, private router: Router,private renderer: Renderer2) {}

  ngOnInit(): void {
    this.fetchNotifications();
    const dropdown = document.getElementById('dropdownMenuButton');
    if (dropdown) {
      this.renderer.listen(dropdown, 'shown.bs.dropdown', () => {
        this.dropdownOpen = true;
      });

      // Listener pour fermer le dropdown
      this.renderer.listen(dropdown, 'hidden.bs.dropdown', () => {
        this.dropdownOpen = false;
      });
    }
  }

  fetchNotifications(): void {
    this.demandeService.getNotifications()
      .subscribe({
        next: (data) => this.notifications = data,
        error: (err) => console.error('Erreur lors de la récupération des notifications', err)
      });
  }

  markAsRead(notificationId: number, demandeId: number): void {
    this.demandeService.markNotificationAsRead(notificationId)
      .subscribe({
        next: () => {
          // Mark the notification as read locally
          this.notifications = this.notifications.filter(n => n.idnotification !== notificationId);

          // Navigate to the demande details
          this.router.navigate(['/admin/demandeDetails', demandeId]);
        },
        error: (err) => console.error('Erreur lors de la mise à jour de la notification', err)
      });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleBellColor() {
    this.bellClicked = !this.bellClicked;
  }
  toggleNav() {
    this.sidebarService.toggleNav();
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
