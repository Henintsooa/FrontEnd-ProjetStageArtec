import { Component, OnInit, Renderer2 } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../../services/AuthInterceptor.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DemandeService } from '../../services/demande.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule,HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  templateUrl: './admin-header.component.html'
})
export class AdminHeaderComponent implements OnInit {
  notifications: any[] = [];
  unreadCount: number = 0;
  bellClicked = false;
  dropdownOpen = false;

  constructor(private demandeService: DemandeService,private sidebarService: SidebarService,private authService: AuthService, private router: Router,private renderer: Renderer2) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

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
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.demandeService.getNotifications()
      .subscribe({
        next: (data) => {
          this.notifications = data.notifications;
          this.unreadCount = data.unreadCount;
        },
        error: (err) => console.error('Erreur lors de la récupération des notifications', err)
      });
  }



  markAsRead(notificationId: number, demandeId: number, notificationType: string): void {
    this.demandeService.markNotificationAsRead(notificationId)
      .subscribe({
        next: () => {
          // Mark the notification as read locally
          this.notifications = this.notifications.filter(n => n.idnotification !== notificationId);
          this.unreadCount--;

          if (notificationType === 'Renouvellement') {
            this.router.navigate(['/admin/renouvellement']);
          } else {
            this.router.navigate(['/admin/demandeDetails', demandeId]);
          }
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
