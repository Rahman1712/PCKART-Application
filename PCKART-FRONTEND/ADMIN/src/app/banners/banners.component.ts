import { Component, OnInit } from '@angular/core';
import { Banner } from '../_model-dto/banner/banner';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../_services/image-processing-service.service';
import { BannerService } from '../_services/banner.service';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit{

  constructor(
    private imageProcessingService: ImageProcessingService,
    private bannerService: BannerService,
    private router: Router,
  ){
  }

  bannerItems: Banner[];

  ngOnInit(): void {
    this.getBanners();
}

  public getBanners(): void{
    this.bannerService.getAllBanners()
    .pipe(
      map((banners: Banner[] , i) => 
        banners.map((banner: Banner) => 
          this.imageProcessingService.createBannerImage(banner)
        )
      )
    )
    .subscribe({
      next: (bannersList: Banner[]) =>{
        console.log(bannersList)
        this.bannerItems = bannersList;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
        console.log(error)
      }
    });
  }

  updateById(bannerId: string){
    // this.router.navigate(['/banner-add-edit', {bannerId: bannerId}]);
    this.router.navigate(['/banner-add-edit'], { queryParams: { bannerId: bannerId}});
  }

  updateEnabled(bannerId: string, enabled: boolean){
    this.bannerService.updateBannerEnabledById(bannerId,enabled)
    .subscribe({
      next: (next: any) =>{
        console.log(next)
        this.ngOnInit();
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }

  removeBanner(bannerId: string, index: number){
    this.bannerService.deleteBannerById(bannerId)
    .subscribe({
      next: (next: any) =>{
        console.log(next);
        // this.bannerItems?.splice(index, 1);
        this.ngOnInit();
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }


}
