import { Component,OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AdminsService } from '../_services/admins.service';
import { Admin } from '../_model-dto/admin/admin';
import { FileHandle } from '../_model-dto/file-handle.model';
import { map } from 'rxjs';
import { ImageProcessingService } from '../_services/image-processing-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PasswordChangeModelComponent } from '../_utils/password-change-model/password-change-model.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  constructor(private authService: AuthService, 
    private adminService: AdminsService,
    private imageProcessingService: ImageProcessingService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    ){}

  @ViewChild('passwordForm') passwordForm: NgForm;
  username: string | null;
  admin: Admin;
  adminImageFile: FileHandle | undefined;
  currentPassword: string = '';
  newPassword: string = '';
  renewPassword: string = '';

  dialogRef: MatDialogRef<PasswordChangeModelComponent> | null;

  ngOnInit(): void {
    this.loadAdminDetail();
  }

  loadAdminDetail(){
    this.username = this.authService.getUsername();
    this.adminService.getAdminByUsername(this.username!)
    .pipe(
      map((admin: Admin) => 
        this.imageProcessingService.createAdminImage(admin)
      )
    )
    .subscribe({
      next: (next: Admin) =>{
        this.admin = next;
        this.adminImageFile = this.admin.adminImage;
        console.log(this.admin)
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    });
  }

  updateAdminDetail(){
    const formData =  this.prepareFormData(this.admin);
    if(this.adminImageFile!.file.name == "null" || this.adminImageFile!.file.name == null){
      console.log(this.adminImageFile )
      alert('please select image');
      return;
    }
    
    this.adminService.updateAdminDetails(this.admin.id, formData).subscribe({
      next: (next : string) => {
        console.log(next)

        location.reload(); //reload page
      },
      error : (error: HttpErrorResponse) =>{
        console.log(error)
      }
    });
  }

  updateAdminCredential(){
    if(this.newPassword != this.renewPassword){
      this.dialogRef = this.dialog.open(PasswordChangeModelComponent, {
        disableClose: false
      });
      this.dialogRef.componentInstance.title = "Password error ?";
      this.dialogRef.componentInstance.message = "new password and renew password are not same";
      this.dialogRef.componentInstance.isError = true;
      this.dialogRef.afterClosed().subscribe(result => {
        this.dialogRef = null;
      });
      return;
    }
    //console.log('passwordForm values :',this.passwordForm.value)
    this.adminService.updatePasswordById(this.admin, this.currentPassword, this.newPassword)
    .subscribe({
      next: (next:any) =>{
        console.log(next)
        
        this.dialogRef = this.dialog.open(PasswordChangeModelComponent, {
          disableClose: true
        });
        this.dialogRef.componentInstance.title = "Password changed success";
        this.dialogRef.componentInstance.message = "Please logout to continue";
        this.dialogRef.componentInstance.isError = false;
        this.dialogRef.afterClosed().subscribe(result => {
          this.dialogRef = null;
        });
        
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        const errorMessage = error.error; //"{\"errorMessage\":\"current password doesn't match\"}"
        const errorObject = JSON.parse(errorMessage);
        const extractedErrorMessage = errorObject.errorMessage;

        this.dialogRef = this.dialog.open(PasswordChangeModelComponent, {
          disableClose: false
        });
        this.dialogRef.componentInstance.title = "Error occured";
        this.dialogRef.componentInstance.message = extractedErrorMessage;
        this.dialogRef.componentInstance.isError = true;
        this.dialogRef.afterClosed().subscribe(result => {
          this.dialogRef = null;
        });
      }
    });
  }

  prepareFormData(admin: Admin): FormData{
    const formData = new FormData();

    formData.append(
      'request', 
      new Blob([JSON.stringify(admin)], {
        type: 'application/json'
      })
    );

    formData.append(
      'file', 
      this.adminImageFile!.file,
      this.adminImageFile!.file.name,
    );
    
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

      this.adminImageFile = fileHandle;
    }
  }

  deleteImage(){
    this.adminImageFile = undefined;
  }


}
