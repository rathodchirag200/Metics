import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-newarrivals',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './newarrivals.html',
  styleUrl: './newarrivals.css',
})
export class Newarrivals implements OnInit {
  products: any[] = [];
  loading = true;

  @ViewChild('swiper', { static: false }) swiperEl!: ElementRef;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

    private apiUrl = environment.apiUrl;

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<any>(`${this.apiUrl}/products/allproduct`).subscribe({
      next: (res) => {
        this.products = res.data;
        this.loading = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          if (this.swiperEl && this.swiperEl.nativeElement.swiper) {
            this.swiperEl.nativeElement.swiper.update();
          }
        }, 100);
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.loading = false;
      },
    });
  }
}
