import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ProductDTO } from '../_model-dto/product/productDTO';
import { Observable, map, of } from 'rxjs';
import { ProductService } from './product.service';
import { ImageProcessingService } from './image-processing-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolverService implements Resolve<ProductDTO<any,any>>{

  constructor(private productService:ProductService, private imageProcessingServie:ImageProcessingService) { }

  resolve(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): 
    Observable<ProductDTO<any, any>> 
    {
    
      const productId = Number(route.paramMap.get("productId"));
      if(productId){
        return this.productService.getProductByIdWithImages(productId)
          .pipe(
            map(p => this.imageProcessingServie.createAllImagesToProdDto(p))
          )
      }else{
        return of(this.getProductDetails());
      }
  }

  getProductDetails(){
    return {
      productResponse: undefined,
      imgdata: undefined,
      imgModel: undefined
    };
  }
}
