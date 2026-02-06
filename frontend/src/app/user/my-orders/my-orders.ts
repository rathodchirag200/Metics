import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

    private apiUrl = environment.apiUrl;

  ngOnInit() {
    this.fetchOrders();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  fetchOrders() {
    this.http
      .get<any>(`${this.apiUrl}/order/get`, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          this.orders = res.orders || res.data || res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }



  // ✅ ONLY ADDITION — combines all product totals into one order total
  getOrderTotal(order: any): number {
    if (!order.items || !order.items.length) return 0;

    return order.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
  }
}
