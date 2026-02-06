import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './home.html',
})
export class Home {
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  placeholder = '/upload.png';

  productData = {
    product_name: '',
    description: '',
    price: null as number | null,
    offer_price: null as number | null,
    category: 'Men',
    sub_category: 'Topwear',
    stock: null as number | null,
  };

  availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  selectedSizes: string[] = [];

    private apiUrl = environment.apiUrl;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private toastr: ToastrService,
  ) {}

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file: any) => {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      });
    }
    event.target.value = '';
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  toggleSize(size: string) {
    const index = this.selectedSizes.indexOf(size);
    if (index > -1) {
      this.selectedSizes.splice(index, 1);
    } else {
      this.selectedSizes.push(size);
    }
  }

  onSubmit() {
    if (this.selectedFiles.length === 0) {
      this.toastr.warning('Please select at least one image', 'Warning');
      return;
    }

    const formData = new FormData();

    Object.entries(this.productData).forEach(([key, value]) => {
      formData.append(key, value !== null ? value.toString() : '');
    });

    this.selectedSizes.forEach((size) => {
      formData.append('sizes', size);
    });

    this.selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.http.post(`${this.apiUrl}/products/add`, formData).subscribe({
      next: () => {
        this.toastr.success('Product added successfully!', 'Success');
        this.resetForm();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error adding product', 'Error');
      },
    });
  }

  resetForm() {
    this.productData = {
      product_name: '',
      description: '',
      price: null,
      offer_price: null,
      category: 'Men',
      sub_category: 'Topwear',
      stock: null,
    };

    this.imagePreviews = [];
    this.selectedFiles = [];
    this.selectedSizes = [];
    this.cdr.detectChanges();
  }
}
