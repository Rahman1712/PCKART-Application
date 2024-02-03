import { HttpErrorResponse } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminsService } from 'src/app/_services/admins.service';
import { AdminDetails } from 'src/app/_model-dto/admin/adminDetails';
import { AuthenticationResponse } from 'src/app/_model-dto/admin/authenticationResponse';

@Component({
  selector: 'app-admins-add',
  templateUrl: './admins-add.component.html',
  styleUrls: ['./admins-add.component.css']
})
export class AdminsAddComponent implements OnInit{
  constructor(private adminService: AdminsService, private _router: Router){}
  adminDetails: AdminDetails= new AdminDetails();

  ngOnInit(): void {
  }

  addAdmin(adminForm: NgForm){
    console.log(this.adminDetails)   
    this.adminService.addAdmin(this.adminDetails).subscribe({
      next: (next : AuthenticationResponse) => {
        adminForm.reset();
        this._router.navigate(['/admins'])
      },
      error : (error: HttpErrorResponse) =>{
        console.log(error)
      }
    });
  }

  clearForm(adminForm: NgForm){
    adminForm.reset();
  }
}
