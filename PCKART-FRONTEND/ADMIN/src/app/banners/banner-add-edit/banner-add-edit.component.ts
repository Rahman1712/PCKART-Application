import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { BannerService } from 'src/app/_services/banner.service';
import { ImageProcessingService } from 'src/app/_services/image-processing-service.service';
import { ProductService } from 'src/app/_services/product.service';
import { Banner } from 'src/app/_model-dto/banner/banner';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { FileHandle } from 'src/app/_model-dto/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { ProductResponse } from 'src/app/_model-dto/product/productResponse';

@Component({
  selector: 'app-banner-add-edit',
  templateUrl: './banner-add-edit.component.html',
  styleUrls: ['./banner-add-edit.component.css']
})
export class BannerAddEditComponent implements OnInit{

  public isUpdate: boolean = false ;
  public bannerId: string = '' ;
  public banner: Banner = new Banner();
  public product: any = {
    id : 0,
    name : '',
  };
  bannerImageFile: FileHandle | undefined;

  searchKeyword:string = '';
  limit:number =  5;
  public productsSearchList: ProductResponse[] = [];

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private route: ActivatedRoute,
    private bannerService: BannerService,
    private sanitizer: DomSanitizer,
    private router: Router
  ){}

  
  ngOnInit(): void {
    // this.banner = this.route.snapshot.data['banner'];

    this.route.queryParams.subscribe(params => {
      this.bannerId = params['bannerId'];
      if(this.bannerId != undefined){
        this.getBannerById(this.bannerId);
      }
    });
    
  }

  getBannerById(bannerId: string){
    this.bannerService.getBannerById(bannerId)
    .pipe(
      map((banner: Banner) => 
        this.imageProcessingService.createBannerImage(banner)
      )
    )
    .subscribe({
      next: (banner: Banner) => {
        this.banner = banner;
        this.isUpdate = true;
        this.bannerImageFile = banner.bannerImageFile;
        this.product =  this.banner.product;
        console.log(this.bannerImageFile)
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    });
  }

  saveBanner(bannerForm: NgForm){
    this.banner.product = this.product;
    // console.log("save")
    // console.log(this.banner)
    const formData =  this.prepareFormData(this.banner);
    
    this.bannerService.addBanner(formData).subscribe({
      next: (next : string) => {
        console.log(next);
        bannerForm.reset();
        this.bannerImageFile = undefined;
        this.router.navigate(['/banners']);
      },
      error : (error: HttpErrorResponse) =>{
        console.log(error)
      }
    });
  }
  
  updateBanner(){
    this.banner.product = this.product;
    // console.log("update")
    // console.log(this.banner)
    const formData =  this.prepareFormData(this.banner);

    this.bannerService.updateBannerById(formData, this.bannerId).subscribe({
      next: (next : string) => {
        console.log(next);
        this.router.navigate(['/banners']);
      },
      error : (error: HttpErrorResponse) =>{
        console.log(error)
      }
    });
  }

  onFileSelected(event: any){
    if(event.target.files){
      const file = event.target.files[0];

      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
          )
      }

      this.bannerImageFile = fileHandle;
    }
  }

  prepareFormData(banner: Banner): FormData{
    const formData = new FormData();

    formData.append(
      'banner', 
      new Blob([JSON.stringify(banner)], {
        type: 'application/json'
      })
    );

    formData.append(
      'file', 
      this.bannerImageFile!.file,
      this.bannerImageFile!.file.name,
    );
    
    return formData;
  }

/* ===========================GET SEARCH PRODUCTS===============================*/
  searchOperation(){
    if(this.searchKeyword.trim() != ''){
      this.getAllProductsBySearchKeywordAndLimit();
    }else{
      this.productsSearchList = [];
    }
  }

  public getAllProductsBySearchKeywordAndLimit(): void {
    this.productService.getAllProductsByKeywordAndLimit(this.searchKeyword, this.limit)
    .subscribe({
      next: (searchList: ProductResponse[]) =>{
        console.log(searchList)
        this.productsSearchList = searchList;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message)
      }
    });
  }

  clearForm(bannerForm: NgForm){
    bannerForm.reset();
    this.bannerImageFile = undefined;
  }

}
