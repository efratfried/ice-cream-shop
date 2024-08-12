import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar'; // or any other notification service you use

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';

        if (error.status === 404) {
          if (error.error=='Order not found') {
            errorMessage = "מס' הזמנה לא קיים";
          } 
          else if(error.error=='cart is empty'){
            errorMessage="העגלה ריקה"
          }
          else {
            errorMessage = 'The requested resource was not found.';
          }
        } else if (error.status === 500) {
          errorMessage = 'A server error occurred.';
        } else if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        // Optionally, use a notification service to show the error message
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
        });

        return throwError(errorMessage);
      })
    );
  }
}
