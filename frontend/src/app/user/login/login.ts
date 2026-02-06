// src/app/login/login.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  loading = false;
  error = '';

  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

    private apiUrl = environment.apiUrl;

  login() {
    if (!this.email || !this.password) {
      this.error = 'All fields are required';
      return;
    }

    this.loading = true;
    this.error = '';

    const body = { email: this.email, password: this.password };

    this.http.post<any>(`${this.apiUrl}/login`, body).subscribe({
      next: (res) => {
        // 1. Save Token
        localStorage.setItem('token', res.token);

        // 2. TRIGGER INSTANT UPDATE in AuthService
        this.authService.fetchUser();

        // 3. Navigate home
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      },
    });
  }
}
