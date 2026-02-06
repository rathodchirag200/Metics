import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private http = inject(HttpClient);

  products$ = new BehaviorSubject<any[]>([]);

  showEditModal = false;
  selectedProduct: any = {};
  previewImages: string[] = [];
  selectedFiles: File[] = [];
  isUpdating = false;

  showDeleteModal = false;
  deleteProductId: string | null = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<any>(`${this.apiUrl}/products/allproduct`).subscribe((res) => {
      if (res.success) {
        this.products$.next(res.data);
      }
    });
  }

  openEditModal(product: any) {
    this.selectedProduct = { ...product };
    this.previewImages = [];
    this.selectedFiles = [];
    this.showEditModal = true;
  }

  private apiUrl = environment.apiUrl;

  closeModal() {
    this.showEditModal = false;
    this.selectedProduct = {};
    this.previewImages = [];
    this.selectedFiles = [];
    this.isUpdating = false;
  }

  onImagesChange(event: any) {
    const files = event.target.files;
    if (!files) return;

    for (let file of files) {
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewImages.push(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  removeExistingImage(index: number) {
    this.selectedProduct.images.splice(index, 1);
  }

  removePreviewImage(index: number) {
    this.previewImages.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  updateProduct() {
    if (this.isUpdating) return;
    this.isUpdating = true;

    const id = this.selectedProduct._id;
    const formData = new FormData();

    formData.append('product_name', this.selectedProduct.product_name);
    formData.append('description', this.selectedProduct.description || '');
    formData.append('price', this.selectedProduct.price);
    formData.append('offer_price', this.selectedProduct.offer_price);
    formData.append('category', this.selectedProduct.category || '');
    formData.append('sub_category', this.selectedProduct.sub_category || '');
    formData.append('sizes', this.selectedProduct.sizes);
    formData.append('stock', this.selectedProduct.stock);

    if (this.selectedProduct.images) {
      this.selectedProduct.images.forEach((img: string) => {
        formData.append('existingImages', img);
      });
    }

    this.selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.http.put<any>(`${this.apiUrl}/products/edit/${id}`, formData).subscribe({
      next: (res) => {
        const updated = this.products$.value.map((p) => (p._id === id ? res.data : p));
        this.products$.next(updated);
        this.closeModal();
      },
      error: () => (this.isUpdating = false),
    });
  }

  // ---------- DELETE (ADDED ONLY) ----------
  openDeleteModal(id: string) {
    this.deleteProductId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteProductId = null;
  }

  confirmDelete() {
    if (!this.deleteProductId) return;

    this.http.delete(`${this.apiUrl}/products/delete/${this.deleteProductId}`).subscribe(() => {
      const filtered = this.products$.value.filter((p) => p._id !== this.deleteProductId);
      this.products$.next(filtered);
      this.closeDeleteModal();
    });
  }
}
