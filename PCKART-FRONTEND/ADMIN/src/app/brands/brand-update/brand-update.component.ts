import { HttpErrorResponse } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageProcessingService } from 'src/app/_services/image-processing-service.service';
import { ProductService } from 'src/app/_services/product.service';
import { Brand } from 'src/app/_model-dto/brand/brand';
import { FileHandle } from 'src/app/_model-dto/file-handle.model';
import { map } from 'rxjs';
import { AdminsService } from 'src/app/_services/admins.service';

@Component({
  selector: 'app-brand-update',
  templateUrl: './brand-update.component.html',
  styleUrls: ['./brand-update.component.css']
})
export class BrandUpdateComponent implements OnInit{

  constructor(private productService: ProductService,
    private adminService: AdminsService,
    private sanitizer: DomSanitizer,
    private imageProcessingService: ImageProcessingService,
    private route: ActivatedRoute,
    private router: Router)
  {}

  brandId: number;
  brand: Brand = new Brand();
  brandImageFile: FileHandle | undefined;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.brandId =  Number(params['id']);
       this.getBrandById(this.brandId);
    })
  }

  getBrandById(brandId: number){
    this.productService.getBrandById(brandId)
    .pipe(
      map((brand: Brand) => 
        this.imageProcessingService.createBrandImage(brand)
      )
    )
    .subscribe({
      next: (next: Brand) =>{
        this.brand = next;
        this.brandImageFile = this.brand.brandImage;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    });
  }

  updateBrand(brandForm: NgForm, brandId: number){   
    const formData =  this.prepareFormData(this.brand.name);

    this.adminService.updateBrandById(formData, brandId).subscribe({
      next: (next : string) => {
        brandForm.reset();
        this.brandImageFile = undefined;
        this.router.navigate(['/brands']);
      },
      error : (error: HttpErrorResponse) =>{
        console.log(error)
      }
    });
  }

  prepareFormData(brandName: string) : FormData{
    const formData = new FormData();
  
      formData.append(
        'file', 
        this.brandImageFile!.file,
        this.brandImageFile!.file.name,
      );
      formData.append('name', brandName);
  
      return formData;
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

      this.brandImageFile = fileHandle;
    }
  }

  clearForm(brandForm: NgForm){
    brandForm.reset();
    this.brandImageFile = undefined;
  }

  fileDropped(fileHandle: FileHandle){
    this.brandImageFile = fileHandle;
  }

}
