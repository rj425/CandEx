import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateComponent } from './candidates.component';
import { LoginGuard } from '../shared/index'
import { CandidateFeedbackComponent } from './candidateFeedback/candidateFeedback.component'
@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'candidates', component: CandidateComponent,canActivate:[LoginGuard]},
      { path: 'candidateFeedback', component: CandidateFeedbackComponent}
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class CandidateRoutingModule { }
