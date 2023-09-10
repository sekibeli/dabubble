import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectToArray'
})
export class ObjectToArrayPipe implements PipeTransform {

  transform = (objects: any =[]) =>
  {
    let items = Object.values(objects);
    return items;
  
  }

}
