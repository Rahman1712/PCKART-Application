import { Pipe, PipeTransform } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UsersComponent } from '../users/users.component';

@Pipe({
  name: 'userfilter'
})
export class UserfilterPipe implements PipeTransform {

  transform(value: any, sName: string): any {
    // console.log(value)
    // console.log("====")
    if (sName === "" || sName == null || sName == undefined) {
      return value;
    }

    let len = value.filteredData.length;
    const usersArray: any = new MatTableDataSource<any>();


    for (let i = 0; i < len; i++) {
      let fullname: string = value.filteredData[i].fullname;
      let username: string = value.filteredData[i].username;
      let email: string = value.filteredData[i].email;

      if (fullname.toLowerCase().startsWith(sName.toLowerCase()) ||
          username.toLowerCase().startsWith(sName.toLowerCase()) ||
          email.toLowerCase().startsWith(sName.toLowerCase()) 
      ) {
        usersArray.filteredData.push(value.filteredData[i])
      }
    }
    usersArray.paginator = UsersComponent.paginatorValue;
    //console.log(usersArray)

    return usersArray;
  }

}
