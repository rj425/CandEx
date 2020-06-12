import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ListEmailComponent } from './listEmails.component';
import { ListEmailRoutingModule } from './listEmails-routing.module';
import { CandexService } from '../../shared/service/candex.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, ListEmailRoutingModule,FormsModule, HttpModule,SharedModule],
  declarations: [ListEmailComponent], 
  exports: [ListEmailComponent],
  providers: [CandexService]
}) 
export class ListEmailModule { }
