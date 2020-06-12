import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateEngagementComponent } from './candidateEngagement.component';
import { LoginGuard } from '../../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'candidateEngagement/:candidateID', component: CandidateEngagementComponent,canActivate:[LoginGuard]}
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class CandidateEngagementRoutingModule {}
