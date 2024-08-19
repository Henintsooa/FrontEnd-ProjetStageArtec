import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminAsideComponent } from './admin-aside/admin-aside.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, AdminHeaderComponent, AdminAsideComponent],
  templateUrl: './admin.component.html',

})
export class AdminComponent {

}
