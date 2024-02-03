import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Banner } from '../_model-dto/banner/banner';
import { Observable, map, of } from 'rxjs';
import { BannerService } from './banner.service';
import { ImageProcessingService } from './image-processing-service.service';

@Injectable({
  providedIn: 'root'
})
export class BannerResolverService implements Resolve<Banner>{

  constructor(private bannerService:BannerService, private imageProcessingServie:ImageProcessingService) { }

  resolve(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): 
    Observable<Banner> 
    {
    
      const bannerId = String(route.paramMap.get("bannerId"));
      if(bannerId){
        return this.bannerService.getBannerById(bannerId)
          .pipe(
            map(banner => this.imageProcessingServie.createBannerImage(banner))
          )
      }else{
        return of(this.getBannerDetails());
      }
  }

  getBannerDetails(){
    return new Banner();
  }
}
