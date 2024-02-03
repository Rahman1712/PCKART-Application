import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Brand } from 'src/app/_model-dto/brand/brand';

@Component({
  selector: 'app-brand-view',
  templateUrl: './brand-view.component.html',
  styleUrls: ['./brand-view.component.css']
})
export class BrandViewComponent {
  constructor(public dialogRef: MatDialogRef<BrandViewComponent>){}
  
  public brand: Brand ;
}
