import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  orders: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

    private apiUrl = environment.apiUrl;

  fetchOrders() {
    this.http.get<any>(`${this.apiUrl}/order/allorders`).subscribe((res) => {
      this.orders = res.orders;
      this.cdr.detectChanges();
    });
  }

  updateOrderStatus(orderId: string, status: string) {
    this.http
      .post<any>(`${this.apiUrl}/order/updatestaus`, {
        orderId: orderId,
        status: status,
      })
      .subscribe({
        next: (res) => {
          this.fetchOrders();
        },
        error: (err) => {
          console.error('Update failed', err);
          alert('Failed to update status');
        },
      });
  }
}
