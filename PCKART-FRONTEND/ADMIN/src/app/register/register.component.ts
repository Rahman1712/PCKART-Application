import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AdminDetails } from '../_model-dto/admin/adminDetails';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  adminDetails: AdminDetails= new AdminDetails();

  constructor(private _auth: AuthService, private _router: Router){}

  ngOnInit(): void {
    
  }


  registerUser() {
    console.log(`TOKEN : ${localStorage.getItem('token')}`)
    console.log(this.adminDetails)
    this._auth.registerUser(this.adminDetails)
      .subscribe(
        { 
          next: next => {
            console.log(next)
            //localStorage.setItem('token', next.token)
            this._router.navigate(['/dashboard'])
          },
          error: console.error
        }
      );
  }
  // registerUser() {
  //   console.log(this.adminDetails)
  //   this._auth.registerUser(this.adminDetails)
  //     .subscribe(
  //       res => console.log(res),
  //       err => console.log(err)
  //     )
  // }
}
