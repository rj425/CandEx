import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'values'})
export class ValuePipe implements PipeTransform {
  transform(value:any, args:string[]) : any {
     let y:string;
        y=value.toString();
        y=y.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{6})Z$/g,'$3/$2/$1');
      
    return y;
  }
}

