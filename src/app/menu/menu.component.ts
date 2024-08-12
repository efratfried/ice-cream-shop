import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlavorCardComponent } from '../flavor-card/flavor-card.component';
import { CartComponent } from '../cart/cart.component';
import { ApiService } from '../api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FlavorCardComponent, CartComponent, HttpClientModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  mockData: any;
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.apiService.getFlavors().subscribe((res) => {
      this.mockData = res;
    });
  }
}
