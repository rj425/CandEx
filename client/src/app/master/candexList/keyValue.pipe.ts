import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value:any, args:string[]) : any {
  	// let keys = [];
    /*for (let key in value) {
 		let x,y:string;
    	x=key.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")
    	x=x.charAt(0).toUpperCase() + x.slice(1)
    	y=value[key].toString();
    	y=y.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{6})$/g,'$3/$2/$1');
    	keys.push({key:x , value:y});
    }
     return keys;*/
     let x:string;
    //for (var i =0; i < value.length; i++) {
    	// console.log(value[i].key) 		
 		x=value;
 		x=x.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")
    	x=x.charAt(0).toUpperCase() + x.slice(1)
    	//keys.push({key:x });
    //}
    
    return x;
  }
}

