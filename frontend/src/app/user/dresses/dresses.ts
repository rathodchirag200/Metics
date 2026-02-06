import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dresses',

  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './dresses.html',
  styleUrl: './dresses.css',
})
export class Dresses {
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = 'All';
  loading = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }

    private apiUrl = environment.apiUrl;

  fetchProducts() {
    this.http.get<any>(`${this.apiUrl}/products/allproduct`).subscribe({
      next: (res) => {
        const allProducts = res.data || [];

        this.products = allProducts.filter(
          (p: any) => p.sub_category && p.sub_category.trim() === 'Dresses',
        );

        this.products.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter() {
    if (this.selectedCategory === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter((p) => p.category === this.selectedCategory);
    }

    this.cdr.detectChanges();
  }

  changeCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilter();
  }
}
