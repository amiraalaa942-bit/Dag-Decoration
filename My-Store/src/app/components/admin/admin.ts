import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Painting {
  PicId: number;
  Price: number;
  Height: number;
  Width: number;
  Quantity: number
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private http = inject(HttpClient);

  newPainting = {
    name: '',
    price: 0,
    height: 0,
    width: 0
  };
  // Form for painting data
  paintingForm!: FormGroup;
  paintings: Painting[] = [];
  error: string = ''
  selectedFile: File | null = null;
  loading = true;

  // Add toast properties
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'error';

  ngOnInit(): void {
    if (!localStorage.getItem('tokenAdmin')) {
      this.showToastMessage('Please login as admin', 'error');
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);
      return;
    }
  }

  constructor(private router: Router) { }

  handleFileChange(event: any): void {
    const file: File = event.target.files[0];
      if (event && event.target && event.target.files && event.target.files.length > 0) {
      this.selectedFile = file;
    }
  }

    logFieldChange(fieldName: string, value: any): void {
      console.log(`${fieldName} changed to:`, value);
    }

  AddPainting(): void {
    const AdminToken = localStorage.getItem('tokenAdmin')
    if (this.selectedFile === null) {
      this.showToastMessage('Please select an image file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('name', this.newPainting.name.toString());
    formData.append('Price', this.newPainting.price.toString());
    formData.append('Height', this.newPainting.height.toString());
    formData.append('Width', this.newPainting.width.toString());

    this.http.post('http://localhost:3000/paintings', formData,
      {
        headers: { 'Authorization': `Bearer ${AdminToken}` },
      }
    ).subscribe({
      next: () => {
        this.selectedFile = null;
        this.newPainting = {
          name: '',
          price: 0,
          height: 0,
          width: 0
        }
        this.showToastMessage('Painting added successfully!', 'success');
        this.loadPaintings();
      },
      error: (error) => {
        this.showToastMessage('Failed to add painting', 'error');
        console.error('Upload failed:', error);
      }
    });
  }

  loadPaintings(): void {
    this.loading = true;
    this.http.get<Painting[]>('http://localhost:3000/paintingsInfo')
      .subscribe({
        next: (data) => {
          this.paintings = data;
          this.loading = false;
        },
        error: (error) => {
          this.showToastMessage('Failed to load paintings', 'error');
          this.loading = false;
          console.error('Error loading paintings:', error);
        }
      });
  }


  // Add toast method
  private showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}