import { Pipe, PipeTransform } from '@angular/core';
import { Admin } from '../_model-dto/admin/admin';

@Pipe({
  name: 'adminsfilter'
})
export class AdminsfilterPipe implements PipeTransform {

  transform(value: any, sName: string): any {
    if(sName==="" || sName==null || sName==undefined){
      return value;
    }

    let len = value.length;

    const adminsArray: Admin[] = [];

    for(let i=0; i<len; i++){
      let username:string=value[i].username;
      let fullname:string=value[i].fullname;
      let role:string=value[i].role;
      let email:string=value[i].email;
      if(username.toLowerCase().startsWith(sName.toLowerCase()) || 
         fullname.toLowerCase().startsWith(sName.toLowerCase()) || 
         role.toLowerCase().startsWith(sName.toLowerCase()) || 
         email.toLowerCase().startsWith(sName.toLowerCase())
      ){
        adminsArray.push(value[i])
      }
    }
    return adminsArray;
  }

}
