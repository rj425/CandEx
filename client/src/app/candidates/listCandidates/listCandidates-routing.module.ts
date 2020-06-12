import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCandidateComponent } from './listCandidates.component';
import { LoginGuard } from '../../shared/index';
import { EmployeeDetailsComponent } from '../../lms/employeeDetails/employeeDetails.component'
import { CandidateFeedbackComponent } from '../candidateFeedback/candidateFeedback.component'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'manageCandidates', component: ListCandidateComponent,canActivate:[LoginGuard] },
      { path: 'manageRequests/:requestID/candidates', component: ListCandidateComponent,canActivate:[LoginGuard] },
      { path: 'employeeDetails', component: EmployeeDetailsComponent,canActivate:[LoginGuard] }
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class ListCandidateRoutingModule { }
