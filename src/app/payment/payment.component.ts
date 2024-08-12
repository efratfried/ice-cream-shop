import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  cartItems: any[] = [];
  orderNum: number;
  totalAmount: number;
  constructor(
    private route: ActivatedRoute,
    private service: ApiService,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.orderNum = parseInt(
      this.route.snapshot.paramMap.get('orderNum') ?? '0',
      10
    );
  }

  private stripePromise = loadStripe(
    'pk_test_51NKE7rCXPRE8Z5toQqAYW3jVeF3vlKmutZZ8ct7sfsatOWvo9YBZirAaOHwRWROA0Wn6gfQRVxJCapK1p2BeFGpw00IbHTJJii'
  );

  ngOnInit(): void {
    this.service.getOrder(this.orderNum).subscribe((order) => {
      this.cartItems = order.items;
    });
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.amount * item.price,
      0
    );
  }

  updateAmount(flavor: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newValue = parseInt(inputElement.value, 10);

    this.cartItems = this.cartItems.map((item) =>
      item.flavor === flavor ? { ...item, amount: newValue } : item
    );

    this.service
      .updateFlavorInOrder(this.orderNum, this.cartItems)
      .subscribe((res) => {
        // Assuming `res` returns the updated item
        this.cartItems = this.cartItems.map((item) =>
          item.flavor === res.flavor ? res : item
        );
        this.getTotal();
      });
  }

  deleteFlavor(flavor: string): void {
    const itemToDelete = this.cartItems.find((item) => item.flavor === flavor);

    if (itemToDelete) {
      this.service
        .deleteFlavorInOrder(this.orderNum, itemToDelete.id)
        .subscribe(() => {
          this.cartItems = this.cartItems.filter(
            (item) => item.flavor !== flavor
          );
        });
    }
  }

  goBackToStore(): void {
    this.router.navigate(['/menu']);
  }

  async payNow(): Promise<void> {
    const stripe = await this.stripePromise;

    if (!stripe) {
      console.error('Stripe.js has not loaded yet.');
      return;
    }

    this.paymentService.createCheckoutSession(this.getTotal()*100).subscribe(
      async (session) => {
        const { id } = session;

        const { error } = await stripe.redirectToCheckout({
          sessionId: id,
        });

        if (error) {
          console.error('Error:', error);
        }
      },
      (error) => {
        console.error('Error creating checkout session:', error);
      }
    );
  }
}
