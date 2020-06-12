import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module'
import { CandidateFeedbackComponent } from './candidateFeedback.component';
import { CandidateFeedbackRoutingModule } from './candidateFeedback-routing.module';

@NgModule({
  imports: [CandidateFeedbackRoutingModule,SharedModule],
  declarations: [CandidateFeedbackComponent],
  exports:[CandidateFeedbackComponent]
})
export class CandidateFeedbackModule {}
