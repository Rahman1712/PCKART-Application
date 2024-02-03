import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '../_services/user.service';
import { ImageProcessingService } from '../_services/image-processing-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Coupon } from '../_model-dto/coupon/coupon';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { CouponAddEditComponent } from './coupon-add-edit/coupon-add-edit.component';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {

  @ViewChild(MatPaginator) static paginatorValue: MatPaginator;

  dialogRef: MatDialogRef<CouponAddEditComponent> | null;

  constructor(private userService: UserService,
    public dialog: MatDialog,
  ){}

  couponsList: Coupon[];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'code', 'discount', 'validupto', 'enabled', 'actions' ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchText: string;
  currentPage = 5;
  pageItemNum = 5;

  ngOnInit(): void {
    this.getCoupons();
  }

  public getCoupons(): void{
    this.userService.getAllCoupons()
    .subscribe({
      next: (next: Coupon[]) =>{
        console.log(next)
        this.couponsList = next;
        this.dataSource = new MatTableDataSource<Coupon>(this.couponsList);
        this.dataSource.paginator = this.paginator;
        CouponsComponent.paginatorValue = this.paginator;
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }

  updateEnabled(couponId: number,enabled: boolean){
    this.userService.updateCouponEnabled(couponId,enabled)
    .subscribe({
      next: (next: string) =>{
        console.log(next)
        // this.ngOnInit();
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }

  updateCoupon(coupon: Coupon){
    this.dialogRef = this.dialog.open(CouponAddEditComponent, {
      disableClose: true,
      // width: "60%",
      // height: '400px',
    });  
    this.dialogRef.componentInstance.coupon = coupon;
    this.dialogRef.componentInstance.isNew = false;
    this.dialogRef.afterClosed().subscribe((result: Coupon | any)=> {
      if(result != 'close'){
        console.log(result)
        this.userService.updateCouponDataByCouponId(result.id, result.code, result.discount, result.validupto)
        .subscribe({
          next: (res: string) =>{
            console.log(res);
            this.getCoupons();
          },
          error: (error: HttpErrorResponse) =>{
            alert(error.message)
            console.log(error);
          }
        });
      }else{
        console.log('dialog closed : back')
      }
      this.dialogRef = null;
    });
  }

  addCoupon(){
    let newCoupon: Coupon = new Coupon();
    this.dialogRef = this.dialog.open(CouponAddEditComponent, {
      disableClose: true,
      // width: "60%",
      // height: '400px',
    });
    this.dialogRef.componentInstance.isNew = true;
    this.dialogRef.componentInstance.coupon = newCoupon;
    this.dialogRef.afterClosed().subscribe(result => {
      if(result != 'close'){
        this.userService.addCoupon(result)
        .subscribe({
          next: (coupon: Coupon) =>{
            console.log(coupon);
            this.getCoupons();
          },
          error: (error: HttpErrorResponse) =>{
            alert(error.message)
            console.log(error);
          }
        });
      }else{
        console.log('dialog closed : back')
      }
      this.dialogRef = null;
    });
  }

  
}
