import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  authService = inject(AuthService);

  user: any = null;
  loading = true;

  ngOnInit() {
    this.fetchCurrentUser();
  }

    private apiUrl = environment.apiUrl;

  fetchCurrentUser() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`${this.apiUrl}/currentuser`, { headers })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.user = res.data;
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
}
