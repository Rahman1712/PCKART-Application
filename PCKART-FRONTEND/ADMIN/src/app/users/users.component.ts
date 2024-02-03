import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from '../_services/user.service';
import { ImageProcessingService } from '../_services/image-processing-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { UserDTO } from '../_model-dto/user/user-dto';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserViewComponent } from './user-view/user-view.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  @ViewChild(MatPaginator) static paginatorValue: MatPaginator;

  constructor(private userService: UserService,
    private imageProcessingService: ImageProcessingService,
    public dialog: MatDialog,
  ){}

  usersDtoList: UserDTO[];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'username', 'fullname', 'email', 'nonlocked' ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchText: string;
  currentPage = 5;
  pageItemNum = 5;

  dialogRef: MatDialogRef<UserViewComponent> | null;

  ngOnInit(): void {
    this.getUsers();
  }

  public getUsers(): void{
    this.userService.getAllUsers()
    .pipe(
      map((users: UserDTO[] , i) => 
        users.map((user: UserDTO) => 
          this.imageProcessingService.createUserDtoImage(user)
          )
        )
    )
    .subscribe({
      next: (next: UserDTO[]) =>{
        console.log(next)
        this.usersDtoList = next;
        this.dataSource = new MatTableDataSource<UserDTO>(this.usersDtoList);
        this.dataSource.paginator = this.paginator;
        UsersComponent.paginatorValue = this.paginator;
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }

  showUserDetails(user: any){
    this.dialogRef = this.dialog.open(UserViewComponent, {
      disableClose: true,
      width: "60%",
      // height: '400px',
    });
    this.dialogRef.componentInstance.userDto = user;
    this.dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('dialog closed')
      }
      this.dialogRef = null;
    });
  }

  updateActive(userId: number,nonLocked: boolean){
    console.log(userId, nonLocked)
    this.userService.updateEnabledAndNonLocked(userId,nonLocked)
    .subscribe({
      next: (next: string) =>{
        console.log(next)
        // this.ngOnInit();
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }
}
