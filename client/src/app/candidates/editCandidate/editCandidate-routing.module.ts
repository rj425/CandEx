import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditCandidateComponent } from './editCandidate.component';
import { LoginGuard } from '../../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'editCandidate/:candidateID',component:EditCandidateComponent,canActivate:[LoginGuard]},
      { path: 'editCandidate/:candidateID/:selectedIndex',component:EditCandidateComponent,canActivate:[LoginGuard]}
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class EditCandidateRoutingModule {}
