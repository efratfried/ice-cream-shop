import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  orderNum: number;
  order: any;

  constructor(private router: Router, private service: ApiService,private route:ActivatedRoute) {this.orderNum=Number(localStorage.getItem('orderId'))}

  ngOnInit(): void {
    
  }

  openCart() {
    this.router.navigate(['/payment', this.orderNum]);
  }
}
