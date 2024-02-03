import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { param } from 'jquery';
import { ProductService } from 'src/app/_services/product.service';
import { Brand } from 'src/app/_model-dto/brand/brand';
import { BrandResponse } from 'src/app/_model-dto/brand/brandResponse';
import { Category } from 'src/app/_model-dto/category/category';
import { CategoryResponse } from 'src/app/_model-dto/category/categoryResponse';
import { CategoryHierarchy } from 'src/app/_model-dto/category/categoryHierarchy';
import { FileHandle } from 'src/app/_model-dto/file-handle.model';
import { Product } from 'src/app/_model-dto/product/product';
import { ProductDTO } from 'src/app/_model-dto/product/productDTO';
import { CategorylistService } from 'src/app/_services/categorylist.service';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductDetails } from 'src/app/_model-dto/product/productDetails';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AdminsService } from 'src/app/_services/admins.service';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit, AfterViewInit{

  productId: number;
  productDto : ProductDTO<any,any>;

  product: Product = new Product();
  brand: Brand = new Brand();
  category: Category = new Category();
  mainImageFile: FileHandle | undefined;
  subImagesFiles: FileHandle[] = [] ;

  public brandsList: BrandResponse[] | undefined;
  public categoriesListHierarchy : CategoryHierarchy<CategoryResponse>[] | undefined;

  @ViewChild("specContainer")specContainer: ElementRef;
  
  constructor(private productService: ProductService,
    private adminService: AdminsService,
    private activatedRoute: ActivatedRoute,
    private categorylistService: CategorylistService,
    private sanitizer: DomSanitizer,
    private router: Router){}


    ngOnInit(){
    this.productDto = this.activatedRoute.snapshot.data['productDto'];

    this.product.id = this.productDto.productResponse!.productId;
    this.product.name = this.productDto.productResponse!.productName;
    this.product.price = this.productDto.productResponse!.productPrice;
    this.product.quantity = this.productDto.productResponse!.productQuantity;
    this.product.discount = this.productDto.productResponse!.productDiscount;
    this.product.color = this.productDto.productResponse!.productColor;
    this.product.description = this.productDto.productResponse!.productDescription;
    this.product.specs = this.productDto.productResponse!.productSpecs;
    this.product.added_at = this.productDto.productResponse!.added_at;

    this.brand.id = this.productDto.productResponse!.brandId;
    this.brand.name = this.productDto.productResponse!.brandName;

    this.category.id = this.productDto.productResponse!.categoryId;
    this.category.name = this.productDto.productResponse!.categoryName;

    this.product.brand = this.brand;
    this.product.category = this.category;
    
    this.mainImageFile = this.productDto.productResponse!.mainImage;
    this.subImagesFiles = this.productDto.productResponse!.subImages;

    this.getAllCategoriesListWithHierarchy();
    this.getAllBrands();
  }
  
  
  ngAfterViewInit(): void {
    this.specificationsArraySet();
  }

  
  public getAllCategoriesListWithHierarchy(): void{
    this.productService.getAllCategoriesWithOutImgs()
    .subscribe({
      next: (next : CategoryResponse[]) =>{
        this.categoriesListHierarchy = this.categorylistService.createCategoryListHierarchy(next);  
        // console.log(this.categoriesListHierarchy)
      },
      error : (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public getAllBrands(): void{
    this.productService.getAllBrandsWithOutImgs()
    .subscribe({
      next: (next : BrandResponse[]) =>{
        // console.log(next)
        this.brandsList = next;
      },
      error : (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public updateProduct(productForm: NgForm, productId: number){
    this.product.specs = this.specificationsArray();

    const formData =  this.prepareFormData(this.product);

    this.adminService.updateProductById(formData, productId).subscribe({
      next: (next : ProductDetails) => {
        this.clearForm(productForm);
        this.router.navigate(['/products']);
      },
      error : (error: HttpErrorResponse) =>{
        console.log(error)
      }
    });
  }

  
  clearForm(productForm: NgForm){
    productForm.reset();
    this.subImagesFiles = [];
    this.mainImageFile = undefined;

    this.specContainer.nativeElement.innerHTML = '';
    this.addListItemBtnAction(null);
  }

  prepareFormData(product: Product): FormData{
    const formData = new FormData();

    formData.append(
      'product', 
      new Blob([JSON.stringify(product)], {
        type: 'application/json'
      })
    );

    formData.append(
      'file', 
      this.mainImageFile!.file,
      this.mainImageFile!.file.name,
    );

    for(var i=0; i<this.subImagesFiles.length; i++){
      formData.append(
        'files', 
        this.subImagesFiles[i].file,
        this.subImagesFiles[i].file.name,
      );
    }

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

      this.mainImageFile = fileHandle;
    }
  }

  onMultipleFilesSelected(event: any){
    if(event.target.files){
      const file = event.target.files[0];

      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
          )
      }

      this.subImagesFiles.push(fileHandle);
    }
  }

  removeImages(i: number){
    this.subImagesFiles.splice(i, 1);
  }

  fileDropped(fileHandle: FileHandle){
    this.mainImageFile = fileHandle;
  }

  specificationsArraySet(){
    const li_row = document.querySelector('#prodspecs_container .prodspec_row');
    let spec_row = this.removeListItemBtnAction(li_row);
    for(let i=0;i<this.product.specs.length;i++){
      if(i!=0) spec_row =  this.addListItemBtnAction(spec_row);
      const spec_key = (<HTMLInputElement>spec_row!.querySelector('#spec_key'));
      const spec_value = (<HTMLInputElement>spec_row!.querySelector('#spec_value'));
      spec_key.value = this.product.specs[i].specs_key;
      spec_value.value = this.product.specs[i].specs;
    }
  }

  specificationsArray(): any{
    const specsList: any = {};
    const spec_keys = document.querySelectorAll('#spec_key');
    const spec_values = document.querySelectorAll('#spec_value');
    for(let i=0; i< spec_keys.length ; i++){
      var key = (<HTMLInputElement>spec_keys[i]).value;
      var val = (<HTMLInputElement>spec_values[i]).value;
      if(key.trim()!='' && val.trim()!=''){
        specsList[key] = val;
      }
    }
    return specsList;
  }

  addListItemBtnAction(listElem: any): any{
    if (this.specContainer.nativeElement.childElementCount == 10) {
      return;
    }
    const prodspecDiv = document.createElement('div');
    prodspecDiv.classList.add('row','prodspec_row');

    const keyDiv = document.createElement('div');
    keyDiv.classList.add('col-md-4');
    keyDiv.innerHTML = `
    <div class="form-floating">
      <input type="text" class="form-control" id="spec_key" placeholder="value">
      <label for="spec_key">key</label>
    </div>
  `;

    const valueDiv = document.createElement('div');
    valueDiv.classList.add('col-md-4');
    valueDiv.innerHTML = `
    <div class="form-floating">
      <input type="text" class="form-control" id="spec_value" placeholder="value">
      <label for="spec_value">value</label>
    </div>
  `;
    
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('col-md-4');

    const buttonWrapDiv = document.createElement('div');
    buttonWrapDiv.classList.add('mt-2');

    const addSpecBtn = document.createElement('button');
    addSpecBtn.type = 'button';
    addSpecBtn.classList.add('btn','shadow','text-success','btnP');

    const addSpecIcon = document.createElement('i');
    addSpecIcon.classList.add('bi','bi-plus');
    addSpecBtn.appendChild(addSpecIcon);
    addSpecBtn.addEventListener('click', (e) => this.addListItemBtnAction(prodspecDiv));
    
    const removeSpecBtn = document.createElement('button');
    removeSpecBtn.type = 'button';
    removeSpecBtn.classList.add('btn','shadow','text-danger','btnM');

    const removeSpecIcon = document.createElement('i');
    removeSpecIcon.classList.add('bi','bi-dash');
    removeSpecBtn.appendChild(removeSpecIcon);
    removeSpecBtn.addEventListener('click', (e) => this.removeListItemBtnAction(prodspecDiv));

    buttonWrapDiv.appendChild(addSpecBtn);
    buttonWrapDiv.appendChild(removeSpecBtn);

    buttonDiv.appendChild(buttonWrapDiv);

    prodspecDiv.appendChild(keyDiv);
    prodspecDiv.appendChild(valueDiv);
    prodspecDiv.appendChild(buttonDiv);

    if (listElem == null) {
      this.specContainer.nativeElement.appendChild(prodspecDiv);
    } else {
      listElem.after(prodspecDiv);
    }
    return prodspecDiv;
  }

  removeListItemBtnAction(li: any){
    li.remove();
    if(this.specContainer.nativeElement.childElementCount == 0){
      return this.addListItemBtnAction(null);
    }
    return li;
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
  // event.blob can be used to upload the cropped image
  }
  imageLoaded() {
    // show cropper
  }
  // imageLoaded(image: LoadedImage) {
  //   // show cropper
  // }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }


}


/*
  ngOnInit(){
    this.route.params.subscribe(params => {
      // this.productId = params['id'];
       this.productId =  Number(params['id']);
    })

    this.productDto = this.getProductDetailById();
  }

public getProductDetailById(): any{
    this.productService.getProductByIdWithImages(this.productId)
    .subscribe({
      next: (next : ProductDTO<any,any>) =>{
        console.log(next)
        return next;
      },
      error : (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }
*/