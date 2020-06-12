import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CandidateEngagementComponent } from './candidateEngagement.component';
import { CandidateEngagementRoutingModule } from './candidateEngagement-routing.module'
import { CandexService } from '../../shared/service/candex.service';

@NgModule({
  imports: [CommonModule,
  			ReactiveFormsModule,
  			SharedModule,  			
  			CandidateEngagementRoutingModule],

  declarations: [CandidateEngagementComponent],

  exports: [CandidateEngagementComponent],

  providers:[CandexService]

})
export class CandidateEngagementModule { }
