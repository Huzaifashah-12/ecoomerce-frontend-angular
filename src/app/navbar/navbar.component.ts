import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SellerService } from '../services/seller.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentRoute = '';

  constructor(private sellerService: SellerService, private router: Router) {}

  ngOnInit(): void {
    this.sellerService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    // Detect route changes
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });

    // Set initial route
    this.currentRoute = this.router.url;
  }

  logout(): void {
    this.sellerService.logout();
    this.router.navigate(['/seller-auth']);
  }

isSellerPage(): boolean {
  return [ '/add-product', '/product-list','/profile'].some(route =>
    this.currentRoute.startsWith(route)
  );
}
 
}
