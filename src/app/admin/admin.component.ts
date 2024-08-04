import { Component } from '@angular/core';
import { AdminAsideComponent } from '../admin-aside/admin-aside.component';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, AdminHeaderComponent, AdminAsideComponent],
  templateUrl: './admin.component.html',

})
export class AdminComponent {

}
