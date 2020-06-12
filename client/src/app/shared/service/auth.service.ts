import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { CookieService } from 'angular2-cookie/core'

@Injectable()
export class AuthService{

	userLoggedIn:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(null)

	public setLoginStatus(value:boolean){
		this.userLoggedIn.next(value)
	}

	public isLoggedIn():boolean{
		let loginStatus:boolean=null
		this.userLoggedIn.subscribe(status=>loginStatus=status)
		return loginStatus
	}

}