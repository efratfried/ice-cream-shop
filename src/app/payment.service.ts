import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';

export interface PaymentIntentResponse {
  client_secret: string; // or id, depending on the response from your server
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentApiUrl = 'http://localhost:3000/create-payment-intent';

  constructor(private http: HttpClient) { }

  createPaymentIntent(amount: number): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(this.paymentApiUrl, { amount })
      .pipe(
        catchError(this.handleError) // Handle errors
      );
  }

  createCheckoutSession(amount: number): Observable<any> {
    return this.http.post<any>('http://localhost:3000/create-checkout-session', { amount });
  }

  private handleError(error: any): Observable<never> {
    // Customize error handling as needed
    console.error('PaymentService error:', error);
    return throwError(() => new Error('PaymentService error: ' + error.message));
  }
}
