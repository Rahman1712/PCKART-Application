import { Component,OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminsService } from 'src/app/_services/admins.service';
import { ImageProcessingService } from 'src/app/_services/image-processing-service.service';
import { Admin } from 'src/app/_model-dto/admin/admin';
import { FileHandle } from 'src/app/_model-dto/file-handle.model';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admins-update',
  templateUrl: './admins-update.component.html',
  styleUrls: ['./admins-update.component.css']
})
export class AdminsUpdateComponent implements OnInit{

  constructor(private adminService: AdminsService,
    private sanitizer: DomSanitizer,
    private imageProcessingService: ImageProcessingService,
    private route: ActivatedRoute,
    private router: Router){}

  adminId: number;
  admin: Admin = new Admin();
  adminImageFile: FileHandle | undefined;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.adminId =  Number(params['id']);
       this.getAdminById(this.adminId);
    })
  }

  getAdminById(adminId: number){
    this.adminService.getAdminById(adminId)
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

  updateEnabledAndNonLocked(){
    console.log(this.admin)
    this.adminService.updateEnabledAndNonLocked(this.admin)
    .subscribe({
      next: (next: string) =>{
        console.log(next);
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    });
  }

}
