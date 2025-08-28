import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
  
@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
   imports: [
    ReactiveFormsModule,   CommonModule ],
  
})
export class UpdateProductComponent implements OnInit {
  productForm: FormGroup;
  productId: string = '';
  
  selectedFile: File | null = null;
  imageError: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      category: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = id;
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue({
            productName: product.productName,
            description: product.description,
            price: product.price,
            category: product.category
          });
        },
        error: (err) => {
          console.error('Error loading product:', err);
          alert('Failed to load product details.');
        }
      });
    } else {
      alert('Invalid product ID.');
      this.router.navigate(['/products']);
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.imageError = '';
    } else {
      this.selectedFile = null;
      this.imageError = 'Only image files are allowed.';
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const formValues = this.productForm.value;

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('productName', formValues.productName);
      formData.append('description', formValues.description);
      formData.append('price', formValues.price);
      formData.append('category', formValues.category);
      formData.append('image', this.selectedFile);

      this.productService.updateProductWithImage(this.productId, formData).subscribe({
        next: () => {
          alert('Product updated with image!');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Update with image failed:', err);
          alert('Failed to update product.');
        }
      });
    } else {
      this.productService.updateProduct(this.productId, formValues).subscribe({
        next: () => {
          alert('Product updated!');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Failed to update product.');
        }
      });
    }
  }
}
