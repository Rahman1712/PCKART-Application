import { Component,Inject,OnInit,ViewChild,ElementRef,AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent,base64ToFile  } from 'ngx-image-cropper';
import { FileHandle } from 'src/app/_model-dto/file-handle.model';

@Component({
  selector: 'app-picture-model',
  templateUrl: './picture-model.component.html',
  styleUrls: ['./picture-model.component.css']
})
export class PictureModelComponent implements OnInit,AfterViewInit{
  
  inputdata: any;
  closeMessage = 'closed using directive'
  @ViewChild("fileShow") fileShow : ElementRef;
  fileCrop: any ;
  fileshow: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PictureModelComponent>,
    public sanitizer: DomSanitizer){}
  ngAfterViewInit(): void {
    this.fileshow = document.querySelector('#file-show');
  }
  
  ngOnInit(): void {
    this.inputdata = this.data;
    this.fileshow = document.querySelector('#file-show');
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageFile: FileHandle;
  fileName: string;
  fileInPic: File ;
  

  fileChangeEvent(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.fileName = file.name;
    }
    console.log(this.fileName)

    this.imageChangedEvent = event;
  }


imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
  console.log(this.croppedImage)

  const blobUrl = this.fileShow.nativeElement.currentSrc;
  const filename = this.fileName;
  
  this.blobUrlToFile(blobUrl, filename)
  .then(file => {
    this.fileInPic = file;
    // console.log(file);
    console.log(this.fileInPic);
  })
  .catch(error => {
    console.error(error);
  });

  const fileHandle: FileHandle = {
    file: this.fileInPic,
    url: this.croppedImage
  }

  this.imageFile = fileHandle;
}

closepopup(){
  // this.dialogRef.close('closed');
  console.log(this.fileShow)
  console.log(this.fileShow.nativeElement.currentSrc)

  console.log(this.croppedImage)
  const  s = document.querySelector('#file-show');
  this.dialogRef.close(this.imageFile);
}


  imageLoaded() {
    // show cropper
  }

  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  async blobUrlToFile(blobUrl: any, filename: any) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const file = new File([blob], filename);
    return file;
  }
  

}
