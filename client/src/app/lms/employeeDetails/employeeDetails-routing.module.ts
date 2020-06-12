import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeeDetailsComponent } from './employeeDetails.component';
import { LoginGuard } from '../../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'employeeDetails/:candidateID', component: EmployeeDetailsComponent,canActivate:[LoginGuard] }
      
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class EmployeeDetailsRoutingModule { }