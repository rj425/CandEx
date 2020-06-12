import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import "hammerjs"

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from './auth/auth.module';
import { CandidateModule } from './candidates/candidates.module';
import { EmailModule } from './emails/emails.module';
import { HomeModule } from './home/home.module';
import { MasterModule } from './master/master.module';
import { RequestsModule } from './requests/requests.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './users/users.module';
import { CandexService } from './shared/service/candex.service';
import { AnnualHolidaysModule } from './lms/annualHolidays/annualHolidays.module';
import { UpdateLeavesModule } from './lms/updateLeaves/updateLeaves.module';
import { EmployeeDetailsModule } from './lms/employeeDetails/employeeDetails.module';
import { CookieOptions } from 'angular2-cookie/core';
import { RouterService } from './shared/service/router.service'
import { MATERIAL_COMPATIBILITY_MODE } from 'md2';
import {resumeUploadModule} from './resumeUpload/resumeUpload.module';
import {resumeSearchModule} from './resumeSearch/resumeSearch.module';

@NgModule({

  imports: [BrowserModule, 
            BrowserAnimationsModule,
  			    HttpModule,
  			    AppRoutingModule,
 			      AuthModule,
     			  CandidateModule,
      			EmailModule,
      			HomeModule,
      			MasterModule,  
      			RequestsModule,
      			SharedModule.forRoot(),
      			UserModule,
            AnnualHolidaysModule,
            EmployeeDetailsModule,
            UpdateLeavesModule,
            resumeUploadModule,
            resumeSearchModule],

  exports: [],

  declarations: [AppComponent],

  providers: [RouterService,CandexService,{
    provide:MATERIAL_COMPATIBILITY_MODE,useValue:true
  },{
    provide:CookieOptions,useValue:{}
  }],
  
  bootstrap: [AppComponent]

})
export class AppModule { }