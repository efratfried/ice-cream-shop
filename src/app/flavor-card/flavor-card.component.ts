import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlavorComponent } from '../flavor/flavor.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-flavor-card',
  standalone: true,
  imports: [],
  templateUrl: './flavor-card.component.html',
  styleUrl: './flavor-card.component.css',
})
export class FlavorCardComponent implements OnInit {
  @Input() flavor:any;
  constructor(private router: Router,public dialog: MatDialog){}
  ngOnInit(): void {  }
  onClick()
  {
    this.router.navigate(['/flavor']);

  }
  openDialog(flavor: any): void {
    const dialogRef = this.dialog.open(FlavorComponent, {
      data: { flavor: flavor },
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
