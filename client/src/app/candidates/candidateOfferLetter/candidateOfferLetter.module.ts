import { NgModule } from '@angular/core';
import { Validators} from '@angular/forms';
import { CommonModule,DatePipe } from '@angular/common';
import { CandidateofferletterComponent } from './candidateOfferLetter.component';
import { CandidateofferletterRoutingModule } from './candidateOfferLetter-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { OfferLetterAttachAComponent } from './offerLetterAttachA/offerLetterAttachA.component';
import { OfferLetterAttachBComponent } from './offerLetterAttachB/offerLetterAttachB.component';
import { OfferLetterAttachCComponent } from './offerLetterAttachC/offerLetterAttachC.component';

@NgModule({
  
  imports: [
    FormsModule,
    ReactiveFormsModule, 
    MatFormFieldModule,
    CommonModule,
    CandidateofferletterRoutingModule,
    SharedModule
  ],
  declarations: [CandidateofferletterComponent, OfferLetterAttachAComponent, OfferLetterAttachBComponent, OfferLetterAttachCComponent],
  exports: [CandidateofferletterComponent],
  providers:[DatePipe]
})
export class CandidateofferletterModule { }