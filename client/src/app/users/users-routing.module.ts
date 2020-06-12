import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './users.component';
import { LoginGuard } from '../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'user', component: UserComponent,canActivate:[LoginGuard]},
      { path: 'editUsers/:userID', component: UserComponent,canActivate:[LoginGuard]},
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class UserRoutingModule { }
