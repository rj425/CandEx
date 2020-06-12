import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProgressBarService{

	progressBarVisibility:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false)

	public setProgressBarVisibility(value:boolean){
		this.progressBarVisibility.next(value)
	}

	public isProgressBarVisible():boolean{
		let visbility:boolean=null
		this.progressBarVisibility.subscribe(status=>visbility=status)
		return visbility
	}

}