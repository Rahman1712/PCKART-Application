import { Component,OnInit,AfterViewInit } from '@angular/core';
import { AdminsService } from '../_services/admins.service';
import { ImageProcessingService } from '../_services/image-processing-service.service';
import { map } from 'rxjs';
import { Admin } from '../_model-dto/admin/admin';
import { FileHandle } from '../_model-dto/file-handle.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../_utils/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit, AfterViewInit{
  admin: Admin = new Admin();
  adminImageFile: FileHandle | undefined;
  adminsList: Admin[] = [];
  searchText: string;

  public popoverTitle: string = 'Delete Admin';
  public popoverMessage: string = 'Would you like to delete admin?'
  public cancelClicked: boolean = false;
  public confirmClicked: boolean = false;

  dialogRef: MatDialogRef<ConfirmationDialogComponent> | null;

  constructor(private adminService: AdminsService,
    private imageProcessingService: ImageProcessingService,
    public dialog: MatDialog,
  ){}

  ngAfterViewInit(): void { }
  ngOnInit(): void {
    this.getAdminDetailById(1);
    this.getAllAdmins();
  }

  getAllAdmins(){
    this.adminService.getAllAdmins()
    .pipe(
      map((admins: Admin[], i) => 
        admins.map((admin:Admin) =>
          this.imageProcessingService.createAdminImage(admin)
        )
      )
    )
    .subscribe({
      next: (next: Admin[]) =>{
        console.log(next)
        this.adminsList = next;
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message);
      }
    });
  }


  removeAdmin(adminId: number, index: number){
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmationMessage = "Are you sure you want to delete?";
    this.dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.adminService.deleteAdminById(adminId)
        .subscribe({
          next: (next: string) =>{
            console.log(next)
            this.adminsList.splice(index,1);
            this.ngOnInit();
          },
          error: (error: HttpErrorResponse) =>{
            console.log(error)
            alert(error.message);
          }
        });
      }
      this.dialogRef = null;
    })
  }

  getAdminDetailById(adminId: number){
    this.adminService.getAdminById(adminId)
    .pipe(
      map((admin: Admin) => 
        this.imageProcessingService.createAdminImage(admin)
      )
    )
    .subscribe({
      next: (next: Admin) =>{
        console.log(next)
        this.admin = next;
        this.adminImageFile = this.admin.adminImage;
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message);
      }
    });
  }


  openConfirmDialog(){
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmationMessage = "Are you sure you want to delete?";
    this.dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result)
        console.log("YES")
      }
      this.dialogRef = null;
    })
  }
}
