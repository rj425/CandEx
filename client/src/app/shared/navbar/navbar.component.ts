import { Component,OnInit,OnDestroy,ChangeDetectorRef} from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { CandexService,AuthService,RouterService} from '../service/index';
import { FormGroup, FormControl, FormArray, Validators,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Config } from '../../shared/index';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { trigger,state,style,animate,transition } from '@angular/animations';
import {Subscription} from 'rxjs/Subscription'

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],

})
export class NavbarComponent implements OnInit{ 

	public user:any=null
	private userForm:FormGroup
	private editUserForm:FormGroup
	private showEditProfile:boolean
	private showChangePassword:boolean
	private confirmPassword:any
	private jsonResponse:any
	public percentage:any;
	

	constructor(private _candexService:CandexService,
				private _cookieService:CookieService,
				private _routerService:RouterService,
				private _authService:AuthService,
				private _router:Router,public snackBar: MatSnackBar){
       
    this._routerService.percentageValue.subscribe(res=>this.percentage=res)

	}
	ngOnInit(){
		this._candexService.get(Config.SERVER+'/authUser/')
						   .subscribe(res=>this.user=res.json(),
						   			  error=>console.log(error))
		this.userForm=new FormGroup({
	      username:new FormControl('',Validators.required),
	      password:new FormControl('',Validators.required),
	      newPassword:new FormControl('')
	    })
    	this.editUserForm=new FormGroup({
	      username:new FormControl('',Validators.required),
	      first_name:new FormControl('',Validators.required),
	      last_name:new FormControl('',Validators.required),
	      email:new FormControl('',Validators.required),
	      is_active:new FormControl(''),
	      is_staff:new FormControl(''),
	      is_superuser:new FormControl(''),
	      groups:new FormControl('')
	    })
	    
	}

    goToBlockNavigate(){
    	if(this.percentage===true){
    	this.snackBar.open("Still uploading.. Wait for sometime!!",'',{duration:2000});
    }
    }
	changePassword(){
	    this.showEditProfile=false
	    this.showChangePassword=true;
	}

	editProfile(){
    	this.showEditProfile=true
    	this._candexService.get(Config.SERVER+'/getUser/')
          					.subscribe(res=>{this.user=res.json(),this.preFillInformation(res.status)},
                    					error=>{console.log(error)})

    }

    preFillInformation(statusCode:any){
	    if(statusCode==200|| statusCode==201 || statusCode==204){
		    this.editUserForm.controls['username'].setValue(this.user.username)
		    this.editUserForm.controls['first_name'].setValue(this.user.first_name)
		    this.editUserForm.controls['last_name'].setValue(this.user.last_name)
		    this.editUserForm.controls['email'].setValue(this.user.email)
		    this.editUserForm.controls['is_active'].setValue(this.user.is_active)
		    this.editUserForm.controls['is_staff'].setValue(this.user.is_staff)
		    this.editUserForm.controls['is_superuser'].setValue(this.user.is_superuser)
		    this.editUserForm.controls['groups'].setValue(this.user.groups)
	    }
  	}

  	onSubmitEditPassword(){
	    let error=this.matchPassword()
	    let statusObj:any;
	    if(!error){this._candexService.post(Config.SERVER+'/changePassword/',this.userForm.value)
	                  .subscribe(res=>{statusObj=res.json(),
	                            this.checkStatus(statusObj)},
	                        error=>{console.log(error)})
	    }
  	}

  	matchPassword(){
	    if(this.confirmPassword!==this.userForm.value['newPassword']){
		    this.snackBar.open('Entered passwords don\'t match.Please try again','',{duration:2000})
		    this.userForm.controls['newPassword'].setValue('')
		    this.confirmPassword=''
		    return true;
    	}
    	return false;
  	}

    checkStatus(statusObj:any){
	    if(statusObj.status==="InvalidCredentials"){
		    this.snackBar.open('Current password entered is incorrect. Try Again','',{duration:2000})
		    this.userForm.reset()
		    this.confirmPassword=''
	    }else if(statusObj.status==="SuccessfulChange"){
		    this.snackBar.open('Password successfully updated','',{duration:2000})
		    this.userForm.reset()
		    this.confirmPassword=''
		    this.showChangePassword=false;
    	}  
  	}

  	onSubmitEditUser(){
	    this._candexService.put(Config.SERVER+'/users/'+this.user.id+'/',this.editUserForm.value)
	                		.subscribe(res=>{this.jsonResponse=res.json(),
	                  						this.displayStatus(res.status)},
	                  				error=>{console.log(error),this.snackBar.open('Updation Unsuccessful','',{duration:2000})})
  	}

	displayStatus(statusCode:any){
	    if(statusCode==200|| statusCode==201 || statusCode==204){
	      	this.snackBar.open('Changes updated successfully','',{duration:2000})
	    }
	    this.showEditProfile=false;
	}

  logout(){
    this._cookieService.remove('authToken')
    this._authService.setLoginStatus(false)
    console.log("User has logged out.")
    this._router.navigate([''])
  }

}
