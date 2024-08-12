import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private flavorsApiUrl = 'http://localhost:3000/api/flavors';
  private ordersApiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  getFlavors(): Observable<any> {
    return this.http.get<any>(this.flavorsApiUrl);
  }

  getOrder(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.ordersApiUrl}/${orderId}`);
  }

  addFlavor(orderId, flavor): Observable<any> {
    return this.http.post<any>(`${this.ordersApiUrl}/${orderId}`, flavor);
  }
  addOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.ordersApiUrl, orderData); // Create a new order without providing an ID
  }
  addFlavorToOrder(orderId: number, flavorData: any): Observable<any> {
    return this.http.post<any>(
      `${this.ordersApiUrl}/${orderId}/items`,
      flavorData
    );
  }

  checkIfFlavorExists(orderId: number, flavor: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.ordersApiUrl}/${orderId}/items/check?flavor=${flavor}`
    );
  }
  updateFlavorInOrder(orderId: number, cart: any): Observable<any> {
    return this.http.put<any>(`${this.ordersApiUrl}/${orderId}/items`, cart);
  }
  deleteFlavorInOrder(orderId: number, itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.ordersApiUrl}/${orderId}/items/${itemId}`);
  }

}
