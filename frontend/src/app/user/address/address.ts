import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address.html',
  styleUrl: './address.css',
})
export class Address {
  fullName = '';
  phone = '';
  pin = '';
  address = '';
  city = '';
  state = '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  private apiUrl = environment.apiUrl;

  submitAddress() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.toastr.error('Please login first');
      return;
    }

    if (!this.fullName || !this.phone || !this.pin || !this.address || !this.city || !this.state) {
      this.toastr.warning('Please fill all fields');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      fullName: this.fullName,
      phone: this.phone,
      pin: this.pin,
      address: this.address,
      city: this.city,
      state: this.state,
    };

    this.http.post(`${this.apiUrl}/address/add`, body, { headers }).subscribe({
      next: (res) => {
        console.log('Address saved:', res);
        this.toastr.success('Address added successfully!');

        this.fullName = '';
        this.phone = '';
        this.pin = '';
        this.address = '';
        this.city = '';
        this.state = '';

        this.router.navigate(['/cart']);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error?.message || 'Failed to add address');
      },
    });
  }
}
