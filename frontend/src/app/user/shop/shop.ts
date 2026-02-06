import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];

  searchText = '';

  selectedCategories: string[] = [];
  selectedSubCategories: string[] = [];

  minPrice = 0;
  maxPrice = 1000;

  private apiUrl = environment.apiUrl;

  sortValue = 'default';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.http.get<any>(`${this.apiUrl}/products/allproduct`).subscribe((res) => {
      this.products = res.data;
      this.filteredProducts = [...this.products];
      this.cdr.detectChanges();
    });
  }


  toggleCategory(category: string) {
    this.toggleValue(this.selectedCategories, category);
    this.applyFilters();
  }

  toggleSubCategory(sub: string) {
    this.toggleValue(this.selectedSubCategories, sub);
    this.applyFilters();
  }

  toggleValue(arr: string[], value: string) {
    const index = arr.indexOf(value);
    index > -1 ? arr.splice(index, 1) : arr.push(value);
  }

  applyFilters() {
    let data = [...this.products];

    if (this.searchText) {
      data = data.filter((p) =>
        p.product_name.toLowerCase().includes(this.searchText.toLowerCase()),
      );
    }

    if (this.selectedCategories.length) {
      data = data.filter((p) => this.selectedCategories.includes(p.category));
    }

    if (this.selectedSubCategories.length) {
      data = data.filter((p) => this.selectedSubCategories.includes(p.sub_category));
    }

    data = data.filter((p) => p.offer_price >= this.minPrice && p.offer_price <= this.maxPrice);

    if (this.sortValue === 'low') {
      data.sort((a, b) => a.offer_price - b.offer_price);
    } else if (this.sortValue === 'high') {
      data.sort((a, b) => b.offer_price - a.offer_price);
    }

    this.filteredProducts = data;
  }
}
