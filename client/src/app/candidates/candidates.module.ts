import { NgModule } from '@angular/core';
import { Validators} from '@angular/forms';
import { CandidateComponent } from './candidates.component';
import { CandidateRoutingModule } from './candidates-routing.module';
import { CandexService } from '../shared/index';
import { CandidateFeedbackModule } from './candidateFeedback/candidateFeedback.module';
import { EditCandidateModule } from './editCandidate/editCandidate.module'; 
import { listCandidateModule } from './listCandidates/listCandidates.module';
import { ScheduleInterviewModule } from './scheduleInterview/scheduleInterview.module';
import { CandidateEngagementModule } from './candidateEngagement/candidateEngagement.module';
import { SharedModule } from '../shared/shared.module';
import { CandidateofferletterModule } from './candidateOfferLetter/candidateOfferLetter.module';

@NgModule({
  imports: [SharedModule,
  			CandidateRoutingModule,
  			CandidateFeedbackModule,
  			EditCandidateModule,
  			listCandidateModule,
  			ScheduleInterviewModule,
			  CandidateEngagementModule,
			  CandidateofferletterModule,
			  ],

  declarations: [CandidateComponent],

  exports: [CandidateComponent],

  providers: [CandexService]
})
export class CandidateModule { }
