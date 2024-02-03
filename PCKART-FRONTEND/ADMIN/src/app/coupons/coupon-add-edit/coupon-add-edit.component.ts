import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Coupon } from 'src/app/_model-dto/coupon/coupon';

@Component({
  selector: 'app-coupon-add-edit',
  templateUrl: './coupon-add-edit.component.html',
  styleUrls: ['./coupon-add-edit.component.css']
})
export class CouponAddEditComponent {

  constructor(
    public dialogRef: MatDialogRef<CouponAddEditComponent>,
  ){}

  public coupon: Coupon = new Coupon();
  isNew = false;
  formError: boolean = false;
  errorMsg: string = '';

  save(){
    if(!this.checkValidation()) return;
    this.dialogRef.close(this.coupon);
  }

  update(){
    if(!this.checkValidation()) return;
    this.dialogRef.close(this.coupon);
  }

  closePopup(){
    this.dialogRef.close('close');
  }


  checkValidation(){
    if(
      this.coupon.name != undefined && this.coupon.name.trim() != '' &&
      this.coupon.code != undefined && this.coupon.code.trim() != '' &&
      this.coupon.discount != undefined &&
      this.coupon.validupto != undefined  
    ){
      return true;
    }else{
      this.formError = true;
      this.errorMsg = 'please fill all fields';
      return false;
    }
  }
  isErrorOnForm(){
    return this.formError;
  }
  onKeyUp(){
    this.formError = false;
    this.errorMsg = 'error';
  }
}
