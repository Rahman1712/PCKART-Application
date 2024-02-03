import { Injectable } from '@angular/core';
import { ProductDTO } from '../_model-dto/product/productDTO';
import { FileHandle } from '../_model-dto/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Brand } from '../_model-dto/brand/brand';
import { Category } from '../_model-dto/category/category';
import { ProductPagination } from '../_model-dto/product/productPagination';
import { map } from 'rxjs';
import { Admin } from '../_model-dto/admin/admin';
import { UserDTO } from '../_model-dto/user/user-dto';
import { Banner } from '../_model-dto/banner/banner';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {
  [x: string]: any;

  constructor(private sanitizer: DomSanitizer) { }

  public createImagesToPagination(prodPage: ProductPagination<ProductDTO<any,any>>){
    prodPage.listProducts.forEach(product => 
        this.createMainImageToProdDto(product)
    )
    return prodPage;
  }

  public createMainImageToProdDto(productDto: ProductDTO<any,any>){
    const imageByte: any = productDto.imgdata;
    const imageModel: any = productDto.imgModel;

    const imageBlob = this.dataURItoBlob(imageByte, imageModel.imgType);

    const imageFile = new File([imageBlob], imageModel.imgName, { type: imageModel.imgType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    productDto.productResponse!.mainImage = finalFileHandle

    return productDto;
  }

  public createMainAndSubImagesToProdDto(productDto: ProductDTO<any,any>){
    const productImagesBytes: any[] = productDto.imgdata;
    const productImagesModel: any[] = productDto.imgModel;

    const productSubImagesToFileHandle: FileHandle[] = [];

    for(let i=0; i<productImagesBytes.length; i++){
      const imageByte = productImagesBytes[i];
      const imageModel = productImagesModel[i];

      const imageBlob = this.dataURItoBlob(imageByte, imageModel.imgType);

      const imageFile = new File([imageBlob], imageModel.imgName, { type: imageModel.imgType })

      const finalFileHandle : FileHandle = {
        file: imageFile,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      };

      if(i==0) productDto.productResponse!.mainImage = finalFileHandle;
      else productSubImagesToFileHandle.push(finalFileHandle);
    }
    productDto.productResponse!.subImages = productSubImagesToFileHandle;

    return productDto;   
  }

  public createAllImagesToProdDto(productDto: ProductDTO<any,any>){
    const productImagesBytes: any[] = productDto.imgdata;
    const productImagesModel: any[] = productDto.imgModel;

    const productSubImagesToFileHandle: FileHandle[] = [];
    const productAllImagesToFileHandle: FileHandle[] = [];

    for(let i=0; i<productImagesBytes.length; i++){
      const imageByte = productImagesBytes[i];
      const imageModel = productImagesModel[i];

      const imageBlob = this.dataURItoBlob(imageByte, imageModel.imgType);

      const imageFile = new File([imageBlob], imageModel.imgName, { type: imageModel.imgType })

      const finalFileHandle : FileHandle = {
        file: imageFile,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      };

      if(i==0) productDto.productResponse!.mainImage = finalFileHandle;
      else productSubImagesToFileHandle.push(finalFileHandle);

      productAllImagesToFileHandle.push(finalFileHandle);
    }
    productDto.productResponse!.subImages = productSubImagesToFileHandle;
    productDto.productResponse!.allImages = productAllImagesToFileHandle;

    return productDto;   
  }

  public createBrandImage(brand: Brand){
    const imageByte: any = brand.image;

    const imageBlob = this.dataURItoBlob(imageByte, brand.imageType);

    const imageFile = new File([imageBlob], brand.imageName, { type: brand.imageType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    brand.brandImage = finalFileHandle

    return brand;
  }

  public createCategoryImage(category: Category){
    const imageByte: any = category.image;

    const imageBlob = this.dataURItoBlob(imageByte, category.imageType);

    const imageFile = new File([imageBlob], category.imageName, { type: category.imageType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    category.categoryImage = finalFileHandle

    return category;
  }

  public createBannerImage(banner: Banner){
    const imageByte: any = banner.bannerImage;

    const imageBlob = this.dataURItoBlob(imageByte, banner.imageType);

    const imageFile = new File([imageBlob], banner.imageName, { type: banner.imageType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    banner.bannerImageFile = finalFileHandle

    return banner;
  }

  public createAdminImage(admin: Admin){
    const imageByte: any = admin.image;

    const imageBlob = this.dataURItoBlob(imageByte, admin.imageType);

    const imageFile = new File([imageBlob], admin.imageName, { type: admin.imageType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    admin.adminImage = finalFileHandle

    return admin;
  }

  public createUserDtoImage(userDto: UserDTO){
    const imageByte: any = userDto.image;

    const imageBlob = this.dataURItoBlob(imageByte, userDto.imageType);

    const imageFile = new File([imageBlob], userDto.imageName, { type: userDto.imageType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    userDto.userImage = finalFileHandle

    return userDto;
  }

  public dataURItoBlob(picBytes: string, imageType: string){
    const byteString = window.atob(picBytes);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for(let i=0; i<byteString.length; i++){
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], { type: imageType });
    return blob;
  }

}


/*
 public createMainImage(productDto: ProductDTO<any,any>){
    const imageByte: any = productDto.imgdata;
    const imageModel: any = productDto.imgModel;

    let productMainImageToFileHandle: FileHandle ;

    const imageBlob = this.dataURItoBlob(imageByte, imageModel.imgType);

    const imageFile = new File([imageBlob], imageModel.imgName, { type: imageModel.imgType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    productMainImageToFileHandle = finalFileHandle;

    return productMainImageToFileHandle;
  }

  public createMainAndSubImages(productDto: ProductDTO<any,any>){
    const productImagesBytes: any[] = productDto.imgdata;
    const productImagesModel: any[] = productDto.imgModel;

    let productMainImageToFileHandle: FileHandle | undefined = undefined;
    const productSubImagesToFileHandle: FileHandle[] = [];

    for(let i=0; i<productImagesBytes.length; i++){
      const imageByte = productImagesBytes[i];
      const imageModel = productImagesModel[i];

      const imageBlob = this.dataURItoBlob(imageByte, imageModel.imgType);

      const imageFile = new File([imageBlob], imageModel.imgName, { type: imageModel.imgType })

      const finalFileHandle : FileHandle = {
        file: imageFile,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      };

      if(i==0) productMainImageToFileHandle = finalFileHandle;
      else productSubImagesToFileHandle.push(finalFileHandle);
    }

    return { mainImage: productMainImageToFileHandle , subImages: productSubImagesToFileHandle};   
  }
*/