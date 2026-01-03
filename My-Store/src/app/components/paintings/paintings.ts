import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormsModule } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-paintings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './paintings.html',
  styleUrl: './paintings.css',
})
export class Paintings implements OnInit {
  private http = inject(HttpClient);
  private Api = inject(Api);
  IsClient = localStorage.getItem('tokenClient');
  IsAdmin = localStorage.getItem('tokenAdmin');

  newPainting = {
    name: '',
    price: 0,
    height: 0,
    width: 0
  };
  paintingForm!: FormGroup;
  paintings: Painting[] = [];
  cart: Painting[] = [];
  loading = true;
  error = '';
  selectedFile: File | null = null;
  
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  user: any;

  ngOnInit(): void {
    if (!localStorage.getItem('tokenClient') && !localStorage.getItem('tokenAdmin')) {
      this.router.navigate(['/']);
    }
    this.loadPaintings();
  }

  constructor(private router: Router) {}

  loadPaintings(): void {
    this.loading = true;
    this.http.get<Painting[]>('http://localhost:3000/paintingsInfo')
      .subscribe({
        next: (data) => {
          this.paintings = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load paintings';
          this.loading = false;
          this.showToastMessage('Failed to load paintings. Please try again.', 'error');
          console.error('Error loading paintings:', error);
        }
      });
  }

  getImage(picid: number, width?: number, height?: number): string {
    let url = `http://localhost:3000/paintingImage/${picid}`;
    if (width || height) {
      const params = [];
      if (width) params.push(`Width=${width}`);
      if (height) params.push(`Height=${height}`);
      url += '?' + params.join('&');
    }
    return url;
  }

  AddtoCart(paintingId: number): void {
    this.Api?.getCurrentUser().subscribe({
      next: (user: any) => {
        if (!user) {
          this.showToastMessage('Please login first to add items to cart', 'error');
          this.router.navigate(['/login']);
          return;
        }
        this.Api?.setCartData(paintingId);
        this.showToastMessage('Added to cart successfully!', 'success');
      },
      error: (error) => {
        this.showToastMessage('Please login first to add items to cart', 'error');
        this.router.navigate(['/login']);
      }
    });
  }

  async onDeletePainting(picid: number): Promise<void> {
    try {
      await this.DeletePainting(picid);
      this.showToastMessage('Painting deleted successfully', 'success');
    } catch (error) {
      this.showToastMessage('Failed to delete painting', 'error');
    }
  }

  DeletePainting(picid: number): Promise<void> {
    return new Promise((resolve, reject) => this.http.delete('http://localhost:3000/paintings', {
      headers: { 'Authorization': `Bearer ${this.IsAdmin}` },
      body: { picId: picid }
    }).subscribe({
      next: () => {
        this.loadPaintings();
        resolve();
      },
      error: (error) => {
        console.error('Failed to delete painting:', error);
        this.showToastMessage('Failed to delete painting', 'error');
        reject(error);
      }
    }));
  }

  LogOut(): void {
    localStorage.removeItem('tokenClient');
    localStorage.removeItem('tokenAdmin');
    this.showToastMessage('Logged out successfully', 'success');
    setTimeout(() => {
      this.router.navigate(['']);
    }, 500);
  }

  private showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }


}