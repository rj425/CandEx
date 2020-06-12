import { NgModule } from '@angular/core';
import { PanellistFeedbackComponent } from './panellistFeedback.component';
import { PanellistFeedbackRoutingModule } from './panellistFeedback-routing.module';
import { SharedModule } from '../../../shared/shared.module'
import { InterviewProcessTimelineModule } from '../interviewProcessTimeline/interviewProcessTimeline.module';
import { PanellistNotesModule } from '../panellistNotes/panellistNotes.module';
import { SafePipe } from './safePipe'

@NgModule({
	imports:[SharedModule,
			PanellistFeedbackRoutingModule,
			InterviewProcessTimelineModule,
			PanellistNotesModule],

	declarations:[PanellistFeedbackComponent,SafePipe],
	exports:[PanellistFeedbackComponent]
})
export class PanellistFeedbackModule{}