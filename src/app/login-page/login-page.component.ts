import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HomePageComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit {
  orderNumber: number = 1;
  order: any;
  success: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: ApiService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    localStorage.setItem('orderId', 'value');
    if (window.location.href.includes('success')) {
      this.openSuccessDialog();
    }
  }

  openSuccessDialog(): void {
    this.dialog.open(SuccessDialogComponent);
  }
  
  onExistingOrder() {
    this.service.getOrder(this.orderNumber).subscribe((res) => {
      if (res) {
        localStorage.setItem('orderId', this.orderNumber.toString());
        this.router.navigate(['payment', this.orderNumber]);
      } else {
        alert("אנא הזן מס' הזמנה");
      }
    });
  }

  onNewOrder() {
    this.service.addOrder({}).subscribe((res) => {
      this.orderNumber = res.id;
      localStorage.setItem('orderId', this.orderNumber.toString());
    });
    this.router.navigate(['/home', this.orderNumber]);
  }
}
