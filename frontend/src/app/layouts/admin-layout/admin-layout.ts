import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminHeader, AdminSidebar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const adminToken = localStorage.getItem('admintoken');

    if (!adminToken) {
      this.router.navigate(['/admin/login']);
    }
  }
}
