import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
@Injectable()
export class RouterService{
    percentageValue:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false)

    public setValue(value:boolean){
    this.percentageValue.next(value)
  }

    public getValue():boolean{
    let status:boolean=null
    this.percentageValue.subscribe(status=>status=status)
    return status
  }

}