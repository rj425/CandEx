import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManageRequestsComponent } from './manageRequests.component';
import { LoginGuard } from '../../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'manageRequests', component: ManageRequestsComponent,canActivate:[LoginGuard]}
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class ManageRequestsRoutingModule { }
