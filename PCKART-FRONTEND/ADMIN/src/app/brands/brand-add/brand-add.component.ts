import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminsService } from 'src/app/_services/admins.service';
import { ProductService } from 'src/app/_services/product.service';
import { Brand } from 'src/app/_model-dto/brand/brand';
import { FileHandle } from 'src/app/_model-dto/file-handle.model';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.css']
})
export class BrandAddComponent {

  constructor(private productService: ProductService,
    private adminService: AdminsService,
    private sanitizer: DomSanitizer){}

  brand: Brand = new Brand();
  brandImageFile: FileHandle | undefined;

  addBrand(brandForm: NgForm){   
    const formData =  this.prepareFormData(this.brand.name);

    this.adminService.addBrand(formData).subscribe({
      next: (next : Brand) => {
        brandForm.reset();
        this.brandImageFile = undefined;
      },
      error : (error: HttpErrorResponse) =>{
        console.log(error)
      }
    });
  }


  prepareFormData(brandName: string): FormData{
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
