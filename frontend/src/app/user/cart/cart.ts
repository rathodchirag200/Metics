import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cart: any = null;
  loading = true;
  shipping = 2.0;
  taxRate = 0.02;

  paymentmethod: string = 'COD';
  addresses: any[] = [];
  selectedAddressId: string = '';

  showSuccessModal = false;

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.fetchCart();
    this.fetchAddresses();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  fetchCart() {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}/cart/getcart`, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.cart = res.data ? res.data : res;

        this.calculateTotals();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Cart fetch error:', err);
        this.toastr.error('Failed to load cart');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  increase(item: any) {
    item.quantity++;
    this.calculateTotals();
    this.cartService.increaseLocalCount(1);

    this.http
      .post(
        `${this.apiUrl}/cart/increase`,
        { productId: item.productId._id },
        { headers: this.getHeaders() },
      )
      .subscribe({
        next: () => {
          this.toastr.success('Quantity increased');
          this.cdr.detectChanges();
        },
        error: () => {
          item.quantity--;
          this.calculateTotals();
          this.cartService.decreaseLocalCount(1);
          this.toastr.error('Failed to increase quantity');
          this.cdr.detectChanges();
        },
      });
  }

  decrease(item: any) {
    if (item.quantity <= 1) return;
    item.quantity--;
    this.calculateTotals();
    this.cartService.decreaseLocalCount(1);

    this.http
      .post(
        `${this.apiUrl}/cart/decrease`,
        { productId: item.productId._id },
        { headers: this.getHeaders() },
      )
      .subscribe({
        next: () => {
          this.toastr.info('Quantity decreased');
          this.cdr.detectChanges();
        },
        error: () => {
          item.quantity++;
          this.calculateTotals();
          this.cartService.increaseLocalCount(1);
          this.toastr.error('Failed to decrease quantity');
          this.cdr.detectChanges();
        },
      });
  }

  remove(item: any) {
    this.http
      .post(
        `${this.apiUrl}/cart/remove`,
        { productId: item.productId._id },
        { headers: this.getHeaders() },
      )
      .subscribe({
        next: () => {
          this.cart.items = this.cart.items.filter((i: any) => i._id !== item._id);
          this.cartService.fetchCartCount();
          this.calculateTotals();
          this.toastr.warning('Product removed from cart');
          this.cdr.detectChanges();
        },
        error: () => {
          this.toastr.error('Failed to remove product');
        },
      });
  }

  fetchAddresses() {
    this.http.get<any>(`${this.apiUrl}/address/get`, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.addresses = res.addresses || res;

        this.selectedAddressId = '';

        this.cdr.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to load addresses');
      },
    });
  }

  clearCart() {
    if (!confirm('Are you sure you want to clear the entire cart?')) return;

    this.http.post(`${this.apiUrl}/cart/clearcart`, {}, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.cart.items = [];
        this.cartService.clearCartCount();
        this.calculateTotals();
        this.toastr.success('Your cart is now empty');
      },
      error: () => {
        this.toastr.error('Failed to clear cart');
      },
    });
  }

  goToShop() {
    this.showSuccessModal = false;
    this.router.navigate(['/shop']);
  }

  checkout() {
    if (!this.selectedAddressId) {
      this.toastr.warning('Please select a delivery address');
      return;
    }

    const payload = {
      addressId: this.selectedAddressId,
      paymentmethod: this.paymentmethod,
    };

    this.http
      .post(`${this.apiUrl}/order/add`, payload, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: () => {
          this.toastr.success('Order placed successfully!');
          this.cartService.clearCartCount();

          this.showSuccessModal = true;

          // 🔥 FORCE UI UPDATE
          this.cdr.detectChanges();
        },
        error: () => {
          this.toastr.error('Failed to place order');
        },
      });
  }

  calculateTotals() {
    if (!this.cart || !this.cart.items) return;
    this.cart.subtotal = this.cart.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );
    this.cart.tax = +(this.cart.subtotal * this.taxRate).toFixed(2);
    this.cart.total = +(this.cart.subtotal + this.shipping + this.cart.tax).toFixed(2);
  }

  closeModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/my-orders']);
  }
}
