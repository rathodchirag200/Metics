import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader {
  constructor(private router: Router, private sidebarService: SidebarService) {}

  toggleMenu() {
    this.sidebarService.toggle();
  }

  logout() {
    localStorage.removeItem('admintoken');
    this.router.navigate(['/admin/login']);
  }
}
