import { Component,OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { CandexService,AuthService } from '../service/index';
import { Router } from '@angular/router';
import { Config } from '../../shared/index';
import { FormGroup, FormControl, FormArray, Validators,FormsModule, ReactiveFormsModule} from '@angular/forms';
/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ToolbarComponent implements OnInit{


  public isLoggedIn: boolean=false;
  private user:any=null

  constructor(private _cookieService:CookieService,private candexService:CandexService,private router:Router,private _authService:AuthService){

  }

  ngOnInit(){
     this._authService.userLoggedIn.subscribe(status=>{
         if(status!=null){
           this.isLoggedIn=status
          }
          else
            this.getCookie()!==undefined?this._authService.setLoginStatus(true):this._authService.setLoginStatus(false)
      })
    }

   getCookie(){
    return this._cookieService.get('authToken');
  }

  getUserInformation(){
    if(this._authService.isLoggedIn())
      this.user=this._cookieService.getObject('user')
  }

  logout(){
    this._cookieService.remove('authToken')
    this._cookieService.remove('user')
    this._authService.setLoginStatus(false)
    console.log("User has logged out.")
    this.router.navigate([''])
  }
}

