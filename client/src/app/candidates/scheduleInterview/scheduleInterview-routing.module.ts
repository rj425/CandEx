import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScheduleInterviewComponent } from './scheduleInterview.component'
import { LoginGuard } from '../../shared/index'
import { PanellistFeedbackComponent } from './panellistFeedback/panellistFeedback.component';

@NgModule({
	imports:[
		RouterModule.forChild([
				{path:'feedback',component:PanellistFeedbackComponent},
      			{path:'scheduleInterview/:candidateID',component:ScheduleInterviewComponent,canActivate:[LoginGuard]},
				])
	],
	exports:[RouterModule],
	providers:[LoginGuard]
})
export class ScheduleInterviewRoutingModule{}