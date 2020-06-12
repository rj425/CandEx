import { NgModule } from '@angular/core';
import { CandexService } from '../../shared/index';
import { SharedModule } from '../../shared/shared.module';
import { ScheduleInterviewComponent,InterviewTimelineDialog,Dialog,HiringDecisionDialog } from './scheduleInterview.component';
import { InterviewRoundModule } from './interviewRound/interviewRound.module'
import { PanellistFeedbackModule } from './panellistFeedback/panellistFeedback.module'
import { PanellistNotesModule } from './panellistNotes/panellistNotes.module'
import { InterviewProcessTimelineModule } from './interviewProcessTimeline/interviewProcessTimeline.module';
import { ScheduleInterviewRoutingModule } from './scheduleInterview-routing.module'

@NgModule({
	imports:[SharedModule,
			ScheduleInterviewRoutingModule,
			InterviewRoundModule,
			PanellistFeedbackModule,
			PanellistNotesModule,
			InterviewProcessTimelineModule
			],
	entryComponents:[InterviewTimelineDialog,Dialog,HiringDecisionDialog],
	declarations:[ScheduleInterviewComponent,InterviewTimelineDialog,Dialog,HiringDecisionDialog],
	exports:[ScheduleInterviewComponent],
	providers:[CandexService]
})
export class ScheduleInterviewModule{}
