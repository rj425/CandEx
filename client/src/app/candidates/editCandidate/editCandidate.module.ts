import { NgModule } from '@angular/core';
import {EditCandidateComponent} from './editCandidate.component';
import {EditCandidateRoutingModule} from './editCandidate-routing.module';
import { CandexService } from '../../shared/index'
import { SharedModule } from '../../shared/shared.module';
import { SafePipe} from './safePipe';

@NgModule({
  imports: [EditCandidateRoutingModule,SharedModule],
  declarations: [EditCandidateComponent,SafePipe], 
  exports: [EditCandidateComponent],
  providers: [CandexService]
}) 
export class EditCandidateModule {}
