import { Pipe,PipeTransform } from '@angular/core';

@Pipe({name:'key'})
export class KeyPipe implements PipeTransform{

	transform(value:any):any{
		if(!value)
			return null
		return Object.keys(value)
	}

}
