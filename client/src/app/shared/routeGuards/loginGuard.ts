import { Injectable } from '@angular/core';
import { CanActivate,Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LoginGuard implements CanActivate{

	constructor(private _authService:AuthService,private _router:Router){}

	canActivate():boolean{
		if(this._authService.isLoggedIn()===true)
			return true
		else (this._authService.isLoggedIn()===false)
		{
			this._router.navigate([''])
			return false
		}
	}

}