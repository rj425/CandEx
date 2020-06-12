import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CandexService,AuthService } from '../shared/service/index';
import { CookieService } from 'angular2-cookie/services/cookies.service';

@NgModule({
  imports: [AuthRoutingModule,SharedModule],
  declarations: [AuthComponent],
  exports: [AuthComponent],
  providers: [CandexService, CookieService,AuthService ]
})
export class AuthModule { }
