import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'UserSearchPipe', pure: false })
export class UserSearchPipe implements PipeTransform {
  transform(value:any, args?:any) {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter((user:any) => {
        if (user.name) {
          return user.name.search(searchText) !== -1;
        }
        else{
          return user.email.search(searchText) !== -1;
        }
      });
    }
  }
}