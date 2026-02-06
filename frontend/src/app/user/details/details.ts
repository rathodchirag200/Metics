import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  product: any = null;
  selectedImage: string = '';
  quantity: number = 1;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cartService: CartService,
    private toastr: ToastrService,
  ) {}

  private apiUrl = environment.apiUrl;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return;

      this.loading = true;
      this.fetchProductDetails(id);
    });
  }

  fetchProductDetails(id: string) {
    this.http.get<any>(`${this.apiUrl}/products/product/${id}`).subscribe({
      next: (res) => {
        this.product = res.data ? res.data : res;

        if (this.product && this.product.images) {
          this.selectedImage = this.product.images[0];
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.loading = false;
      },
    });
  }

  getImage(img: string) {
    return `${img}`;
  }

  addToCart() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('Please login first');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = { productId: this.product._id };

    this.cartService.increaseLocalCount(1);

    this.http.post(`${this.apiUrl}/cart/addtocart`, payload, { headers }).subscribe({
      next: () => {
        this.cartService.fetchCartCount();
        this.toastr.success('Product added to cart');
      },
      error: () => {
        this.cartService.decreaseLocalCount(1);
        this.toastr.success('Failed to add product to cart');
      },
    });
  }

  changeImage(img: string) {
    this.selectedImage = img;
  }

  increaseQty() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('Please login first');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = { productId: this.product._id };

    this.cartService.increaseLocalCount(1);

    this.http.post(`${this.apiUrl}/cart/increase`, payload, { headers }).subscribe({
      next: () => {
        this.cartService.fetchCartCount();
        this.toastr.success('Product added to cart');
      },
      error: () => {
        this.cartService.decreaseLocalCount(1);
        this.toastr.error('Failed to increase quantity');
      },
    });
  }

  decreaseQty() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = { productId: this.product._id };

    this.cartService.decreaseLocalCount(1);

    this.http.post(`${this.apiUrl}/cart/decrease`, payload, { headers }).subscribe({
      next: () => {
        this.cartService.fetchCartCount();
        this.toastr.success('Quantity decreased');
      },
      error: () => {
        this.cartService.increaseLocalCount(1);
        this.toastr.error('Failed to decrease quantity');
      },
    });
  }
}
