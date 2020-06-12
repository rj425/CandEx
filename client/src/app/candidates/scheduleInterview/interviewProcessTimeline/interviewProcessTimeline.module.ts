import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CandexService } from '../../../shared/index';
import { SharedModule } from '../../../shared/shared.module';
import { InterviewProcessTimelineComponent } from './interviewProcessTimeline.component'

@NgModule({
	imports:[CommonModule,HttpModule,SharedModule],
	declarations:[InterviewProcessTimelineComponent],
	exports:[InterviewProcessTimelineComponent],
	providers:[CandexService]
})
export class InterviewProcessTimelineModule{}
