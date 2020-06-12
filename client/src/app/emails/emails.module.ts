import { NgModule } from '@angular/core';
import { EmailComponent } from './emails.component';
import { EmailRoutingModule } from './emails-routing.module';
import { ListEmailModule } from './listEmails/listEmails.module';
import { CandexService } from '../shared/service/candex.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule,
  			EmailRoutingModule,
  			ListEmailModule],

  declarations: [EmailComponent],
  
  exports: [EmailComponent],
  
  providers:[CandexService]
})
export class EmailModule { }
