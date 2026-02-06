import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  currentUser = signal<any>(null);

  constructor() {
    this.fetchUser();
  }

  fetchUser() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${this.apiUrl}/currentuser`, { headers }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.currentUser.set(res.data);
        }
      },
      error: () => this.logout(),
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
}
