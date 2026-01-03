import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private http = inject(HttpClient);
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  Password: string = '';
  
  // Add toast properties
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'error';

  constructor(private router: Router) {}

  logFieldChange(fieldName: string, value: any): void {
    console.log(`${fieldName} changed to:`, value);
  }
  Register(): void {
    this.http.post('http://localhost:3000/users', {
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.Password
    }).subscribe({
      next: (response: any) => {
        this.showToastMessage('Registered successfully!', 'success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error: any) => {
        this.showToastMessage('Username already exists', 'error');
        console.error('Register failed:', error);
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