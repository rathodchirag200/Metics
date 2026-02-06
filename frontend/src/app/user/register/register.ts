import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.html',
})
export class Register {
  username = '';
  email = '';
  password = '';
  images: File | null = null;
  imagePreview: string | null = null;
  loading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.images = file;
    this.imagePreview = URL.createObjectURL(file);
  }

  private apiUrl = environment.apiUrl;

  register() {
    if (!this.username || !this.email || !this.password || !this.images) {
      this.error = 'All fields are required including a profile picture';
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('images', this.images);

    this.http.post<any>(`${this.apiUrl}/register`, formData).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      },
    });
  }
}
