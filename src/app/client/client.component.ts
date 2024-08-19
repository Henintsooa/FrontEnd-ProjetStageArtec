import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientHeaderComponent } from './client-header/client-header.component';
import { ClientFooterComponent } from "./client-footer/client-footer.component";

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, ClientHeaderComponent, ClientFooterComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {

}
