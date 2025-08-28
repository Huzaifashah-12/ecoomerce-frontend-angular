import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  get isLoggedIn$() {
    return this.isLoggedInSubject.asObservable();
  }

  login(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
