import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDTO } from 'src/app/_model-dto/user/user-dto';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent {

  constructor(public dialogRef: MatDialogRef<UserViewComponent>){}

  public userDto: UserDTO;
  panelOpenState = false;
}
