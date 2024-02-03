import { Component, OnInit  } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { BrandResponse } from '../../_model-dto/brand/brandResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from 'src/app/_model-dto/product/product';
import { CategoryResponse } from 'src/app/_model-dto/category/categoryResponse';
import { FileHandle } from 'src/app/_model-dto/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductDetails } from 'src/app/_model-dto/product/productDetails';
import { NgForm } from '@angular/forms';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { CategoryHierarchy } from 'src/app/_model-dto/category/categoryHierarchy';
import { AdminsService } from 'src/app/_services/admins.service';
import { MatDialog } from '@angular/material/dialog';
import { PictureModelComponent } from 'src/app/_utils/picture-model/picture-model.component';


@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent implements OnInit{

  public brandsList: BrandResponse[] | undefined;
  public categoriesList: CategoryResponse[] | undefined;
  public categoriesListHierarchy : CategoryHierarchy<CategoryResponse>[] | undefined;
  
  product: Product = new Product();
  // brand: Brand = new Brand();
  // category: Category = new Category();
  mainImageFile: FileHandle | undefined;
  subImagesFiles: FileHandle[] = [];


  specContainer: any;
  prodspecRow: any;
  btnP: any;
  btnM: any;
  


  constructor(private productService: ProductService,
    private adminService: AdminsService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog){}
  
  ngOnInit(): void {
    this.getAllBrands();
    this.getAllCategories();

    this.specContainer = document.querySelector('#prodspecs_container');
    this.prodspecRow = document.querySelector('#prodspecs_container .prodspec_row');
    this.btnP = document.querySelector('.btnP');
    this.btnM = document.querySelector('.btnM');

    this.btnP?.addEventListener('click', () => this.addListItemBtnAction(this.prodspecRow));
    this.btnM?.addEventListener('click', () => this.removeListItemBtnAction(this.prodspecRow));
  }



  public getAllBrands(): void{
    this.productService.getAllBrandsWithOutImgs()
    .subscribe({
      next: (next : BrandResponse[]) =>{
        console.log(next)
        this.brandsList = next;
      },
      error : (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public getAllCategories(): void{
    this.productService.getAllCategoriesWithOutImgs()
    .subscribe({
      next: (next : CategoryResponse[]) =>{
        console.log(next)
        this.categoriesList = next;
        this.categoriesListHierarchy = this.createCategoryListHierarchy(next);  
      },
      error : (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  createCategoryListHierarchy(categoryList: CategoryResponse[]){
    // Reorder the data array
    categoryList.sort((a, b) => {
      if (a.parentid === null && b.parentid !== null) {
        return -1; // Move 'Component' to the front
      } else if (a.parentid !== null && b.parentid === null) {
        return 1; // Move 'Peripheral' to the front
      }
      return 0; // Maintain the order of other items
    });

    const hierarchyList = this.createHierarchy(categoryList, null);
    console.log(JSON.stringify(hierarchyList, null, 2));
    
    return hierarchyList;
  }

  createHierarchy(categoryList: CategoryResponse[], parentId: number | null) {
    const hierarchy : CategoryHierarchy<CategoryResponse>[]= [];
    for (const category of categoryList) {
      if (category.parentid === parentId) {
        const newItem: CategoryHierarchy<CategoryResponse> = {
          parent: category,
          children: this.createHierarchy(categoryList, category.id)
        };
        hierarchy.push(newItem);
      }
    }
    return hierarchy;
  }

  public addProduct(productForm: NgForm){
    this.product.specs = this.specificationsArray();
   
    const formData =  this.prepareFormData(this.product);

    this.adminService.addProduct(formData).subscribe({
      next: (next : ProductDetails) => {
        this.clearForm(productForm);
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

    this.specContainer.innerHTML = '';
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

  specificationsArray(): any{
    const specsList: any = {};
    const spec_keys = document.querySelectorAll('#spec_key');
    const spec_values = document.querySelectorAll('#spec_value');
    for(let i=0; i< spec_keys.length ; i++){
      var key = (<HTMLInputElement>spec_keys[i]).value;
      var val = (<HTMLInputElement>spec_values[i]).value;
      if(key!='' && val!=''){
        specsList[key] = val;
      }
    }
    return specsList;
  }

  addListItemBtnAction(listElem: any) {
    if (this.specContainer.childElementCount == 10) {
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
      this.specContainer.appendChild(prodspecDiv);
    } else {
      listElem.after(prodspecDiv);
    }
  }

  removeListItemBtnAction(li: any){
    li.remove();
    if(this.specContainer.childElementCount == 0){
      this.addListItemBtnAction(null);
    }
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

  openDialog(){
    var _popup = this.dialog.open(PictureModelComponent,{
      width: '60%',
      height: '400px'
    })
    _popup.afterClosed().subscribe(item =>{
      console.log("--------------")
      console.log(item);
    })
  }

}
