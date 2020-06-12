import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ListUserComponent } from './listUsers.component';
import { ListUserRoutingModule } from './listUsers-routing.module';
import { CandexService } from '../../shared/service/candex.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, ListUserRoutingModule,FormsModule, HttpModule,SharedModule],
  declarations: [ListUserComponent], 
  exports: [ListUserComponent],
  providers: [CandexService]
}) 
export class ListUserModule { }
