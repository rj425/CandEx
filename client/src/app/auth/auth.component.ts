import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { Config,CandexService,AuthService,ProgressBarService} from '../shared/index'
import { MatSnackBar } from '@angular/material';  

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.css'],
})
export class AuthComponent implements OnInit {

  authForm:any=null;
  response:any=null;
  userResponse:any;
  loginFailed:boolean=false;
  user:any=null

  constructor(private _cookieService:CookieService,
              private _candexService:CandexService, 
              public router:Router, 
              private _authService:AuthService,
              public snackBar: MatSnackBar,
              public progressBarService:ProgressBarService){
    this.authForm=new FormGroup({
      username:new FormControl('',Validators.required),
      password:new FormControl('',Validators.required)
    })
  }
  
  ngOnInit() {
    if(this.getCookie()!==undefined){
      this._authService.setLoginStatus(true)
      console.log('User is already logged in.')
      this.router.navigate(['dashboard'])
    }
    else if(this.getCookie()===undefined){
      this._authService.setLoginStatus(false)
      console.log('User not logged.')   
    }
  }

  getCookie(){
      return this._cookieService.get('authToken');
  }

  authenticate(){
      this.progressBarService.setProgressBarVisibility(true)
      this.authForm.disable()
      this._candexService.postForAuthToken(Config.SERVER+'/authToken/',this.authForm.value)
                        .subscribe(res=>{this.response=res.json(),
                                          res.status===200?this.checkUserGroup():null},
                                  error=>{console.log(error),
                                          this.progressBarService.setProgressBarVisibility(false),
                                          this.authForm.enable(),
                                          this.snackBar.open("Login Failed! Please Check Your Credentials.",'',{duration:2000})})
  }

  public checkUserGroup(){
      this._cookieService.put('authToken',this.response.token)
      this._candexService.get(Config.SERVER+'/authUser/')
                        .subscribe(res=>{res.status===200?this.showRoleBasedDashboard(res.json()):null})    
  }

  public showRoleBasedDashboard(userObj:any){
      this.user={
        username:userObj.username,
        firstName:userObj.first_name,
        lastName:userObj.last_name,
        email:userObj.email
      }
      this._cookieService.putObject('user',this.user)
      let userFullName=userObj.first_name+' '+userObj.last_name
      let userGroups=userObj.groups
      console.log('USER GROUPS - ',userGroups)
      this.progressBarService.setProgressBarVisibility(false)
      this.goToDashboard(userFullName)
  }

  goToDashboard(userFullName:string){
       this.authForm.reset()
       this._authService.setLoginStatus(true)
       console.log('User has logged in.')
       this.snackBar.open('Welcome to CandEx!',userFullName,{duration:2000})
       this.router.navigate(['dashboard'])
  }

}
