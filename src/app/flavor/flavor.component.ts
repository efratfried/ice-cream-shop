import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-flavor',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule],
  templateUrl: './flavor.component.html',
  styleUrl: './flavor.component.css',
})
export class FlavorComponent implements OnInit {
  quantity: number = 1;
  chosenFlavor: any;
  orderId: any;
  constructor(
    private service: ApiService,
    public dialogRef: MatDialogRef<FlavorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { flavor: any }
  ) {
    this.orderId = Number(localStorage.getItem('orderId'));
    this.chosenFlavor = data.flavor;
  }
  ngOnInit(): void {}

  addToCart() {
    let itemData = {
      flavor: this.chosenFlavor.flavor,
      amount: this.quantity,
      price: this.chosenFlavor.price,
    };

    this.service
      .checkIfFlavorExists(this.orderId, this.chosenFlavor.flavor)
      .subscribe(
        (exists) => {
          if (exists) {
            itemData.amount += 1;

            this.service.updateFlavorInOrder(this.orderId, itemData).subscribe(
              (res) => {
                console.log('Item updated in order:', res);
              },
              (error) => {
                console.error('Error updating item in order:', error);
              }
            );
          } else {
            this.service.addFlavorToOrder(this.orderId, itemData).subscribe(
              (res) => {
                this.quantity=res.amount
                console.log('Item added to order:', res);
              },
              (error) => {
                console.error('Error adding item to order:', error);
              }
            );
          }

          this.dialogRef.close();
        },
        (error) => {
          console.error('Error checking flavor existence:', error);
        }
      );
  }
}
