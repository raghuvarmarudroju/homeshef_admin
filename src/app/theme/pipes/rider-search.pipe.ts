import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'RiderSearchPipe', pure: false })
export class RiderSearchPipe implements PipeTransform {
  transform(value:any, args?:any) {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      console.log(value);
      return value.filter((rider:any) => {
        if (rider.name) {
          return rider.name.search(searchText) !== -1;
        }
        else if(rider.email){
          return rider.email.search(searchText) !== -1;
        }else{
          return null
        }
      });
    }
  }
}