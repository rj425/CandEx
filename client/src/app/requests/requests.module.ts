import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RequestsComponent } from './requests.component';
import { RequestsRoutingModule } from './requests-routing.module';
import { CandexService } from '../shared/service/candex.service';
import { ManageRequestsModule } from './manageRequests/manageRequests.module'

@NgModule({
  imports: [CommonModule,
  			RequestsRoutingModule, 
  			ReactiveFormsModule,
  			SharedModule,  			  			
  			ManageRequestsModule],

  declarations: [RequestsComponent],

  exports: [RequestsComponent],

  providers:[CandexService]

})
export class RequestsModule { }
