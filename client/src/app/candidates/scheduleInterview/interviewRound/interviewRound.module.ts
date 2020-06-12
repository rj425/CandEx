import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CandexService } from '../../../shared/service/candex.service';
import { SharedModule } from '../../../shared/shared.module';
import { InterviewRoundComponent,RoundDecisionDialog,PanellistsFeedbackDialog } from './interviewRound.component'

@NgModule({
	imports:[CommonModule,ReactiveFormsModule,HttpModule,SharedModule],
	declarations:[InterviewRoundComponent,PanellistsFeedbackDialog,RoundDecisionDialog],
	entryComponents:[PanellistsFeedbackDialog,RoundDecisionDialog],
	exports:[InterviewRoundComponent],
	providers:[CandexService]
})
export class InterviewRoundModule{}
