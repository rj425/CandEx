import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from './users.component';
import { UserRoutingModule } from './users-routing.module';
import { CandexService } from '../shared/service/candex.service'
import { ListUserModule } from './listUsers/listUsers.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, 
  			UserRoutingModule,
  			FormsModule,
  			ReactiveFormsModule,
  			ListUserModule,
  			SharedModule],

  declarations: [UserComponent],

  exports: [UserComponent],

  providers:[CandexService]

})
export class UserModule { }
