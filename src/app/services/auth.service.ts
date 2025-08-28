// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private BASE_URL = 'http://localhost:5000/api/auth';                             

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, data);

  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, data);
  }

  // Add this function to handle Google OAuth tokens
  googleAuth(endpoint: string, token: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/${endpoint}`, { token });
  }
}
