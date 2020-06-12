import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RequestsComponent } from './requests.component';
import { LoginGuard } from '../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'requests', component: RequestsComponent,canActivate:[LoginGuard] },
      { path: 'editRequest/:requestID',component: RequestsComponent,canActivate:[LoginGuard]},
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class RequestsRoutingModule { }
