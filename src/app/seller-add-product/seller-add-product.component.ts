import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;
  imageError: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      category: ['', Validators.required]
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate image type (optional)
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.imageError = 'Only JPEG, PNG, and WebP images are allowed.';
        this.selectedFile = null;
      } else {
        this.imageError = '';
        this.selectedFile = file;
      }
    }
  }

  onSubmit() {
    if (this.productForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('productName', this.productForm.value.productName);
      formData.append('description', this.productForm.value.description || '');
      formData.append('price', this.productForm.value.price);
      formData.append('category', this.productForm.value.category);
      formData.append('image', this.selectedFile);

      this.productService.addProduct(formData).subscribe({
        next: () => {
          alert('Product added successfully!');
          this.productForm.reset();
          this.selectedFile = null;
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error adding product:', err);
          alert('Failed to add product.');
        }
      });
    } else {
      this.productForm.markAllAsTouched();
      if (!this.selectedFile) {
        this.imageError = 'Image is required.';
      }
    }
  }
}
