import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';


@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  isOpen = false;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.sidebarState$.subscribe(state => {
      this.isOpen = state;
    });
  }

  closeSidebar() {
    this.sidebarService.close();
  }
}
