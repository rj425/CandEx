import { Component } from '@angular/core';
import { Config } from './shared/index';
import { CookieService } from 'angular2-cookie/core';
import { CandexService,AuthService,ProgressBarService } from './shared/service/index';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls:['app.component.css']  
})
export class AppComponent {

  public hideLoading: boolean = false;
  public isLoggedIn: boolean=false;
  public showComposeMail:boolean=false
  public showAboutPage:boolean=false
  public emailForm:FormGroup;
  public emailTemplates:any;
  public templateChoice:any;
  public displayProgressBar:boolean
  routerOutletContainerWidth=82
  
  constructor(private _cookieService:CookieService,public candexService:CandexService,
              public router:Router,private _authService:AuthService,private progressBarService:ProgressBarService) {
      this.progressBarService.progressBarVisibility.subscribe(res=>this.displayProgressBar=res)
      this._authService.userLoggedIn.subscribe(status=>{
         if(status!=null){
           this.isLoggedIn=status
          }
          else
            this.getCookie()!==undefined?this._authService.setLoginStatus(true):this._authService.setLoginStatus(false)
      })
    }
    ngOnInit(){
    }

    showAbout(){
      this.showAboutPage=true;
    }

    showEmail(){
      this.showComposeMail=true;
    }

    getCookie(){
      return this._cookieService.get('authToken');
    }

    addHolidays(){
      this.router.navigate(['annualHolidays']);
    }

    updateLeave(){
      this.router.navigate(['updateLeaves']);
    }
   
}
