import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  editProduct(id: string) {
    this.router.navigate(['/update-product', id]);
  }

  deleteProduct(id: string) {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        alert('Product deleted successfully!');
        this.loadProducts(); // Reload the list after deletion
      },
      error: (err) => {
        console.error('Error deleting product:', err);
        alert('Failed to delete the product.');
      }
    });
  }
}
