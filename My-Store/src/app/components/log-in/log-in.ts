import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-log-in',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {
  private http = inject(HttpClient);
  username: string = '';
  Password: string = '';
  
  // Toast/Snackbar properties
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'error';

  constructor(private router: Router) {}

  logFieldChange(fieldName: string, value: any): void {
    console.log(`${fieldName} changed to:`, value);
  }

  loginAsAdmin(): void {
    localStorage.removeItem('tokenClient');
    
    this.http.post('http://localhost:3000/admin/login', {
      username: this.username,
      password: this.Password
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('tokenAdmin', response.token);
        this.showToastMessage('Admin login successful!', 'success');
        setTimeout(() => {
          this.router.navigate(['/paintings']);
        }, 500);
      },
      error: (error: any) => {
        this.showToastMessage('Invalid admin credentials', 'error');
        console.error('Admin login failed:', error);
      }
    });
  }

  loginAsClient(): void {
    localStorage.removeItem('tokenAdmin');
    
    this.http.post('http://localhost:3000/login', {
      username: this.username,
      password: this.Password
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('tokenClient', response.token);
        this.showToastMessage('Login successful!', 'success');
        setTimeout(() => {
          this.router.navigate(['/paintings']);
        }, 500);
      },
      error: (error: any) => {
        this.showToastMessage('Invalid credentials. Please register first.', 'error');
        console.error('Client login failed:', error);
      }
    });
  }



  private showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }
}