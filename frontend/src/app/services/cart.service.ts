import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartCountSource = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSource.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  setCartCount(count: number) {
    this.cartCountSource.next(count);
  }

  increaseLocalCount(qty: number = 1) {
    this.cartCountSource.next(this.cartCountSource.value + qty);
  }

  decreaseLocalCount(qty: number = 1) {
    const newVal = Math.max(0, this.cartCountSource.value - qty);
    this.cartCountSource.next(newVal);
  }

  fetchCartCount() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`${this.apiUrl}/cart/getcart`, { headers }).subscribe({
      next: (res) => {
        const items = res.data?.items || [];
        const totalQty = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        this.setCartCount(totalQty);
      },
    });
  }

  clearCartCount() {
    this.cartCountSource.next(0);
  }
}
