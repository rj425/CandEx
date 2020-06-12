import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ListCandidateComponent,DropCandidateDialog,FeedbackDialog} from './listCandidates.component';
import { ListCandidateRoutingModule } from './listCandidates-routing.module';
import { CandexService } from '../../shared/service/candex.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, ListCandidateRoutingModule,FormsModule, HttpModule,SharedModule,ReactiveFormsModule],
  declarations: [ListCandidateComponent,DropCandidateDialog,FeedbackDialog] ,
  entryComponents:[DropCandidateDialog,FeedbackDialog],
  exports: [ListCandidateComponent],
  providers: [CandexService]
}) 
export class listCandidateModule { }
