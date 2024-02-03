import { Component, OnInit,ViewChild } from '@angular/core';
import { Brand } from '../_model-dto/brand/brand';
import { ProductService } from '../_services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { ImageProcessingService } from '../_services/image-processing-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AdminsService } from '../_services/admins.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrandViewComponent } from './brand-view/brand-view.component';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit{
  @ViewChild(MatPaginator) static paginatorValue: MatPaginator;

  constructor(private productService: ProductService,
    private adminService: AdminsService,
    private imageProcessingService: ImageProcessingService,
    public dialog: MatDialog,
    ){}

  brandsList: Brand[];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','name','preview', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchText: string;
  currentPage = 5;
  pageItemNum = 5;

  dialogRef: MatDialogRef<BrandViewComponent> | null;

  ngOnInit(): void {
    this.getBrands();
  }

  public popoverTitle: string = 'Delete Brand';
  public popoverMessage: string = 'Would you like to delete brand?'
  public cancelClicked: boolean = false;
  public confirmClicked: boolean = false;

  public getBrands(): void{
    this.productService.getAllBrandsWithImgs()
    .pipe(
      map((brands: Brand[] , i) => 
        brands.map((brand: Brand) => 
          this.imageProcessingService.createBrandImage(brand)
          )
        )
    )
    .subscribe({
      next: (next: Brand[]) =>{
        console.log(next)
        this.brandsList = next;
        this.dataSource = new MatTableDataSource<Brand>(this.brandsList);
        this.dataSource.paginator = this.paginator;
        BrandsComponent.paginatorValue = this.paginator;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message)
      }
    });
  }

  applyFilter(){
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }
  

  showBrandDetails(brand: Brand){
    this.dialogRef = this.dialog.open(BrandViewComponent, {
      disableClose: false,
      width: "60%",
      height: '400px',
    });
    this.dialogRef.componentInstance.brand = brand;
    this.dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('dialog closed')
      }
      this.dialogRef = null;
    });
  }

  removeBrandItem(brandId: number,index: number){
    this.adminService.deleteBrandById(brandId)
    .subscribe({
      next: (next: any) =>{
        this.brandsList?.splice(index, 1);
        this.ngOnInit();
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }
}
