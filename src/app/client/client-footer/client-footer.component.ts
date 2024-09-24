import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-footer',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './client-footer.component.html',
  styleUrls: ['./client-footer.component.css']
})
export class ClientFooterComponent implements OnInit {
  adminEmails: string[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getAdminEmails().subscribe(
      emails => {
        this.adminEmails = emails;
      },
      error => {
        console.error('Erreur lors de la récupération des emails', error);
      }
    );
    console.log(this.adminEmails);
  }
}
